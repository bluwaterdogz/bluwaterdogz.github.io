import { useCallback } from "react";
import styles from "./styles.module.scss";

export const BackgroundAnimation: React.FunctionComponent = () => {
  const onRefChange = useCallback((node: HTMLCanvasElement) => {
    if (node != null) {
      // Inspiration taken from: https://codepen.io/MinzCode/pen/VwKXVQJ
      class Particle {
        private x: number;
        private y: number;
        private size: number;
        private baseX: number;
        private baseY: number;
        private speed: number;

        constructor(x: number, y: number) {
          this.x = x;
          this.y = y;
          this.size = 4;
          this.baseX = this.x;
          this.baseY = this.y;
          this.speed = 10;
        }

        draw() {
          ctx.fillStyle = "rgba(255,255,255,1)";
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }

        update(targetx: number, targety: number) {
          let dx = targetx - this.x;
          let dy = targety - this.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          let maxDist = mouse.radius;
          let force = (maxDist - dist) / maxDist / 2; // 0 ~ 1
          let forcedirX = dx / dist;
          let forcedirY = dy / dist;
          let dirX = forcedirX * force * this.speed;
          let dirY = forcedirY * force * this.speed;

          if (dist < mouse.radius) {
            this.x -= dirX;
            this.y -= dirY;
          } else {
            if (this.x !== this.baseX) {
              let dx = this.x - this.baseX;
              this.x -= dx / 100;
            }
            if (this.y !== this.baseY) {
              let dy = this.y - this.baseY;
              this.y -= dy / 100;
            }
          }
        }
      }

      let w: any, h: any, particles: any;
      let particleDist = 40;
      let mouse: { x?: number; y?: number; radius: number } = {
        x: undefined,
        y: undefined,
        radius: 180,
      };
      // DOM node referenced by ref has been unmounted
      const ctx = node.getContext("2d")!;

      function init() {
        resizeReset();
        animationLoop();
      }

      function resizeReset() {
        w = node.width = window.innerWidth;
        h = node.height = window.innerHeight;
        particles = [];
        for (
          let y = (((h - particleDist) % particleDist) + particleDist) / 2;
          y < h;
          y += particleDist
        ) {
          for (
            let x = (((w - particleDist) % particleDist) + particleDist) / 2;
            x < w;
            x += particleDist
          ) {
            particles.push(new Particle(x, y));
          }
        }
      }

      function animationLoop() {
        ctx.clearRect(0, 0, w, h);
        drawScene();
        requestAnimationFrame(animationLoop);
      }

      function drawScene() {
        particles.map((p: Particle) => {
          p.update(mouse.x!, mouse.y!);
          p.draw();
        });
        drawLine();
      }

      const drawLine = () => {
        for (let a = 0; a < particles.length; a++) {
          for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < particleDist * 1.5) {
              let opacity = 1 - dist / (particleDist * 1);
              ctx.strokeStyle = "rgba(255,255,255," + opacity + ")";
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              ctx.stroke();
            }
          }
        }
      };

      const mousemove = (e: MouseEvent) => {
        mouse.x = e.x;
        mouse.y = e.y;
      };

      const mouseout = () => {
        mouse.x = undefined;
        mouse.y = undefined;
      };
      init();
      window.addEventListener("resize", resizeReset);
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseout", mouseout);
    }
  }, []);

  return <canvas className={styles.canvas} id="canvas" ref={onRefChange} />;
};
