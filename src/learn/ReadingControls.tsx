import { useState } from 'react';

export function useReadingSize() {
  const [size, setSize] = useState<'standard' | 'large' | 'largest'>(() => {
    try { const stored = localStorage.getItem('chronos.reading-size.v1'); return stored === 'large' || stored === 'largest' ? stored : 'standard'; } catch { return 'standard'; }
  });
  const change = (value: typeof size) => { setSize(value); try { localStorage.setItem('chronos.reading-size.v1', value); } catch { /* The control still works for this visit. */ } };
  return { size, change };
}

export function ReadingControls({ size, onChange }: { size: 'standard' | 'large' | 'largest'; onChange(value: 'standard' | 'large' | 'largest'): void }) {
  return <div className="reading-controls" role="group" aria-label="Reading text size"><span>Text size</span>{(['standard', 'large', 'largest'] as const).map((value) => <button key={value} type="button" aria-pressed={size === value} onClick={() => onChange(value)}>{value === 'standard' ? 'Standard' : value === 'large' ? 'Larger' : 'Largest'}</button>)}</div>;
}
