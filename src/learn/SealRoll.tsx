import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { MediaAsset, SealRollInteraction } from '../domains/contracts';
import { resolveMediaAsset } from '../media/resolve';
import { cylinderColumn, sealGeometry } from './seal-roll-mapping';
import './seal-roll.css';

type Props = { interaction: SealRollInteraction; texture: MediaAsset; children: ReactNode };
export const sealRollSummary = 'Rolling the seal across damp clay prints its design as a band that repeats each time the seal turns once.';

export function SealRoll({ interaction, texture, children }: Props) {
  const { repeatPx, bandTop, bandBottom } = interaction;
  const geometry = sealGeometry(repeatPx, bandBottom - bandTop);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement | null>(null);
  const stone = useRef<HTMLCanvasElement | null>(null);
  const animation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const drag = useRef<{ id: number; x: number; distance: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [distance, setDistance] = useState(0);
  const [playing, setPlaying] = useState(false);
  const descriptionId = useId();
  const resolved = resolveMediaAsset(texture);
  const stop = () => {
    cancelAnimationFrame(animation.current);
    clearTimeout(timer.current);
    setPlaying(false);
  };

  useEffect(() => {
    let disposed = false;
    setReady(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (disposed) return;
      try {
        if (!canvas.current?.getContext('2d')) return;
        const surface = document.createElement('canvas');
        surface.width = repeatPx;
        surface.height = bandBottom - bandTop;
        const context = surface.getContext('2d');
        if (!context) return;
        context.drawImage(img, 0, bandTop, repeatPx, surface.height, 0, 0, repeatPx, surface.height);
        const pixels = context.getImageData(0, 0, surface.width, surface.height);
        // Reverse relief lighting and tint to lapis. This is an illustration of
        // incised stone, not a recovered depth map or a photograph of rotation.
        for (let i = 0; i < pixels.data.length; i += 4) {
          const light = 1.25 - (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 765;
          pixels.data[i] = 44 * light;
          pixels.data[i + 1] = 69 * light;
          pixels.data[i + 2] = 85 * light;
        }
        context.putImageData(pixels, 0, 0);
        image.current = img;
        stone.current = surface;
        setReady(true);
      } catch { setReady(false); }
    };
    img.onerror = () => {
      if (disposed) return;
      if (img.src !== new URL(resolved.fallbackSrc, document.baseURI).href) img.src = resolved.fallbackSrc;
      else setReady(false);
    };
    img.src = resolved.src;
    return () => { disposed = true; img.onload = null; img.onerror = null; };
  }, [resolved.src, resolved.fallbackSrc, repeatPx, bandTop, bandBottom]);

  useEffect(() => () => { cancelAnimationFrame(animation.current); clearTimeout(timer.current); }, []);

  useEffect(() => {
    if (!ready || !canvas.current || !image.current || !stone.current) return;
    try {
      const context = canvas.current.getContext('2d');
      if (!context) { setReady(false); return; }
      const { width, height, padding, radius, top, travel } = geometry;
      const bandHeight = bandBottom - bandTop;
      context.clearRect(0, 0, width, height);
      // Neutral gray clay keeps the museum impression's actual colors intact.
      context.fillStyle = '#aaa7a0';
      context.fillRect(padding, top, travel, bandHeight);
      context.save();
      context.beginPath();
      context.rect(padding, top, distance, bandHeight);
      context.clip();
      for (let turn = 0; turn < 2; turn++) context.drawImage(image.current, 0, bandTop, repeatPx, bandHeight, padding + turn * repeatPx, top, repeatPx, bandHeight);
      context.restore();
      const centre = padding + distance;
      for (let dx = -Math.ceil(radius); dx < radius; dx++) {
        const sourceX = Math.floor(cylinderColumn(distance, dx + .5, repeatPx));
        context.drawImage(stone.current, sourceX, 0, 1, bandHeight, centre + dx, top, 1, bandHeight);
      }
      const shade = context.createLinearGradient(centre - radius, 0, centre + radius, 0);
      shade.addColorStop(0, 'rgba(0,0,0,.65)');
      shade.addColorStop(.35, 'rgba(255,255,255,.12)');
      shade.addColorStop(.65, 'rgba(0,0,0,.05)');
      shade.addColorStop(1, 'rgba(0,0,0,.72)');
      context.fillStyle = shade;
      context.fillRect(centre - radius, top, radius * 2, bandHeight);
      context.fillStyle = '#354957';
      context.beginPath();
      context.ellipse(centre, top, radius, radius * .16, 0, 0, Math.PI * 2);
      context.fill();
    } catch { setReady(false); }
  }, [ready, distance, repeatPx, bandTop, bandBottom]);

  const move = (value: number) => setDistance(Math.max(0, Math.min(geometry.travel, value)));
  const roll = () => {
    stop();
    if (distance >= geometry.travel) return;
    setPlaying(true);
    const start = distance;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      let step = 0;
      const advance = () => {
        step++;
        move(start + (geometry.travel - start) * step / 4);
        if (step < 4) timer.current = setTimeout(advance, 450);
        else setPlaying(false);
      };
      advance();
    } else {
      const started = performance.now();
      const duration = 6000 * (geometry.travel - start) / geometry.travel;
      const frame = (now: number) => {
        const fraction = Math.min(1, (now - started) / duration);
        move(start + (geometry.travel - start) * fraction);
        if (fraction < 1) animation.current = requestAnimationFrame(frame);
        else setPlaying(false);
      };
      animation.current = requestAnimationFrame(frame);
    }
  };

  return <div className={`seal-roll${ready ? ' seal-roll--ready' : ''}`}>
    <div className="seal-roll-interactive" hidden={!ready}>
      <p className="seal-roll-depiction">Illustration made from the museum photo</p>
      <div className="seal-roll-stage" ref={stage}>
        <canvas ref={canvas} width={Math.ceil(geometry.width)} height={Math.ceil(geometry.height)} aria-hidden="true" />
        <div role="slider" tabIndex={0} aria-label="Roll the seal" aria-describedby={descriptionId}
          aria-valuemin={0} aria-valuemax={2} aria-valuenow={Number((distance / repeatPx).toFixed(2))}
          aria-valuetext={`${(distance / repeatPx).toFixed(1)} of 2 turns`}
          className="seal-roll-handle" style={{ left: `${100 * (geometry.padding + distance) / geometry.width}%`, width: `${100 * geometry.radius * 2 / geometry.width}%` }}
          onKeyDown={(event) => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault(); stop();
            move(event.key === 'Home' ? 0 : event.key === 'End' ? geometry.travel : distance + (event.key === 'ArrowRight' ? 1 : -1) * repeatPx / 16);
          }}
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;
            stop(); event.currentTarget.focus();
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = { id: event.pointerId, x: event.clientX, distance };
          }}
          onPointerMove={(event) => {
            const active = drag.current;
            const width = stage.current?.getBoundingClientRect().width;
            if (active?.id === event.pointerId && width) move(active.distance + (event.clientX - active.x) * geometry.width / width);
          }}
          onPointerUp={(event) => { if (drag.current?.id === event.pointerId) drag.current = null; }}
          onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }} />
      </div>
      <div className="seal-roll-controls"><button type="button" onClick={roll} disabled={playing || distance >= geometry.travel}>Roll it</button><button type="button" onClick={() => { stop(); move(0); }}>Start over</button></div>
      <p className="seal-roll-status" role="status" aria-live="polite">{distance >= geometry.travel ? 'Print complete. The seal has made two full turns.' : '\u00a0'}</p>
    </div>
    <p id={descriptionId} className="seal-roll-summary">{sealRollSummary}</p>
    <details className="seal-roll-photo" open={!ready}><summary>Museum photo</summary>{children}</details>
  </div>;
}
