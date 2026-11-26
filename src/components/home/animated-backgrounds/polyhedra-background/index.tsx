import {
  CSSProperties,
  useEffect,
  useRef,
} from "react";

type RGBColor = {
  r: number;
  g: number;
  b: number;
};

const DEFAULT_GLOW_COLORS: readonly RGBColor[] = [
  { r: 36, g: 211, b: 238 }, // teal
  { r: 40, g: 182, b: 255 }, // cyan
  { r: 92, g: 137, b: 255 }, // blue
  { r: 139, g: 89, b: 255 }, // violet
  { r: 182, g: 106, b: 255 }, // soft purple
];
const WHITE: RGBColor = { r: 255, g: 255, b: 255 };
const blendRGB = (a: RGBColor, b: RGBColor, t: number): RGBColor => ({
  r: mix(a.r, b.r, t), g: mix(a.g, b.g, t), b: mix(a.b, b.b, t),
});

type PolyhedraBackgroundProps = {
  className?: string;
  style?: CSSProperties;

  objectCount?: number;

  minSize?: number;
  maxSize?: number;

  baseColor?: RGBColor;
  hoverColor?: RGBColor;
  rimLightColor?: RGBColor;
  /** Cyclic accent palette. Pass [] to disable palette accents. */
  glowColors?: readonly RGBColor[];
  /** 0 disables the additional glow; 1.25 is the default. Range 0–2. */
  glowIntensity?: number;
  /** Palette steps per second; 0 freezes the spatial color gradient. */
  colorShiftSpeed?: number;

  /** Local front-to-back lighting and focus contrast: 0–4. 1 = previous rendering. */
  depthContrast?: number;
  objectOpacity?: number;
  connectionOpacity?: number;

  connectionDistance?: number;

  /** @deprecated Retained for compatibility; pointer movement no longer applies forces. */
  mouseRepelRadius?: number;
  /** @deprecated Retained for compatibility; pointer movement no longer applies forces. */
  mouseRepelStrength?: number;

  hoverRadius?: number;

  wallBounce?: number;
  compressionAmount?: number;
  compressionRecovery?: number;
};

type Point3D = {
  x: number;
  y: number;
  z: number;
};

type Point2D = {
  x: number;
  y: number;
  scale: number;
  z: number;
};

type Rotation = {
  x: number;
  y: number;
  z: number;
};

type Geometry = {
  vertices: Point3D[];
  edges: Array<[number, number]>;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

type InternalConfig = {
  objectCount: number;

  minSize: number;
  maxSize: number;

  minSpeed: number;
  maxSpeed: number;
  maxVelocity: number;
  damping: number;

  wallBounce: number;
  compressionAmount: number;
  compressionRecovery: number;
  minimumCompression: number;

  maxRotationSpeed: number;

  connectionDistance: number;

  baseColor: RGBColor;
  hoverColor: RGBColor;
  rimLightColor?: RGBColor;

  objectOpacity: number;
  connectionOpacity: number;

  objectLineWidth: number;
  connectionLineWidth: number;

  perspective: number;

  hoverRadius: number;
  hoverEase: number;

};

const random = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const randomInt = (min: number, max: number) =>
  Math.floor(random(min, max + 1));

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const mix = (a: number, b: number, amount: number) =>
  a + (b - a) * amount;

const mixColor = (
  colorA: RGBColor,
  colorB: RGBColor,
  amount: number,
  alpha = 1
) => {
  const r = Math.round(mix(colorA.r, colorB.r, amount));
  const g = Math.round(mix(colorA.g, colorB.g, amount));
  const b = Math.round(mix(colorA.b, colorB.b, amount));

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const distance2D = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const dx = x2 - x1;
  const dy = y2 - y1;

  return Math.sqrt(dx * dx + dy * dy);
};

const subtract = (a: Point3D, b: Point3D): Point3D => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z,
});

const cross = (a: Point3D, b: Point3D): Point3D => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

const dot = (a: Point3D, b: Point3D) =>
  a.x * b.x + a.y * b.y + a.z * b.z;

const rotatePoint = (
  point: Point3D,
  rotation: Rotation
): Point3D => {
  let { x, y, z } = point;

  const cosX = Math.cos(rotation.x);
  const sinX = Math.sin(rotation.x);

  const cosY = Math.cos(rotation.y);
  const sinY = Math.sin(rotation.y);

  const cosZ = Math.cos(rotation.z);
  const sinZ = Math.sin(rotation.z);

  const rotatedY = y * cosX - z * sinX;
  const rotatedZ = y * sinX + z * cosX;

  y = rotatedY;
  z = rotatedZ;

  const rotatedX = x * cosY + z * sinY;
  const rotatedZ2 = -x * sinY + z * cosY;

  x = rotatedX;
  z = rotatedZ2;

  const finalX = x * cosZ - y * sinZ;
  const finalY = x * sinZ + y * cosZ;

  return {
    x: finalX,
    y: finalY,
    z,
  };
};

const projectPoint = (
  point: Point3D,
  centerX: number,
  centerY: number,
  perspective: number
): Point2D => {
  const denominator = Math.max(100, perspective + point.z);
  const scale = perspective / denominator;

  return {
    x: centerX + point.x * scale,
    y: centerY + point.y * scale,
    scale,
    z: point.z,
  };
};

const makeRandomPoints = (): Point3D[] => {
  const count = randomInt(8, 13);
  const points: Point3D[] = [];

  const scaleX = random(0.78, 1.3);
  const scaleY = random(0.78, 1.3);
  const scaleZ = random(0.78, 1.3);

  for (let index = 0; index < count; index++) {
    const theta = random(0, Math.PI * 2);
    const phi = Math.acos(random(-1, 1));
    const radius = random(0.72, 1);

    points.push({
      x:
        Math.sin(phi) *
        Math.cos(theta) *
        radius *
        scaleX,

      y:
        Math.sin(phi) *
        Math.sin(theta) *
        radius *
        scaleY,

      z:
        Math.cos(phi) *
        radius *
        scaleZ,
    });
  }

  return points;
};

const computeConvexHullEdges = (
  points: Point3D[]
): Array<[number, number]> => {
  const epsilon = 0.000001;
  const edges = new Set<string>();
  const count = points.length;

  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      for (let k = j + 1; k < count; k++) {
        const a = points[i];
        const b = points[j];
        const c = points[k];

        const ab = subtract(b, a);
        const ac = subtract(c, a);
        const normal = cross(ab, ac);

        const normalLengthSquared =
          normal.x * normal.x +
          normal.y * normal.y +
          normal.z * normal.z;

        if (normalLengthSquared < epsilon) {
          continue;
        }

        let positive = 0;
        let negative = 0;

        for (let m = 0; m < count; m++) {
          if (m === i || m === j || m === k) {
            continue;
          }

          const direction = subtract(points[m], a);
          const side = dot(normal, direction);

          if (side > epsilon) {
            positive++;
          } else if (side < -epsilon) {
            negative++;
          }

          if (positive > 0 && negative > 0) {
            break;
          }
        }

        if (positive > 0 && negative > 0) {
          continue;
        }

        edges.add(`${Math.min(i, j)}-${Math.max(i, j)}`);
        edges.add(`${Math.min(j, k)}-${Math.max(j, k)}`);
        edges.add(`${Math.min(i, k)}-${Math.max(i, k)}`);
      }
    }
  }

  return Array.from(edges).map((edge) => {
    const [start, end] = edge.split("-").map(Number);

    return [start, end];
  });
};

const createConvexGeometry = (): Geometry => {
  const vertices = makeRandomPoints();

  return {
    vertices,
    edges: computeConvexHullEdges(vertices),
  };
};

// Native vector strokes provide the in-focus core; cached Gaussian
// textures supply only the defocused component. Both use the same depth
// coordinate and color palette, with a continuous crossfade.
const softWeight = (depth: number) => {
  const t = clamp((depth - 0.10) / 0.62, 0, 1);
  return t * t * (3 - 2 * t);
};
const depthBrightness = (depth: number) => Math.exp(-3.5 * Math.pow(depth, 1.65));

// Preserve the center depth of each object, amplify only the local depth
// difference, and approach the near/far bounds smoothly without clipping.
const contrastDepth = (z: number, centerZ: number, limit: number, contrast: number) => {
  const center = clamp((centerZ + limit) / (2 * limit), 0, 1);
  const depth = clamp((z + limit) / (2 * limit), 0, 1);
  const delta = depth - center;
  const headroom = delta < 0 ? center : 1 - center;
  if (headroom < 1e-6 || Math.abs(delta) < 1e-6 || contrast === 0) return center;
  const fraction = clamp(Math.abs(delta) / headroom, 0, 1);
  return clamp(center + Math.sign(delta) * headroom * (1 - Math.pow(1 - fraction, contrast)), 0, 1);
};

// One cached depth/coverage texture per hover color. X encodes depth;
// Y encodes a Gaussian cross-section in screen pixels. An entire edge
// samples a continuous interval of this texture, without depth-band seams.
class DepthBlurRenderer {
  private cache = new Map<number, HTMLCanvasElement>();
  private accentCache = new Map<RGBColor, HTMLCanvasElement>();
  private readonly textureWidth = 512;
  private readonly textureHeight = 256;
  private readonly halfWidth = 12;

  private texture(base: RGBColor, hover: RGBColor, hoverMix: number, rim?: RGBColor, _glowIntensity = 0, accent?: RGBColor) {
    const step = Math.round(clamp(hoverMix, 0, 1) * 32);
    const existing = accent ? this.accentCache.get(accent) : this.cache.get(step);
    if (existing) return existing;
    const canvas = document.createElement("canvas");
    canvas.width = this.textureWidth;
    canvas.height = this.textureHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const image = ctx.createImageData(canvas.width, canvas.height);
    const color = {
      r: mix(base.r, hover.r, step / 32),
      g: mix(base.g, hover.g, step / 32),
      b: mix(base.b, hover.b, step / 32),
    };
    for (let x = 0; x < canvas.width; x++) {
      const depth = x / (canvas.width - 1);
      // Sharp, luminous near lines; progressively wider and dimmer far lines.
      const sigma = 0.52 + 2.66 * Math.pow(depth, 1.65);
      const peak = depthBrightness(depth) * softWeight(depth);
      const rimMix = rim ? 0.30 * Math.pow(1 - depth, 2) : 0;
      const whitening = 0;
      // Accent textures are independent of hover and phase, so their cache
      // remains bounded. Hover still changes the sharp core and overall opacity.
      const pale = accent ? blendRGB(accent, WHITE, 0.12) : blendRGB(blendRGB(color, rim ?? color, rimMix), WHITE, whitening);
      const {r, g, b} = pale;
      for (let y = 0; y < canvas.height; y++) {
        const offset = ((y + 0.5) / canvas.height * 2 - 1) * this.halfWidth;
        const coverage = Math.exp(-0.5 * (offset / sigma) ** 2);
        const i = (y * canvas.width + x) * 4;
        image.data[i] = r;
        image.data[i + 1] = g;
        image.data[i + 2] = b;
        image.data[i + 3] = Math.round(255 * peak * coverage);
      }
    }
    ctx.putImageData(image, 0, 0);
    if (accent) this.accentCache.set(accent, canvas);
    else this.cache.set(step, canvas);
    return canvas;
  }

  draw(ctx: CanvasRenderingContext2D, start: Point2D, end: Point2D,
    depthLimit: number, centerZ: number, depthContrast: number, alpha: number, base: RGBColor, hover: RGBColor,
    hoverMix: number, rim?: RGBColor, glowStart?: RGBColor, glowEnd?: RGBColor, glowIntensity = 0, softAccent?: PaletteSample) {
    // Always map the source from near to far, reversing the edge as needed.
    if (start.z > end.z) { [start, end] = [end, start]; [glowStart, glowEnd] = [glowEnd, glowStart]; }
    const dx = end.x - start.x, dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    if (length < 0.001) return;
    // Linear interpolation in projected screen space approximates perspective
    // depth smoothly across the entire edge.
    const near = contrastDepth(start.z, centerZ, depthLimit, depthContrast);
    const far = contrastDepth(end.z, centerZ, depthLimit, depthContrast);
    // Draw the softer layer only where it contributes. No Canvas filters.
    const texture = far > 0.10 ? this.texture(base, hover, hoverMix, rim, glowIntensity, softAccent?.a) : null;
    const secondTexture = texture && softAccent && softAccent.a !== softAccent.b && softAccent.t > 0.001
      ? this.texture(base, hover, hoverMix, rim, glowIntensity, softAccent.b) : null;
    const span = Math.max(1, (far - near) * (this.textureWidth - 1));
    const center = 0.5 + (near + far) * 0.5 * (this.textureWidth - 1);
    const sourceX = clamp(center - span / 2, 0, this.textureWidth - span);
    if (texture) {
      ctx.save();
      ctx.translate(start.x, start.y);
      ctx.rotate(Math.atan2(dy, dx));
      const weight = secondTexture ? softAccent!.t : 0;
      ctx.globalAlpha = clamp(alpha * (1 - weight), 0, 1);
      ctx.drawImage(texture, sourceX, 0, span, this.textureHeight,
        0, -this.halfWidth, length, this.halfWidth * 2);
      if (secondTexture) {
        ctx.globalAlpha = clamp(alpha * weight, 0, 1);
        ctx.drawImage(secondTexture, sourceX, 0, span, this.textureHeight,
          0, -this.halfWidth, length, this.halfWidth * 2);
      }
      ctx.restore();
    }
    // Native antialiased line: interpolate lighting continuously at the
    // endpoints and intermediate stops. Width follows average edge depth.
    if (near >= 0.72) return;
    const color = {
      r: mix(base.r, hover.r, hoverMix),
      g: mix(base.g, hover.g, hoverMix),
      b: mix(base.b, hover.b, hoverMix),
    };
    const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const depth = mix(near, far, t);
      const rimMix = rim ? 0.30 * (1 - depth) ** 2 : 0;
      const accentA = glowStart ?? color, accentB = glowEnd ?? color;
      const accent = { r: mix(accentA.r, accentB.r, t), g: mix(accentA.g, accentB.g, t), b: mix(accentA.b, accentB.b, t) };
      const lit = { r: mix(color.r, rim?.r ?? color.r, rimMix), g: mix(color.g, rim?.g ?? color.g, rimMix), b: mix(color.b, rim?.b ?? color.b, rimMix) };
      const whitening = glowStart && glowEnd ? 0.19 : 0;
      const accentMix = glowStart && glowEnd ? 0.96 : 0;
      const pale = { r: mix(mix(lit.r, accent.r, accentMix), 255, whitening), g: mix(mix(lit.g, accent.g, accentMix), 255, whitening), b: mix(mix(lit.b, accent.b, accentMix), 255, whitening) };
      gradient.addColorStop(t, mixColor(pale, pale, 0,
        clamp(alpha * (glowStart && glowEnd ? 1.22 : 1) * depthBrightness(depth) * (1 - softWeight(depth)), 0, 1)));
    }
    ctx.lineWidth = mix(1.65, 0.72, (near + far) / 2);
    ctx.lineCap = "round";
    ctx.strokeStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
}

// Small, reusable sprites: no per-frame blur, shadowBlur, or full-screen pass.
type PaletteSample = { a: RGBColor; b: RGBColor; t: number; index: number; next: number; color: RGBColor };
class VertexGlowRenderer {
  readonly colors: readonly RGBColor[];
  private readonly sprites: HTMLCanvasElement[];
  constructor(colors: readonly RGBColor[], readonly intensity: number) {
    this.colors = colors;
    this.sprites = intensity > 0 ? colors.map(color => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (!ctx) return canvas;
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      const white = { r: 255, g: 255, b: 255 };
      gradient.addColorStop(0, mixColor(color, white, 0.98, 1));
      gradient.addColorStop(0.075, mixColor(color, white, 0.92, 1));
      gradient.addColorStop(0.16, mixColor(color, white, 0.40, 0.86));
      gradient.addColorStop(0.29, mixColor(color, white, 0.18, 0.58));
      gradient.addColorStop(0.50, mixColor(color, white, 0.08, 0.26));
      gradient.addColorStop(0.76, mixColor(color, white, 0.03, 0.065));
      gradient.addColorStop(1, mixColor(color, color, 0, 0));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
      return canvas;
    }) : [];
  }
  sample(phase: number): PaletteSample | undefined {
    const n = this.colors.length;
    if (!n || this.intensity <= 0) return undefined;
    const wrapped = ((phase % n) + n) % n;
    const index = Math.floor(wrapped), next = (index + 1) % n;
    const t = wrapped - index;
    const a = this.colors[index], b = this.colors[next];
    return { a, b, t, index, next, color: blendRGB(a, b, t) };
  }
  draw(ctx: CanvasRenderingContext2D, vertex: Point2D, depth: number, sample: PaletteSample,
    strength: number, opacity: number) {
    const alpha = clamp(this.intensity * opacity * strength * 1.65 * Math.pow(depthBrightness(depth), 1.10), 0, 1);
    if (alpha < 0.008) return;
    const radius = mix(17.5, 23.0, depth) * strength ** 0.25;
    const x = vertex.x - radius, y = vertex.y - radius, size = radius * 2;
    const t = sample.index === sample.next ? 0 : sample.t;
    ctx.globalAlpha = alpha * (1 - t);
    ctx.drawImage(this.sprites[sample.index], x, y, size, size);
    if (t > 0.001) {
      ctx.globalAlpha = alpha * t;
      ctx.drawImage(this.sprites[sample.next], x, y, size, size);
    }
  }
  drawCore(ctx: CanvasRenderingContext2D, vertex: Point2D, depth: number, accent: RGBColor, opacity: number) {
    if (!accent) return;
    // Native antialiased circles at the bright vertices. Their sharp cores
    // disappear continuously into the existing soft halo with depth.
    const alpha = clamp(this.intensity * opacity * 3.8 * depthBrightness(depth) * (1 - softWeight(depth)), 0, 1);
    if (alpha < 0.008) return;
    const radius = mix(2.55, 1.15, depth);
    ctx.fillStyle = mixColor(accent, {r:255,g:255,b:255}, 0.96, alpha);
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Polyhedron {
  geometry: Geometry;

  size: number;

  x: number;
  y: number;

  vx: number;
  vy: number;

  rotation: Rotation;
  rotationVelocity: Rotation;

  depth: number;
  hoverMix: number;
  glowSeed = Math.random();
  private readonly glowNodes: number[];

  scaleX: number;
  scaleY: number;

  targetScaleX: number;
  targetScaleY: number;

  constructor(
    width: number,
    height: number,
    private config: InternalConfig
  ) {
    this.geometry = createConvexGeometry();
    this.glowNodes = this.geometry.vertices.map(() => Math.random());
    this.size = random(config.minSize, config.maxSize);

    const safeWidth = Math.max(this.size, width - this.size);
    const safeHeight = Math.max(this.size, height - this.size);

    this.x = random(this.size, safeWidth);
    this.y = random(this.size, safeHeight);

    const direction = random(0, Math.PI * 2);
    const speed = random(config.minSpeed, config.maxSpeed);

    this.vx = Math.cos(direction) * speed;
    this.vy = Math.sin(direction) * speed;

    this.rotation = {
      x: random(0, Math.PI * 2),
      y: random(0, Math.PI * 2),
      z: random(0, Math.PI * 2),
    };

    this.rotationVelocity = {
      x: random(
        -config.maxRotationSpeed,
        config.maxRotationSpeed
      ),
      y: random(
        -config.maxRotationSpeed,
        config.maxRotationSpeed
      ),
      z: random(
        -config.maxRotationSpeed,
        config.maxRotationSpeed
      ),
    };

    this.depth = random(-180, 180);
    this.hoverMix = 0;

    this.scaleX = 1;
    this.scaleY = 1;

    this.targetScaleX = 1;
    this.targetScaleY = 1;
  }

  // Map positions between the usable travel ranges, rather than clamping
  // all objects to the same wall when the canvas shrinks.
  resizeBounds(oldWidth: number, oldHeight: number, width: number, height: number) {
    const radius = this.getCollisionRadius();
    const remap = (position: number, oldExtent: number, extent: number) => {
      const oldRoom = oldExtent - 2 * radius;
      const room = extent - 2 * radius;
      if (room <= 0) return extent / 2;
      const fraction = oldRoom > 0
        ? clamp((position - radius) / oldRoom, 0, 1)
        : 0.5;
      return radius + fraction * room;
    };
    this.x = remap(this.x, oldWidth, width);
    this.y = remap(this.y, oldHeight, height);
  }

  private getCollisionRadius() {
    return this.size * 0.92;
  }

  private updateHoverLighting(pointer: PointerState) {
    if (!pointer.active) {
      this.hoverMix = mix(
        this.hoverMix,
        0,
        this.config.hoverEase
      );

      return;
    }

    const dx = this.x - pointer.x;
    const dy = this.y - pointer.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 0.0001;

    const hoverTarget =
      distance < this.config.hoverRadius
        ? 1 - distance / this.config.hoverRadius
        : 0;

    this.hoverMix = mix(
      this.hoverMix,
      hoverTarget,
      this.config.hoverEase
    );
  }

  private limitVelocity() {
    const speed = Math.sqrt(
      this.vx * this.vx +
      this.vy * this.vy
    );

    if (speed <= this.config.maxVelocity) {
      return;
    }

    const ratio = this.config.maxVelocity / speed;

    this.vx *= ratio;
    this.vy *= ratio;
  }

  private compressOnImpact(
    axis: "x" | "y",
    impactSpeed: number
  ) {
    const compression = clamp(
      1 -
        impactSpeed *
          this.config.compressionAmount,

      this.config.minimumCompression,
      1
    );

    const stretch =
      1 + (1 - compression) * 0.32;

    if (axis === "x") {
      this.targetScaleX = Math.min(
        this.targetScaleX,
        compression
      );

      this.targetScaleY = Math.max(
        this.targetScaleY,
        stretch
      );

      this.rotationVelocity.y *= -1;
      this.rotationVelocity.z += random(
        -0.0025,
        0.0025
      );
    }

    if (axis === "y") {
      this.targetScaleY = Math.min(
        this.targetScaleY,
        compression
      );

      this.targetScaleX = Math.max(
        this.targetScaleX,
        stretch
      );

      this.rotationVelocity.x *= -1;
      this.rotationVelocity.z += random(
        -0.0025,
        0.0025
      );
    }
  }

  private handleWallCollisions(
    width: number,
    height: number
  ) {
    const radius = this.getCollisionRadius();

    let hitX = false;
    let hitY = false;

    let xImpactSpeed = 0;
    let yImpactSpeed = 0;

    // An axis without enough room must not produce repeated impacts.
    // Clamp positions, but bounce only when moving out through a wall.
    if (width <= radius * 2) {
      this.x = width / 2;
    } else if (this.x < radius) {
      this.x = radius;
      if (this.vx < 0) {
        xImpactSpeed = -this.vx;
        this.vx = xImpactSpeed * this.config.wallBounce;
        hitX = true;
      }
    } else if (this.x > width - radius) {
      this.x = width - radius;
      if (this.vx > 0) {
        xImpactSpeed = this.vx;
        this.vx = -xImpactSpeed * this.config.wallBounce;
        hitX = true;
      }
    }

    if (height <= radius * 2) {
      this.y = height / 2;
    } else if (this.y < radius) {
      this.y = radius;
      if (this.vy < 0) {
        yImpactSpeed = -this.vy;
        this.vy = yImpactSpeed * this.config.wallBounce;
        hitY = true;
      }
    } else if (this.y > height - radius) {
      this.y = height - radius;
      if (this.vy > 0) {
        yImpactSpeed = this.vy;
        this.vy = -yImpactSpeed * this.config.wallBounce;
        hitY = true;
      }
    }

    if (hitX) {
      this.compressOnImpact("x", xImpactSpeed);
    }

    if (hitY) {
      this.compressOnImpact("y", yImpactSpeed);
    }

    if (hitX && hitY) {
      const cornerImpact = Math.sqrt(
        xImpactSpeed * xImpactSpeed +
        yImpactSpeed * yImpactSpeed
      );

      const compression = clamp(
        1 -
          cornerImpact *
            this.config.compressionAmount *
            0.8,

        this.config.minimumCompression,
        1
      );

      this.targetScaleX = Math.min(
        this.targetScaleX,
        compression
      );

      this.targetScaleY = Math.min(
        this.targetScaleY,
        compression
      );

      this.rotationVelocity.x += random(
        -0.003,
        0.003
      );

      this.rotationVelocity.y += random(
        -0.003,
        0.003
      );

      this.rotationVelocity.z += random(
        -0.004,
        0.004
      );
    }
  }

  private recoverShape() {
    this.scaleX = mix(
      this.scaleX,
      this.targetScaleX,
      this.config.compressionRecovery
    );

    this.scaleY = mix(
      this.scaleY,
      this.targetScaleY,
      this.config.compressionRecovery
    );

    const recovery =
      this.config.compressionRecovery * 0.72;

    this.targetScaleX = mix(
      this.targetScaleX,
      1,
      recovery
    );

    this.targetScaleY = mix(
      this.targetScaleY,
      1,
      recovery
    );
  }

  update(
    pointer: PointerState,
    width: number,
    height: number
  ) {
    this.updateHoverLighting(pointer);
    this.limitVelocity();

    this.vx *= this.config.damping;
    this.vy *= this.config.damping;

    this.x += this.vx;
    this.y += this.vy;

    this.rotation.x += this.rotationVelocity.x;
    this.rotation.y += this.rotationVelocity.y;
    this.rotation.z += this.rotationVelocity.z;

    this.handleWallCollisions(width, height);
    // Collision impulses must never accumulate into runaway spinning.
    const maxRotation = this.config.maxRotationSpeed;
    this.rotationVelocity.x = clamp(this.rotationVelocity.x, -maxRotation, maxRotation);
    this.rotationVelocity.y = clamp(this.rotationVelocity.y, -maxRotation, maxRotation);
    this.rotationVelocity.z = clamp(this.rotationVelocity.z, -maxRotation, maxRotation);
    this.recoverShape();
  }

  private getProjectedVertices() {
    return this.geometry.vertices.map((vertex) => {
      const scaled: Point3D = {
        x:
          vertex.x *
          this.size *
          this.scaleX,

        y:
          vertex.y *
          this.size *
          this.scaleY,

        z:
          vertex.z * this.size,
      };

      const rotated = rotatePoint(
        scaled,
        this.rotation
      );

      return projectPoint(
        { ...rotated, z: rotated.z + this.depth },
        this.x,
        this.y,
        this.config.perspective
      );
    });
  }

  draw(ctx: CanvasRenderingContext2D, blurRenderer: DepthBlurRenderer, depthContrast: number, glow: VertexGlowRenderer, palettePhase: number, sceneScale: number, lightingBoost: number) {
    // Project geometry to CSS pixels; line widths and halos are not scene-scaled.
    const vertices = this.getProjectedVertices().map(v => ({ ...v, x: v.x * sceneScale, y: v.y * sceneScale }));
    const depthLimit = 180 + this.config.maxSize * 1.3;
    const opacity = this.config.objectOpacity * (1 + this.hoverMix * 0.35) * lightingBoost;
    const paletteSize = glow.colors.length;
    // A continuous spatial field anchored to the rotating geometry. Adjacent
    // vertices share the same palette field, and the field drifts slowly.
    const phase = this.glowSeed * paletteSize + palettePhase;
    const phases = this.geometry.vertices.map(v => phase + v.x * 0.65 + v.y * 0.32 + v.z * 0.22);
    const samples = phases.map(p => glow.sample(p));
    const used = new Set(this.geometry.edges.flat());
    if (glow.intensity > 0 && paletteSize) {
      ctx.save();
      for (const i of used) {
        const v = vertices[i];
        const depth = contrastDepth(v.z, this.depth, depthLimit, depthContrast);
        const strength = mix(0.55, 1.0, this.glowNodes[i] ** 1.5);
        if (samples[i]) glow.draw(ctx, v, depth, samples[i]!, strength, opacity);
      }
      ctx.restore();
    }
    // Far edges first; every edge uses the same continuous lighting function.
    const edges = this.geometry.edges.slice().sort(([a, b], [c, d]) =>
      (vertices[c].z + vertices[d].z) - (vertices[a].z + vertices[b].z));
    for (const [a, b] of edges) {
      blurRenderer.draw(ctx, vertices[a], vertices[b], depthLimit, this.depth, depthContrast, opacity,
        this.config.baseColor, this.config.hoverColor, this.hoverMix,
        this.config.rimLightColor, samples[a]?.color, samples[b]?.color, glow.intensity,
        glow.sample((phases[a] + phases[b]) / 2));
    }
    if (glow.intensity > 0 && paletteSize) {
      ctx.save();
      for (const i of used) {
        const v = vertices[i];
        const depth = contrastDepth(v.z, this.depth, depthLimit, depthContrast);
        if (samples[i]) glow.drawCore(ctx, v, depth, samples[i]!.color, opacity);
      }
      ctx.restore();
    }
  }

}

export function PolyhedraBackground({
  className,
  style,

  objectCount = 7,

  minSize = 70,
  maxSize = 120,

  baseColor = { r: 0, g: 0, b: 0 },
  hoverColor = { r: 126, g: 87, b: 255 },
  rimLightColor,
  glowColors = DEFAULT_GLOW_COLORS,
  glowIntensity = 1.85,
  colorShiftSpeed = 0.075,

  depthContrast = 2.9,
  objectOpacity = 0.64,
  connectionOpacity = 0.11,

  connectionDistance = 270,


  hoverRadius = 165,

  wallBounce = 0.94,
  compressionAmount = 0.14,
  compressionRecovery = 0.08,
}: PolyhedraBackgroundProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);
  // Stable value key: inline arrays with unchanged RGB values do not restart the simulation.
  const glowPaletteKey = JSON.stringify(glowColors
    .filter(c => [c.r, c.g, c.b].every(Number.isFinite)).slice(0, 8)
    .map(c => ({ r: clamp(c.r, 0, 255), g: clamp(c.g, 0, 255), b: clamp(c.b, 0, 255) })));
  const contrastRef = useRef(clamp(depthContrast, 0, 4));
  const shiftSpeedRef = useRef(0.075);
  useEffect(() => {
    shiftSpeedRef.current = clamp(Number.isFinite(colorShiftSpeed) ? colorShiftSpeed : 0.075, 0, 2);
  }, [colorShiftSpeed]);
  const redrawStaticRef = useRef<() => void>(() => {});
  useEffect(() => {
    contrastRef.current = clamp(Number.isFinite(depthContrast) ? depthContrast : 2.9, 0, 4);
    redrawStaticRef.current();
  }, [depthContrast]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d", {
      alpha: true,
    });

    if (!ctx) {
      return;
    }

    const config: InternalConfig = {
      objectCount: clamp(Math.floor(objectCount), 0, 24),

      minSize,
      maxSize,

      minSpeed: 0.08,
      maxSpeed: 0.18,
      maxVelocity: 2.2,
      damping: 0.997,

      wallBounce,
      compressionAmount,
      compressionRecovery,
      minimumCompression: 0.76,

      maxRotationSpeed: 0.0035,

      connectionDistance,

      baseColor,
      hoverColor,
      rimLightColor,

      objectOpacity,
      connectionOpacity,

      objectLineWidth: 1.15,
      connectionLineWidth: 0.85,

      perspective: 760,

      hoverRadius,
      hoverEase: 0.09,

    };

    const pointer: PointerState = {
      x: 0,
      y: 0,
      active: false,
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let sceneScale = 1;
    let lightingBoost = 1;
    let drawable = false;
    let animationFrame = 0;
    let lastFrame = 0;
    let palettePhase = 0;
    let visible = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const blurRenderer = new DepthBlurRenderer();
    const glowRenderer = new VertexGlowRenderer(JSON.parse(glowPaletteKey), clamp(Number.isFinite(glowIntensity) ? glowIntensity : 1.85, 0, 2));

    let objects: Polyhedron[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const cssWidth = rect.width;
      const cssHeight = rect.height;
      // Preserve the last valid simulation state if the element is hidden
      // or temporarily collapsed during a layout transition.
      drawable = cssWidth >= 2 && cssHeight >= 2;
      pointer.active = false;
      if (!drawable) {
        if (canvas.width !== 1) canvas.width = 1;
        if (canvas.height !== 1) canvas.height = 1;
        lastFrame = 0;
        return;
      }

      // Keep enough room for wall collisions in simulation space. Only
      // scale the rendered scene down on very constrained viewports.
      const minSceneExtent = Math.max(1, config.maxSize * 2.75);
      const oldWidth = width;
      const oldHeight = height;
      sceneScale = Math.min(1, cssWidth / minSceneExtent, cssHeight / minSceneExtent);
      // Compensate for a compact mobile composition without changing desktop lighting.
      lightingBoost = 1 + 0.45 * clamp((640 - cssWidth) / 240, 0, 1);
      width = cssWidth / sceneScale;
      height = cssHeight / sceneScale;
      if (oldWidth > 0 && oldHeight > 0 && (oldWidth !== width || oldHeight !== height)) {
        for (const object of objects) {
          object.resizeBounds(oldWidth, oldHeight, width, height);
        }
      }

      // Keep the existing Retina rendering and backing-pixel budget.
      dpr = Math.min(Math.max(1.5, (window.devicePixelRatio || 1) * 1.125), 2.5,
        Math.sqrt(6_000_000 / Math.max(1, cssWidth * cssHeight)));
      const pixelWidth = Math.max(1, Math.floor(cssWidth * dpr));
      const pixelHeight = Math.max(1, Math.floor(cssHeight * dpr));
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
      ctx.setTransform(pixelWidth / cssWidth, 0, 0, pixelHeight / cssHeight, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "low";
    };

    const createObjects = () => {
      if (!drawable) return;
      const positionedObjects: Polyhedron[] = [];
      for (let index = 0; index < config.objectCount; index++) {
        // Generate exactly one geometry per object; only retry position.
        const candidate = new Polyhedron(width, height, config);
        candidate.glowSeed = (index + random(0, 0.35)) / Math.max(1, config.objectCount);
        candidate.depth = mix(-160, 160, config.objectCount > 1 ? index / (config.objectCount - 1) : 0.5) + random(-15, 15);
        let bestX = candidate.x, bestY = candidate.y;
        let bestClearance = -Infinity;
        for (let attempt = 0; attempt < 24; attempt++) {
          const clearance = positionedObjects.reduce((minimum, existing) => Math.min(minimum, distance2D(candidate.x, candidate.y, existing.x, existing.y) - (candidate.size + existing.size) * 0.92), Infinity);
          if (clearance > bestClearance) {
            bestX = candidate.x; bestY = candidate.y; bestClearance = clearance;
          }
          if (clearance >= 0) break;
          candidate.x = random(candidate.size, Math.max(candidate.size, width - candidate.size));
          candidate.y = random(candidate.size, Math.max(candidate.size, height - candidate.size));
        }
        candidate.x = bestX; candidate.y = bestY;
        positionedObjects.push(candidate);
      }
      objects = positionedObjects.sort((a, b) => b.depth - a.depth);
    };

    const drawConnections = () => {
      ctx.save();

      ctx.lineWidth =
        config.connectionLineWidth;

      ctx.lineCap = "round";

      for (
        let i = 0;
        i < objects.length;
        i++
      ) {
        for (
          let j = i + 1;
          j < objects.length;
          j++
        ) {
          const first = objects[i];
          const second = objects[j];

          const distance = distance2D(
            first.x,
            first.y,
            second.x,
            second.y
          );

          if (
            distance >=
            config.connectionDistance
          ) {
            continue;
          }

          const alpha =
            (1 -
              distance /
                config.connectionDistance) *
            config.connectionOpacity * mix(0.85, 0.3, clamp((first.depth + second.depth + 360) / 720, 0, 1));

          const hoverMix = Math.max(
            first.hoverMix,
            second.hoverMix
          );

          ctx.strokeStyle = mixColor(
            config.baseColor,
            config.hoverColor,
            hoverMix,
            alpha
          );

          ctx.beginPath();
          ctx.moveTo(first.x * sceneScale, first.y * sceneScale);
          ctx.lineTo(second.x * sceneScale, second.y * sceneScale);
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    const render = () => {
      if (!drawable) return;
      ctx.clearRect(0, 0, width * sceneScale, height * sceneScale);
      drawConnections();
      for (const object of objects) object.draw(ctx, blurRenderer, contrastRef.current, glowRenderer, palettePhase, sceneScale, lightingBoost);
    };
    redrawStaticRef.current = () => { if (visible && reducedMotion.matches) render(); };
    const animate = (now: number) => {
      animationFrame = window.requestAnimationFrame(animate);
      if (!visible || reducedMotion.matches || document.hidden || !drawable) { lastFrame = 0; return; }
      // 30 FPS render budget; two original simulation steps per frame.
      const interval = 1000 / 30;
      const elapsed = now - lastFrame;
      if (lastFrame && elapsed < interval - 0.5) return;
      lastFrame = !lastFrame || elapsed > interval * 3 ? now : now - Math.max(0, elapsed - interval);
      palettePhase += shiftSpeedRef.current / 30;
      for (const object of objects) {
        object.update(pointer, width, height);
        object.update(pointer, width, height);
      }
      render();
    };

    const handlePointerMove = (
      event: PointerEvent
    ) => {
      const rect =
        canvas.getBoundingClientRect();

      pointer.x = (event.clientX - rect.left) / sceneScale;

      pointer.y = (event.clientY - rect.top) / sceneScale;

      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const resizeObserver =
      new ResizeObserver(() => {
        resize();

        if (objects.length === 0) {
          createObjects();
        }
        if (reducedMotion.matches) render();
      });

    resizeObserver.observe(canvas);
    const intersectionObserver = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible && reducedMotion.matches) render();
        }) : null;
    intersectionObserver?.observe(canvas);

    canvas.addEventListener(
      "pointermove",
      handlePointerMove
    );

    canvas.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    window.addEventListener(
      "blur",
      handlePointerLeave
    );

    resize();
    createObjects();
    render();
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      redrawStaticRef.current = () => {};
      window.cancelAnimationFrame(
        animationFrame
      );

      resizeObserver.disconnect();
      intersectionObserver?.disconnect();

      canvas.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      canvas.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );

      window.removeEventListener(
        "blur",
        handlePointerLeave
      );
    };
  }, [
    objectCount,
    minSize,
    maxSize,
    baseColor.r, baseColor.g, baseColor.b,
    hoverColor.r, hoverColor.g, hoverColor.b,
    rimLightColor?.r, rimLightColor?.g, rimLightColor?.b,
    glowPaletteKey, glowIntensity,
    objectOpacity,
    connectionOpacity,
    connectionDistance,
    hoverRadius,
    wallBounce,
    compressionAmount,
    compressionRecovery,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        background: "transparent",
        ...style,
      }}
    />
  );
}
