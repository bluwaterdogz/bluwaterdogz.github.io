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
  
  type Geometry = {
    vertices: Point3D[];
    edges: Array<[number, number]>;
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

    private texture(base: RGBColor, hover: RGBColor, hoverMix: number, rim?: RGBColor, glowIntensity = 0, accent?: RGBColor) {
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
      if (!n) return undefined;
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


/** Independent, transparent, drag-to-rotate canvas. No scene physics or dependencies. */
export type InteractivePolyhedronProps = {
  className?: string;
  style?: CSSProperties;
  baseColor?: RGBColor;
  hoverColor?: RGBColor;
  rimLightColor?: RGBColor;
  glowColors?: readonly RGBColor[];
  glowIntensity?: number;
  colorShiftSpeed?: number;
  depthContrast?: number;
  objectOpacity?: number;
  /** Fraction of the available diameter occupied by the shape (0.2–0.95). */
  fillRatio?: number;
  /** Drag response multiplier (0.2–3). */
  rotationSensitivity?: number;
  /** Preserve drag momentum, easing back to the resting spin speed after release. */
  inertia?: boolean;
  /** Optional automatic spin in radians per second; disabled by default. */
  autoRotateSpeed?: number;
  /** Resting spin in radians per second (0–5), initially around a random 3D axis. Drag momentum eases back to this speed. */
  initialSpinSpeed?: number;
};

type Quaternion = { x: number; y: number; z: number; w: number };
const identity = (): Quaternion => ({ x: 0, y: 0, z: 0, w: 1 });
const unit = (v: Point3D): Point3D => {
  const n = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x/n, y: v.y/n, z: v.z/n };
};
const normalizeQ = (q: Quaternion): Quaternion => {
  const n = Math.hypot(q.x,q.y,q.z,q.w) || 1;
  return {x:q.x/n,y:q.y/n,z:q.z/n,w:q.w/n};
};
const multiplyQ = (a: Quaternion, b: Quaternion): Quaternion => normalizeQ({
  x:a.w*b.x+a.x*b.w+a.y*b.z-a.z*b.y,
  y:a.w*b.y-a.x*b.z+a.y*b.w+a.z*b.x,
  z:a.w*b.z+a.x*b.y-a.y*b.x+a.z*b.w,
  w:a.w*b.w-a.x*b.x-a.y*b.y-a.z*b.z,
});
const axisAngle = (axis: Point3D, angle: number): Quaternion => {
  const s = Math.sin(angle/2), a = unit(axis);
  return {x:a.x*s,y:a.y*s,z:a.z*s,w:Math.cos(angle/2)};
};
const rotateQ = (p: Point3D, q: Quaternion): Point3D => {
  const a = cross(q,p), b = cross(q,a);
  return {x:p.x+2*(q.w*a.x+b.x),y:p.y+2*(q.w*a.y+b.y),z:p.z+2*(q.w*a.z+b.z)};
};
const initialOrientation = () => multiplyQ(axisAngle({x:0,y:1,z:0},0.45),axisAngle({x:1,y:0,z:0},-0.25));
const safe = (value: number, fallback: number, lo: number, hi: number) => clamp(Number.isFinite(value)?value:fallback,lo,hi);

export function InteractivePolyhedron({
  className, style,
  baseColor = {r:89,g:184,b:208},
  hoverColor = {r:206,g:247,b:255},
  rimLightColor,
  glowColors = DEFAULT_GLOW_COLORS,
  glowIntensity = 1.85,
  colorShiftSpeed = 0.075,
  depthContrast = 2.9,
  objectOpacity = 0.64,
  fillRatio = 0.78,
  rotationSensitivity = 1,
  inertia = true,
  autoRotateSpeed = 0,
  initialSpinSpeed = 0,
}: InteractivePolyhedronProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const geometryRef = useRef<Geometry | null>(null);
  const orientationRef = useRef<Quaternion>(initialOrientation());
  const phaseRef = useRef(1.45);
  const restingSpeedRef = useRef<number | null>(null);
  const spinRef = useRef({ axis: {x:0,y:1,z:0}, speed: 0 });
  const settings = useRef({ colorShiftSpeed, depthContrast, objectOpacity, fillRatio, rotationSensitivity, inertia, autoRotateSpeed });
  const invalidate = useRef<() => void>(() => {});
  useEffect(() => {
    settings.current = {colorShiftSpeed,depthContrast,objectOpacity,fillRatio,rotationSensitivity,inertia,autoRotateSpeed};
    invalidate.current();
  },[colorShiftSpeed,depthContrast,objectOpacity,fillRatio,rotationSensitivity,inertia,autoRotateSpeed]);
  // Choose a random axis once. Later prop changes update the resting speed,
  // without changing orientation or abruptly switching the rotation axis.
  useEffect(() => {
    const speed = safe(initialSpinSpeed,0,0,5);
    if (restingSpeedRef.current === speed) return;
    if (restingSpeedRef.current === null) {
      const z = Math.random()*2-1, theta=Math.random()*Math.PI*2;
      const r=Math.sqrt(1-z*z);
      spinRef.current.axis = {x:r*Math.cos(theta),y:r*Math.sin(theta),z};
      spinRef.current.speed = speed;
    }
    restingSpeedRef.current = speed;
    invalidate.current();
  },[initialSpinSpeed]);
  const paletteKey = JSON.stringify(glowColors.filter(c=>[c.r,c.g,c.b].every(Number.isFinite)).slice(0,8)
    .map(c=>({r:clamp(c.r,0,255),g:clamp(c.g,0,255),b:clamp(c.b,0,255)})));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d',{alpha:true});
    if (!canvas || !ctx) return;
    // Generate once, including across palette changes and resize.
    if (!geometryRef.current) {
      // Select a reasonably balanced initial silhouette from the same generator.
      let g = createConvexGeometry();
      for (let attempt=0; attempt<5; attempt++) {
        const rotated=g.vertices.map(v=>rotateQ(v,initialOrientation()));
        const xs=rotated.map(v=>v.x),ys=rotated.map(v=>v.y);
        const w=Math.max(...xs)-Math.min(...xs), h=Math.max(...ys)-Math.min(...ys);
        if(Math.min(w,h)/Math.max(w,h)>0.7)break;
        g=createConvexGeometry();
      }
      const radius = Math.max(0.001,...g.vertices.map(v=>Math.hypot(v.x,v.y,v.z)));
      geometryRef.current = {...g,vertices:g.vertices.map(v=>({x:v.x/radius,y:v.y/radius,z:v.z/radius}))};
    }
    const geometry = geometryRef.current;
    const used = [...new Set(geometry.edges.flat())];
    const glow = new VertexGlowRenderer(JSON.parse(paletteKey),safe(glowIntensity,1.85,0,2));
    const blur = new DepthBlurRenderer();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width=0,height=0,visible=typeof IntersectionObserver==='undefined',drawable=false,dirty=true;
    let frame=0,lastFrame=0;
    let dragId: number | null = null;
    let previous: Point3D | null = null;
    let lastMove = 0;
    const spin = spinRef.current;

    function shapeRadius() {
      const extent=Math.min(width,height);
      // Reserve room for the halos; use a conservative perspective fit.
      return Math.max(1, Math.min(extent*safe(settings.current.fillRatio,0.78,0.2,0.95)/2,extent/2-22)*0.87);
    }
    function trackball(e: PointerEvent): Point3D {
      const rect=canvas!.getBoundingClientRect(), r=Math.max(1,shapeRadius());
      const x=(e.clientX-rect.left-width/2)/r, y=(e.clientY-rect.top-height/2)/r;
      const d=x*x+y*y;
      // Virtual sphere transitions to a hyperbolic sheet outside its center.
      return unit({x,y,z:-(d<=0.5?Math.sqrt(1-d):0.5/Math.sqrt(d))});
    }
    function turn(axis: Point3D, angle: number) {
      orientationRef.current=multiplyQ(axisAngle(axis,angle),orientationRef.current);
      dirty=true;
    }
    function render() {
      if (!drawable) return;
      ctx!.clearRect(0,0,width,height);
      const radius=shapeRadius(), perspective=radius*6.2;
      const contrast=safe(settings.current.depthContrast,2.9,0,4);
      const opacity=safe(settings.current.objectOpacity,0.64,0,1);
      const vertices=geometry.vertices.map(v=>{
        const p=rotateQ(v,orientationRef.current);
        return projectPoint({x:p.x*radius,y:p.y*radius,z:p.z*radius},width/2,height/2,perspective);
      });
      const depthLimit=radius*1.3;
      const phases=geometry.vertices.map(v=>phaseRef.current+v.x*1.65+v.y*0.65+v.z*0.30);
      const samples=phases.map(p=>glow.sample(p));
      ctx!.save();
      for (const i of used) {
        const s=samples[i]; if (s && glow.intensity>0) glow.draw(ctx!,vertices[i],contrastDepth(vertices[i].z,0,depthLimit,contrast),s,1,opacity);
      }
      ctx!.restore();
      const edges=geometry.edges.slice().sort(([a,b],[c,d])=>vertices[c].z+vertices[d].z-vertices[a].z-vertices[b].z);
      for(const [a,b] of edges) blur.draw(ctx!,vertices[a],vertices[b],depthLimit,0,contrast,opacity,baseColor,hoverColor,0,rimLightColor,samples[a]?.color,samples[b]?.color,glow.intensity,glow.sample((phases[a]+phases[b])/2));
      ctx!.save();
      for (const i of used) {
        const s=samples[i]; if(s && glow.intensity>0) glow.drawCore(ctx!,vertices[i],contrastDepth(vertices[i].z,0,depthLimit,contrast),s.color,opacity);
      }
      ctx!.restore();
      dirty=false;
    }
    function active() {
      return !reduced.matches && (safe(settings.current.colorShiftSpeed,0.075,0,2)>0 && glow.colors.length>1 || Math.abs(safe(settings.current.autoRotateSpeed,0,-2,2))>0 || (dragId===null && ((restingSpeedRef.current ?? 0)>0 || (settings.current.inertia && spin.speed>0.001))));
    }
    function request() {
      if (!frame && drawable && visible && !document.hidden) frame=requestAnimationFrame(tick);
    }
    function tick(now: number) {
      frame=0;
      if(!drawable || !visible || document.hidden){lastFrame=0;return;}
      const elapsed=lastFrame?now-lastFrame:1000/30;
      if(lastFrame && elapsed<1000/30-1){if(dirty||active())request();return;}
      const dt=Math.min(0.05,elapsed/1000); lastFrame=now;
      if(!reduced.matches){
        const shift=safe(settings.current.colorShiftSpeed,0.075,0,2);
        if(shift>0 && glow.colors.length>1){phaseRef.current=(phaseRef.current+shift*dt)%glow.colors.length;dirty=true;}
        if(dragId===null){
          const resting = restingSpeedRef.current ?? 0;
          // Exponential relaxation toward the resting speed, not toward zero.
          // Time constant of one second; ~98% of the difference is gone after 4s.
          // Integrate the speed over this frame for frame-rate-independent motion.
          const difference = settings.current.inertia ? spin.speed - resting : 0;
          const decay = Math.exp(-dt);
          const angle = resting * dt + difference * (-Math.expm1(-dt));
          spin.speed = resting + difference * decay;
          if (Math.abs(spin.speed - resting) < 0.001) spin.speed = resting;
          if (angle > 0) turn(spin.axis,angle);
          const auto=safe(settings.current.autoRotateSpeed,0,-2,2);
          if(auto)turn({x:0.25,y:1,z:0.08},auto*dt);
        }
      }
      if(dirty)render();
      if(dirty||active())request();else lastFrame=0;
    }
    function redraw(){dirty=true;request();}
    invalidate.current=redraw;
    function resize(){
      const rect=canvas!.getBoundingClientRect();width=rect.width;height=rect.height;
      drawable=width>=2&&height>=2;
      if(!drawable){canvas!.width=canvas!.height=1;lastFrame=0;return;}
      const dpr=Math.min(Math.max(1.5,(window.devicePixelRatio||1)*1.125),2.5,Math.sqrt(6_000_000/(width*height)));
      const w=Math.max(1,Math.floor(width*dpr)),h=Math.max(1,Math.floor(height*dpr));
      if(canvas!.width!==w)canvas!.width=w;if(canvas!.height!==h)canvas!.height=h;
      ctx!.setTransform(w/width,0,0,h/height,0,0);ctx!.imageSmoothingEnabled=true;
      previous=null;lastFrame=0;redraw();
    }
    function down(e: PointerEvent){
      if(dragId!==null||e.button!==0||!drawable)return;
      dragId=e.pointerId;previous=trackball(e);lastMove=performance.now();spin.speed=0;
      canvas!.setPointerCapture(e.pointerId);canvas!.style.cursor='grabbing';e.preventDefault();
    }
    function move(e: PointerEvent){
      if(e.pointerId!==dragId)return;
      const next=trackball(e),now=performance.now();
      if(previous){
        const axis=cross(previous,next),length=Math.hypot(axis.x,axis.y,axis.z);
        const angle=Math.atan2(length,clamp(dot(previous,next),-1,1))*safe(settings.current.rotationSensitivity,1,0.2,3);
        if(length>1e-7){turn(axis,angle);spin.axis=unit(axis);spin.speed=clamp(angle/Math.max(0.008,(now-lastMove)/1000),0,5);}
        else spin.speed=0;
      }
      previous=next;lastMove=now;redraw();
    }
    function end(e: PointerEvent){
      if(e.pointerId!==dragId)return;
      dragId=null;previous=null;
      if(e.type!=='pointerup'||performance.now()-lastMove>90||!settings.current.inertia||reduced.matches)spin.speed=0;
      if(canvas!.hasPointerCapture(e.pointerId))canvas!.releasePointerCapture(e.pointerId);
      canvas!.style.cursor='grab';redraw();
    }
    function cancel(){if(dragId!==null){const id=dragId;dragId=null;previous=null;if(canvas!.hasPointerCapture(id))canvas!.releasePointerCapture(id);canvas!.style.cursor='grab';spin.speed=0;}lastFrame=0;redraw();}
    function keyboard(e: KeyboardEvent){
      const turns: Record<string,[Point3D,number]>={ArrowLeft:[{x:0,y:1,z:0},-0.16],ArrowRight:[{x:0,y:1,z:0},0.16],ArrowUp:[{x:1,y:0,z:0},-0.16],ArrowDown:[{x:1,y:0,z:0},0.16],q:[{x:0,y:0,z:1},-0.16],e:[{x:0,y:0,z:1},0.16]};
      if(e.key==='Home'){orientationRef.current=initialOrientation();}else if(turns[e.key])turn(...turns[e.key]);else return;
      spin.speed=restingSpeedRef.current ?? 0;e.preventDefault();redraw();
    }
    function visibility(){lastFrame=0;if(!document.hidden)redraw();else cancel();}
    const ro=new ResizeObserver(resize);ro.observe(canvas);
    const io=typeof IntersectionObserver!=='undefined'?new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;lastFrame=0;if(visible)redraw();}):null;io?.observe(canvas);
    canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);
    canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
    canvas.addEventListener('keydown',keyboard);window.addEventListener('blur',cancel);
    document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',redraw);
    resize();
    return ()=>{
      invalidate.current=()=>{};cancelAnimationFrame(frame);ro.disconnect();io?.disconnect();
      canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',end);canvas.removeEventListener('pointercancel',end);canvas.removeEventListener('lostpointercapture',end);
      canvas.removeEventListener('keydown',keyboard);window.removeEventListener('blur',cancel);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',redraw);
      if(dragId!==null && canvas.hasPointerCapture(dragId))canvas.releasePointerCapture(dragId);
    };
  },[baseColor.r,baseColor.g,baseColor.b,hoverColor.r,hoverColor.g,hoverColor.b,rimLightColor?.r,rimLightColor?.g,rimLightColor?.b,paletteKey,glowIntensity]);

  return <canvas ref={canvasRef} className={className} tabIndex={0}
    aria-label="Interactive polyhedron. Drag or use arrow keys to rotate; Q and E to twist; Home to reset."
    style={{display:'block',width:'100%',height:'100%',background:'transparent',...style,touchAction:'none',cursor:'grab'}} />;
}
