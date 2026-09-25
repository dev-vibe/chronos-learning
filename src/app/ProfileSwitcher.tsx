import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronsUpDown, Lock, Settings, ShieldCheck } from 'lucide-react';
import {
  cachedActiveLearner,
  FAMILY_CHANGED_EVENT,
  resolveActiveLearner,
  switchToKid,
  switchToParent,
  type ActiveLearner,
} from '../infrastructure/family/activeLearner';
import { createFamilyGateway, familyErrorMessage, type FamilyGateway } from '../infrastructure/family/gateway';
import './profile-switcher.css';

/** The acting learner for this page, drawn from cache first so the switcher appears at once. */
export function useActiveLearner(): ActiveLearner | null {
  const [active, setActive] = useState<ActiveLearner | null>(() => cachedActiveLearner());
  useEffect(() => {
    let current = true;
    const load = () => resolveActiveLearner().then((next) => { if (current) setActive(next); });
    void load();
    window.addEventListener(FAMILY_CHANGED_EVENT, load);
    return () => { current = false; window.removeEventListener(FAMILY_CHANGED_EVENT, load); };
  }, []);
  return active;
}

const initial = (name: string) => name.trim().charAt(0).toUpperCase() || '?';

/**
 * Opens parent view on a shared account. When the parent has turned on a PIN,
 * it asks for it first; otherwise it switches straight away.
 */
export function ParentViewEntry({ gateway, onSwitch = () => switchToParent(), label = 'Parent view', className = 'secondary' }: { gateway: FamilyGateway; onSwitch?(): void; label?: string; className?: string }) {
  const [asking, setAsking] = useState(false);
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputId = useId();
  const open = async () => {
    setBusy(true); setError('');
    try {
      if (await gateway.parentPinEnabled()) setAsking(true);
      else onSwitch();
    } catch (caught) { setError(familyErrorMessage(caught, 'Parent view couldn’t open. Please try again.')); }
    finally { setBusy(false); }
  };
  const check = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      if (await gateway.verifyParentPin(pin)) onSwitch();
      else { setError('That PIN didn’t match.'); setPin(''); }
    } catch (caught) { setError(familyErrorMessage(caught, 'The PIN couldn’t be checked. Please try again.')); }
    finally { setBusy(false); }
  };
  const forgot = async () => {
    await gateway.signOut().catch(() => undefined);
    window.location.assign('/account');
  };
  if (!asking) return <>
    <button type="button" className={className} disabled={busy} onClick={open}><ShieldCheck aria-hidden="true" /> {label}</button>
    {error && <p className="error" role="alert">{error}</p>}
  </>;
  return <form className="parent-pin-form" onSubmit={check}>
    <label htmlFor={inputId}><Lock aria-hidden="true" /> Parent PIN</label>
    <div>
      <input id={inputId} value={pin} onChange={(event) => { setPin(event.target.value.replace(/\D/g, '').slice(0, 4)); setError(''); }} inputMode="numeric" autoComplete="off" pattern="[0-9]{4}" maxLength={4} autoFocus aria-describedby={error ? `${inputId}-error` : undefined} />
      <button className="primary" disabled={busy || pin.length !== 4}>{busy ? 'Checking…' : 'Open'}</button>
    </div>
    {error && <p id={`${inputId}-error`} className="error" role="alert">{error}</p>}
    <button type="button" className="quiet-link" onClick={forgot}>Forgot it? Sign out and back in to change it.</button>
  </form>;
}

/**
 * Always-visible control on shared accounts. It names who is using Chronos
 * and switches between kids and parent view in one tap.
 */
export function ProfileSwitcher({ active, variant, gateway: provided }: { active: ActiveLearner; variant: 'rail' | 'tab'; gateway?: FamilyGateway }) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<{ container: Element; style: React.CSSProperties }>();
  const [gateway] = useState(() => provided ?? createFamilyGateway());
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const current = active.profiles.find((profile) => profile.id === active.learnerId);
  const parent = active.view === 'parent';
  const name = parent ? 'Parent view' : current?.displayName ?? 'Kid';

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>('button, a, input')?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } };
    const onPointer = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node) && !triggerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer); };
  }, [open]);

  return <div className={`profile-switcher profile-switcher-${variant}${parent ? ' is-parent' : ''}`}>
    <button
      ref={triggerRef}
      type="button"
      className="profile-trigger"
      aria-expanded={open}
      aria-controls={panelId}
      aria-label={parent ? 'Parent view. Switch profile' : `Using Chronos as ${name}. Switch profile`}
      onClick={() => {
        if (open) { setOpen(false); return; }
        // Draw the panel inside the themed app, outside the nav, so it keeps
        // the theme without inheriting nav button styles.
        const trigger = triggerRef.current!;
        const rect = trigger.getBoundingClientRect();
        setPlacement({
          container: trigger.closest('.discovery-app, .learn-app') ?? document.body,
          style: variant === 'rail' ? { left: rect.right + 10, top: Math.max(12, Math.min(rect.top, window.innerHeight - 380)) } : {},
        });
        setOpen(true);
      }}
    >
      <span className="profile-avatar" aria-hidden="true">{parent ? <ShieldCheck /> : initial(name)}</span>
      <span className="profile-name">{name}</span>
      {variant === 'rail' && <span className="profile-switch-hint"><ChevronsUpDown aria-hidden="true" /> Switch</span>}
    </button>
    {open && placement && createPortal(<div ref={panelRef} id={panelId} className={`profile-panel profile-panel-${variant}`} style={placement.style} role="dialog" aria-label="Switch profile">
      <p className="profile-panel-title">Who’s using Chronos?</p>
      <ul>
        {active.profiles.map((profile) => {
          const selected = !parent && profile.id === active.learnerId;
          return <li key={profile.id}>
            <button type="button" className={`profile-option${selected ? ' selected' : ''}`} aria-current={selected ? 'true' : undefined} onClick={() => (selected ? setOpen(false) : switchToKid(profile.id))}>
              <span className="profile-avatar" aria-hidden="true">{initial(profile.displayName)}</span>
              <span>{profile.displayName}</span>
              {selected && <Check aria-hidden="true" />}
            </button>
          </li>;
        })}
      </ul>
      <div className="profile-parent-entry">
        {parent
          ? <p className="profile-option selected" aria-current="true"><span className="profile-avatar" aria-hidden="true"><ShieldCheck /></span><span>Parent view</span><Check aria-hidden="true" /></p>
          : <ParentViewEntry gateway={gateway} className="profile-option" />}
      </div>
      <a className="profile-settings" href="/account"><Settings aria-hidden="true" /> Account settings</a>
    </div>, placement.container)}
  </div>;
}
