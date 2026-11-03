import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const circleRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const isHovered = useRef(false);
  const isVisible = useRef(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const circle = circleRef.current;
    if (!circle) return;

    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        currentPos.current.x = e.clientX;
        currentPos.current.y = e.clientY;
        circle.style.opacity = '1';
      }

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('input') ||
        target?.closest('label') ||
        target?.closest('.cursor-pointer') ||
        target?.closest('.cursor-grab') ||
        target?.closest('.group')
      );

      if (isInteractive !== isHovered.current) {
        isHovered.current = isInteractive;
        if (isInteractive) {
          circle.classList.add('border-brand-amber', 'bg-brand-amber/15', 'w-11', 'h-11');
          circle.classList.remove('border-brand-950/40', 'bg-brand-950/5', 'w-8', 'h-8');
        } else {
          circle.classList.remove('border-brand-amber', 'bg-brand-amber/15', 'w-11', 'h-11');
          circle.classList.add('border-brand-950/40', 'bg-brand-950/5', 'w-8', 'h-8');
        }
      }
    };

    const handleMouseDown = () => {
      circle.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%) scale(0.85)`;
    };

    const handleMouseUp = () => {
      circle.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%) scale(1)`;
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
      circle.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisible.current = true;
      circle.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Ultra-smooth 60fps/120fps direct hardware transform animation loop
    const render = () => {
      // 0.35 factor provides immediate snappy tracking with natural fluid grace (zero lag)
      const ease = 0.35;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

      circle.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div
      ref={circleRef}
      className="pointer-events-none fixed top-0 left-0 z-50 w-8 h-8 rounded-full border-2 border-brand-950/40 bg-brand-950/5 backdrop-blur-[1px] transition-[width,height,border-color,background-color] duration-200 ease-out will-change-transform opacity-0 hidden md:block select-none"
      style={{
        transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
      }}
    />
  );
};
