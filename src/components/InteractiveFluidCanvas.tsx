import React, { useEffect, useRef } from 'react';

interface InteractiveFluidCanvasProps {
  colorHex: string;
}

export const InteractiveFluidCanvas: React.FC<InteractiveFluidCanvasProps> = ({ colorHex }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }

    const particles: Particle[] = [];
    let mouse = { x: width / 2, y: height / 2, prevX: width / 2, prevY: height / 2, isMoving: false };

    // Spawn ambient fluid ripples
    const spawnParticle = (x: number, y: number, vx: number, vy: number, color: string) => {
      particles.push({
        x,
        y,
        vx: vx * 0.8 + (Math.random() - 0.5) * 2,
        vy: vy * 0.8 + (Math.random() - 0.5) * 2,
        radius: 18 + Math.random() * 24,
        alpha: 0.65,
        color,
      });
      if (particles.length > 90) particles.shift();
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const vx = x - mouse.x;
      const vy = y - mouse.y;

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = x;
      mouse.y = y;

      if (Math.hypot(vx, vy) > 2) {
        for (let i = 0; i < 3; i++) {
          spawnParticle(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20, vx * 0.25, vy * 0.25, colorHex);
        }
      }
    };

    window.addEventListener('mousemove', handlePointerMove);

    let animId: number;
    const render = () => {
      animId = requestAnimationFrame(render);

      // Gentle fade for viscosity trail
      ctx.fillStyle = 'rgba(247, 243, 235, 0.12)';
      ctx.fillRect(0, 0, width, height);

      // Draw and update fluid droplets
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.alpha *= 0.97;
        p.radius *= 0.99;

        if (p.alpha <= 0.02 || p.radius <= 1) {
          particles.splice(i, 1);
          continue;
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.7, p.color + '40');
        gradient.addColorStop(1, 'transparent');

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 450;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [colorHex]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply opacity-50 z-0"
    />
  );
};
