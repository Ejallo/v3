import { useCallback, useRef, useState, type ReactNode } from 'react';

type Props = {
  before?: ReactNode;
  after?: ReactNode;
  children?: ReactNode;
  beforeLabel: string;
  afterLabel: string;
  dragLabel: string;
};

// Drag (or arrow keys) to reveal "before" on the left and "after" on the right.
export default function BeforeAfter({ before, after, beforeLabel, afterLabel, dragLabel }: Props) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);

  const move = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={box}
      className="ba"
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons === 1 || e.pointerType === 'touch') move(e.clientX);
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
