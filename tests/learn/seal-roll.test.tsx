// @vitest-environment jsdom
import React from 'react';
import { renderToString } from 'react-dom/server';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MediaAsset, SealRollInteraction } from '../../src/domains/contracts';
import { SealRoll } from '../../src/learn/SealRoll';
import { sealGeometry } from '../../src/learn/seal-roll-mapping';

const interaction: SealRollInteraction = { kind: 'seal-roll', textureMediaId: 'media.test.seal', repeatPx: 400, bandTop: 10, bandBottom: 90, sealWidthPx: 64 };
const texture = { locator: { provider: 'repository', path: '/seal.jpg', width: 400, height: 100 } } as MediaAsset;
let images: FakeImage[];
class FakeImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  crossOrigin = '';
  private source = '';
  constructor() { images.push(this); }
  set src(value: string) { this.source = new URL(value, document.baseURI).href; }
  get src() { return this.source; }
}
let frames: Map<number, FrameRequestCallback>;
let frameId: number;
const value = () => Number(screen.getByRole('slider').getAttribute('aria-valuenow'));
const view = () => <SealRoll interaction={interaction} texture={texture}><img src="/museum.jpg" alt="Museum impression" /></SealRoll>;
function ready() {
  const result = render(view());
  act(() => images[0].onload?.());
  return result;
}
function frame(now: number) {
  const pending = [...frames.values()];
  frames.clear();
  act(() => pending.forEach(callback => callback(now)));
}
beforeEach(() => {
  images = []; frames = new Map(); frameId = 0;
  vi.stubGlobal('Image', FakeImage);
  vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => { frames.set(++frameId, callback); return frameId; }));
  vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => frames.delete(id)));
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));
  vi.spyOn(performance, 'now').mockReturnValue(0);
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    drawImage: vi.fn(), getImageData: () => ({ data: new Uint8ClampedArray(16) }), putImageData: vi.fn(),
    clearRect: vi.fn(), fillRect: vi.fn(), save: vi.fn(), beginPath: vi.fn(), rect: vi.fn(), clip: vi.fn(),
    restore: vi.fn(), createLinearGradient: () => ({ addColorStop: vi.fn() }), ellipse: vi.fn(), fill: vi.fn(),
  } as unknown as CanvasRenderingContext2D);
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('seal roll', () => {
  it('renders the initial museum photo with controls hidden before client image loading, including SSR', () => {
    const html = renderToString(view());
    expect(html).toContain('alt="Museum impression"');
    expect(html).toMatch(/<details[^>]*open=""/);
    render(view());
    expect(screen.queryByRole('slider')).toBeNull();
    expect(screen.getByAltText('Museum impression')).toBeTruthy();
  });
  it('drags right and backward, clamps at both ends, and ends on pointer cancel', () => {
    ready();
    const slider = screen.getByRole('slider');
    slider.setPointerCapture = vi.fn();
    vi.spyOn(slider.parentElement!, 'getBoundingClientRect').mockReturnValue({ width: sealGeometry(400, 80).width } as DOMRect);
    const pointer = (name: string, x: number) => {
      const event = new Event(name, { bubbles: true });
      Object.assign(event, { pointerId: 1, clientX: x, button: 0, isPrimary: true });
      fireEvent(slider, event);
    };
    pointer('pointerdown', 100); pointer('pointermove', 300); expect(value()).toBe(.5);
    pointer('pointermove', 200); expect(value()).toBe(.25);
    pointer('pointermove', 2000); expect(value()).toBe(2);
    pointer('pointermove', -1000); expect(value()).toBe(0);
    pointer('pointercancel', 0); pointer('pointermove', 500); expect(value()).toBe(0);
  });
  it('supports arrow keys, Home, End and start over with an explicit completion status', () => {
    ready(); const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' }); expect(value()).toBe(.06);
    fireEvent.keyDown(slider, { key: 'ArrowLeft' }); expect(value()).toBe(0);
    fireEvent.keyDown(slider, { key: 'End' }); expect(value()).toBe(2);
    expect(screen.getByRole('status').textContent).toContain('Print complete');
    fireEvent.keyDown(slider, { key: 'Home' }); expect(value()).toBe(0);
    fireEvent.keyDown(slider, { key: 'End' });
    fireEvent.click(screen.getByRole('button', { name: 'Start over' })); expect(value()).toBe(0);
  });
  it('animates Roll it to completion and cancels playback when keyboard input takes over', () => {
    ready(); const button = screen.getByRole('button', { name: 'Roll it' }) as HTMLButtonElement;
    fireEvent.click(button); expect(button.disabled).toBe(true);
    frame(3000); expect(value()).toBe(1);
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'Home' });
    expect(frames.size).toBe(0); expect(button.disabled).toBe(false);
    fireEvent.click(button); frame(6000); expect(value()).toBe(2);
    expect(screen.getByRole('status').textContent).toContain('two full turns');
    fireEvent.click(screen.getByRole('button', { name: 'Start over' })); expect(value()).toBe(0);
  });
  it('reveals four discrete reduced-motion steps without animation frames and cleans timers on unmount', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }); vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
    const result = ready();
    fireEvent.click(screen.getByRole('button', { name: 'Roll it' })); expect(value()).toBe(.5);
    for (const expected of [1, 1.5, 2]) { act(() => vi.advanceTimersByTime(450)); expect(value()).toBe(expected); }
    expect(requestAnimationFrame).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Start over' }));
    fireEvent.click(screen.getByRole('button', { name: 'Roll it' })); expect(vi.getTimerCount()).toBe(1);
    result.unmount(); expect(vi.getTimerCount()).toBe(0);
  });
  it('cleans an animation frame on unmount', () => {
    const result = ready(); fireEvent.click(screen.getByRole('button', { name: 'Roll it' }));
    expect(frames.size).toBe(1); result.unmount(); expect(frames.size).toBe(0);
  });
  it('retains the photo when canvas is unavailable', () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);
    ready(); expect(screen.queryByRole('slider')).toBeNull();
    expect(screen.getByAltText('Museum impression').closest('details')?.open).toBe(true);
  });
  it('retains the photo when the texture fails to load', () => {
    render(view()); act(() => images[0].onerror?.());
    expect(screen.queryByRole('slider')).toBeNull();
    expect(screen.getByAltText('Museum impression').closest('details')?.open).toBe(true);
  });
});
