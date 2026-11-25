import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  before?: ReactNode;
  after?: ReactNode;
  children?: ReactNode;
  beforeLabel: string;
  afterLabel: string;
  dragLabel: string;
};

// Drag (or arrow keys) to reveal "before" on the left and "after" on the right.
// Mouse/pen use pointer events; fingers use native touch events, because iOS Safari
// takes over pointer gestures as page scroll. Horizontal finger moves drive the slider,
// vertical ones still scroll the page.
export default function BeforeAfter({ before, after, beforeLabel, afterLabel, dragLabel }: Props) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);

  const move = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let startX = 0;
    let startY = 0;
    let onKnob = false;
    let mode: 'idle' | 'drag' | 'scroll' = 'idle';

    const start = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      onKnob = !!(e.target as HTMLElement).closest('.ba__knob');
      mode = onKnob ? 'drag' : 'idle';
    };
    const touchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || mode === 'scroll') return;
      const t = e.touches[0];
      if (mode === 'idle') {
        const dx = Math.abs(t.clientX - startX);
        const dy = Math.abs(t.clientY - startY);
        if (dx < 6 && dy < 6) return;
        mode = dx > dy ? 'drag' : 'scroll';
        if (mode === 'scroll') return;
      }
      e.preventDefault();
      move(t.clientX);
    };
    const end = (e: TouchEvent) => {
      // A tap (no movement) jumps the line to the tapped point.
      if (mode === 'idle' && !onKnob && e.changedTouches[0]) move(e.changedTouches[0].clientX);
      mode = 'idle';
    };

    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchmove', touchMove, { passive: false });
    el.addEventListener('touchend', end);
    el.addEventListener('touchcancel', end);
    return () => {
      el.removeEventListener('touchstart', start);
      el.removeEventListener('touchmove', touchMove);
      el.removeEventListener('touchend', end);
      el.removeEventListener('touchcancel', end);
    };
  }, [move]);

  return (
    <div
      ref={box}
      className="ba"
      onPointerDown={(e) => {
        if (e.pointerType === 'touch') return;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'touch' && e.buttons === 1) move(e.clientX);
      }}
    >
      <div className="ba__layer">{after}</div>
      <div className="ba__layer ba__before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before}
      </div>
      <span className="ba__tag ba__tag--l">{beforeLabel}</span>
      <span className="ba__tag ba__tag--r">{afterLabel}</span>
      <div className="ba__bar" style={{ left: `${pos}%` }}>
        <button
          type="button"
          className="ba__knob"
          role="slider"
          aria-label={dragLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5));
            if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5));
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
