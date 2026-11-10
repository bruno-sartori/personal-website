'use client';

import { useEffect, useRef } from 'react';

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Signal = { from: number; to: number; t: number; hops: number };

const LINK = 140; // max distance (px) for two nodes to be connected
const NEON = '34, 211, 238';
const PLASMA = '167, 139, 250';

/**
 * A slow-moving neural network drawn on canvas: nodes drift, nearby nodes
 * link up, and "signals" hop from node to node like activations.
 */
export default function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let signals: Signal[] = [];
    let raf = 0;
    let lastSpawn = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(120, Math.round((width * height) / 15000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.3 + 0.6,
      }));
      signals = [];
    };

    const neighbour = (i: number, exclude: number): number => {
      const a = nodes[i];
      let best = -1;
      let bestD = LINK * LINK;
      for (let j = 0; j < nodes.length; j++) {
        if (j === i || j === exclude) continue;
        const dx = a.x - nodes[j].x;
        const dy = a.y - nodes[j].y;
        const d = dx * dx + dy * dy;
        // a bit of randomness so signals don't always take the same path
        if (d < bestD && Math.random() > 0.25) {
          best = j;
          bestD = d;
        }
      }
      return best;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      if (!reduced) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = width + 20;
          if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20;
          if (n.y > height + 20) n.y = -20;
        }
      }

      // links
      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const alpha = (1 - Math.sqrt(d2) / LINK) * 0.22;
          ctx.strokeStyle = `rgba(${NEON}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        // pointer proximity
        const mx = a.x - mouse.x;
        const my = a.y - mouse.y;
        const md = Math.sqrt(mx * mx + my * my);
        if (md < 180) {
          ctx.strokeStyle = `rgba(${PLASMA}, ${(1 - md / 180) * 0.45})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // nodes
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${NEON}, 0.55)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (reduced) return;

      // signals hopping across the graph
      if (time - lastSpawn > 420 && signals.length < 14 && nodes.length > 2) {
        lastSpawn = time;
        const from = Math.floor(Math.random() * nodes.length);
        const to = neighbour(from, -1);
        if (to >= 0) signals.push({ from, to, t: 0, hops: 3 + Math.floor(Math.random() * 4) });
      }

      const next: Signal[] = [];
      for (const s of signals) {
        s.t += 0.022;
        const a = nodes[s.from];
        const b = nodes[s.to];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * s.t;
        const y = a.y + (b.y - a.y) * s.t;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, 9);
        glow.addColorStop(0, `rgba(${PLASMA}, 0.9)`);
        glow.addColorStop(1, `rgba(${PLASMA}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();

        if (s.t < 1) {
          next.push(s);
        } else if (s.hops > 0) {
          const to = neighbour(s.to, s.from);
          if (to >= 0) next.push({ from: s.to, to, t: 0, hops: s.hops - 1 });
        }
      }
      signals = next;
    };

    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduced) draw(0);
      else raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        start();
      }, 150);
    };

    resize();
    start();
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="bg-neural opacity-70" />;
}
