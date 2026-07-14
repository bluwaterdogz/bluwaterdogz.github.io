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
  
  type PolyhedraBackgroundProps = {
    className?: string;
    style?: CSSProperties;
  
    objectCount?: number;
  
    minSize?: number;
    maxSize?: number;
  
    baseColor?: RGBColor;
    hoverColor?: RGBColor;
  
    objectOpacity?: number;
    connectionOpacity?: number;
  
    connectionDistance?: number;
  
    mouseRepelRadius?: number;
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
  
    objectOpacity: number;
    connectionOpacity: number;
  
    objectLineWidth: number;
    connectionLineWidth: number;
  
    perspective: number;
  
    hoverRadius: number;
    hoverEase: number;
  
    mouseRepelRadius: number;
    mouseRepelStrength: number;
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
  
      this.depth = random(-120, 120);
      this.hoverMix = 0;
  
      this.scaleX = 1;
      this.scaleY = 1;
  
      this.targetScaleX = 1;
      this.targetScaleY = 1;
    }
  
    clampToBounds(width: number, height: number) {
      const radius = this.getCollisionRadius();
  
      this.x = clamp(
        this.x,
        radius,
        Math.max(radius, width - radius)
      );
  
      this.y = clamp(
        this.y,
        radius,
        Math.max(radius, height - radius)
      );
    }
  
    private getCollisionRadius() {
      return this.size * 0.92;
    }
  
    private applyMouseRepulsion(pointer: PointerState) {
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
  
      if (distance < this.config.mouseRepelRadius) {
        const normalizedForce =
          1 - distance / this.config.mouseRepelRadius;
  
        const force =
          normalizedForce *
          normalizedForce *
          this.config.mouseRepelStrength;
  
        this.vx += (dx / distance) * force;
        this.vy += (dy / distance) * force;
      }
  
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
  
      if (this.x - radius < 0) {
        xImpactSpeed = Math.abs(this.vx);
        this.x = radius;
        this.vx =
          Math.abs(this.vx) *
          this.config.wallBounce;
  
        hitX = true;
      } else if (this.x + radius > width) {
        xImpactSpeed = Math.abs(this.vx);
        this.x = width - radius;
        this.vx =
          -Math.abs(this.vx) *
          this.config.wallBounce;
  
        hitX = true;
      }
  
      if (this.y - radius < 0) {
        yImpactSpeed = Math.abs(this.vy);
        this.y = radius;
        this.vy =
          Math.abs(this.vy) *
          this.config.wallBounce;
  
        hitY = true;
      } else if (this.y + radius > height) {
        yImpactSpeed = Math.abs(this.vy);
        this.y = height - radius;
        this.vy =
          -Math.abs(this.vy) *
          this.config.wallBounce;
  
        hitY = true;
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
      this.applyMouseRepulsion(pointer);
      this.limitVelocity();
  
      this.vx *= this.config.damping;
      this.vy *= this.config.damping;
  
      this.x += this.vx;
      this.y += this.vy;
  
      this.rotation.x += this.rotationVelocity.x;
      this.rotation.y += this.rotationVelocity.y;
      this.rotation.z += this.rotationVelocity.z;
  
      this.handleWallCollisions(width, height);
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
            vertex.z *
              this.size +
            this.depth,
        };
  
        const rotated = rotatePoint(
          scaled,
          this.rotation
        );
  
        return projectPoint(
          rotated,
          this.x,
          this.y,
          this.config.perspective
        );
      });
    }
  
    draw(ctx: CanvasRenderingContext2D) {
      const vertices = this.getProjectedVertices();
  
      ctx.save();
  
      ctx.strokeStyle = mixColor(
        this.config.baseColor,
        this.config.hoverColor,
        this.hoverMix,
        this.config.objectOpacity
      );
  
      ctx.lineWidth =
        this.config.objectLineWidth;
  
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
  
      for (
        const [startIndex, endIndex]
        of this.geometry.edges
      ) {
        const start = vertices[startIndex];
        const end = vertices[endIndex];
  
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
  
      ctx.restore();
    }
  }
  
  export function PolyhedraBackground({
    className,
    style,
  
    objectCount = 10,
  
    minSize = 70,
    maxSize = 120,
  
    baseColor = { r: 0, g: 0, b: 0 },
    hoverColor = { r: 126, g: 87, b: 255 },
  
    objectOpacity = 0.44,
    connectionOpacity = 0.11,
  
    connectionDistance = 270,
  
    mouseRepelRadius = 210,
    mouseRepelStrength = 0.11,
  
    hoverRadius = 165,
  
    wallBounce = 0.94,
    compressionAmount = 0.14,
    compressionRecovery = 0.08,
  }: PolyhedraBackgroundProps) {
    const canvasRef =
      useRef<HTMLCanvasElement | null>(null);
  
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
        objectCount,
  
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
  
        objectOpacity,
        connectionOpacity,
  
        objectLineWidth: 1.15,
        connectionLineWidth: 0.85,
  
        perspective: 760,
  
        hoverRadius,
        hoverEase: 0.09,
  
        mouseRepelRadius,
        mouseRepelStrength,
      };
  
      const pointer: PointerState = {
        x: 0,
        y: 0,
        active: false,
      };
  
      let width = 0;
      let height = 0;
      let dpr = 1;
      let animationFrame = 0;
  
      let objects: Polyhedron[] = [];
  
      const resize = () => {
        const rect =
          canvas.getBoundingClientRect();
  
        width = rect.width;
        height = rect.height;
  
        dpr = Math.min(
          window.devicePixelRatio || 1,
          2
        );
  
        canvas.width = Math.max(
          1,
          Math.floor(width * dpr)
        );
  
        canvas.height = Math.max(
          1,
          Math.floor(height * dpr)
        );
  
        ctx.setTransform(
          dpr,
          0,
          0,
          dpr,
          0,
          0
        );
  
        for (const object of objects) {
          object.clampToBounds(width, height);
        }
      };
  
      const createObjects = () => {
        objects = Array.from(
          { length: config.objectCount },
          () =>
            new Polyhedron(
              width,
              height,
              config
            )
        );
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
              config.connectionOpacity;
  
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
            ctx.moveTo(first.x, first.y);
            ctx.lineTo(second.x, second.y);
            ctx.stroke();
          }
        }
  
        ctx.restore();
      };
  
      const animate = () => {
        ctx.clearRect(
          0,
          0,
          width,
          height
        );
  
        for (const object of objects) {
          object.update(
            pointer,
            width,
            height
          );
        }
  
        drawConnections();
  
        for (const object of objects) {
          object.draw(ctx);
        }
  
        animationFrame =
          window.requestAnimationFrame(
            animate
          );
      };
  
      const handlePointerMove = (
        event: PointerEvent
      ) => {
        const rect =
          canvas.getBoundingClientRect();
  
        pointer.x =
          event.clientX - rect.left;
  
        pointer.y =
          event.clientY - rect.top;
  
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
        });
  
      resizeObserver.observe(canvas);
  
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
      animate();
  
      return () => {
        window.cancelAnimationFrame(
          animationFrame
        );
  
        resizeObserver.disconnect();
  
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
      baseColor,
      hoverColor,
      objectOpacity,
      connectionOpacity,
      connectionDistance,
      mouseRepelRadius,
      mouseRepelStrength,
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
