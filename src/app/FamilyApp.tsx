import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ClipboardCheck, KeyRound, Lock, LogOut, MessageSquareQuote, RefreshCw, ShieldCheck, UserRound, UserPlus, Users } from 'lucide-react';
import { chronosContent } from '../../content/chronos';
import { reviewEntries } from '../domains/submissions';
import { cardsForLesson } from '../learn/progress';
import { useChronosTheme } from '../theme/useChronosTheme';
import { GlobalNavigation } from './GlobalNavigation';
import { ParentViewEntry, useActiveLearner } from './ProfileSwitcher';
import { enterParentView, refreshActiveLearner, switchToKid, type ActiveLearner } from '../infrastructure/family/activeLearner';
import {
  createFamilyGateway,
  familyErrorMessage,
  formatLinkCode,
  type AccountSetup,
  type AccountSnapshot,
  type FamilyGateway,
  type FamilyMember,
  type ReviewDecision,
  type ReviewItem,
} from '../infrastructure/family/gateway';
import '../learn/learn.css';
import './app.css';
import './family.css';

const lessonById = new Map(chronosContent.lessons.map((lesson) => [lesson.id, lesson]));
const promptById = new Map(chronosContent.prompts.map((prompt) => [prompt.id, prompt]));
const cardById = new Map(chronosContent.cards.map((card) => [card.id, card]));
const nameOf = (member?: FamilyMember) => member?.displayName ?? 'Learner';
const shortDate = (iso?: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

type Session = { userId: string; email?: string } | null;

export function FamilyApp({ page, gateway: provided, activeLearner }: { page: 'account' | 'review'; gateway?: FamilyGateway; activeLearner?: ActiveLearner | null }) {
  const gateway = useMemo(() => provided ?? createFamilyGateway(), [provided]);
  const { theme, toggleTheme } = useChronosTheme();
  const resolved = useActiveLearner();
  const active = activeLearner !== undefined ? activeLearner : resolved;
  const [session, setSession] = useState<Session | undefined>(undefined);
  const refreshSession = useCallback(() => { refreshActiveLearner(); return gateway.session().then(setSession).catch(() => setSession(null)); }, [gateway]);
  useEffect(() => {
    // Returning from Google sign-in: the account holder just signed in.
    const params = new URLSearchParams(window.location.search);
    if (params.has('signed-in')) { enterParentView(); window.history.replaceState(null, '', window.location.pathname); }
    void refreshSession();
  }, [refreshSession]);
  useEffect(() => { document.title = `${page === 'account' ? 'Account' : 'Review'} · Chronos`; }, [page]);

  return <div className="discovery-app" data-theme={theme}>
    <GlobalNavigation active="account" theme={theme} onTheme={toggleTheme} />
    <main className="discovery-main family-page">
      {session === undefined
        ? <p className="family-loading" aria-busy="true">Opening your account…</p>
        : !gateway.available
          ? <header className="page-intro"><p className="label">Account</p><h1>Accounts aren’t set up here.</h1><p>This copy of Chronos has no database connected, so lessons are saved in this browser only.</p></header>
          : !session
            ? <SignIn gateway={gateway} onSignedIn={refreshSession} reviewing={page === 'review'} />
            : active?.view === 'kid'
              ? <KidViewPage gateway={gateway} active={active} reviewing={page === 'review'} />
              : page === 'account'
                ? <AccountPage gateway={gateway} session={session} onSignedOut={refreshSession} />
                : <ReviewPage gateway={gateway} />}
    </main>
  </div>;
}

function SignIn({ gateway, onSignedIn, reviewing }: { gateway: FamilyGateway; onSignedIn(): void; reviewing: boolean }) {
  const [mode, setMode] = useState<'sign-in' | 'create'>('sign-in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true); setError(''); setNotice('');
    try {
      if (mode === 'sign-in') { await gateway.signIn(email.trim(), password); onSignedIn(); }
      else if (await gateway.signUp(email.trim(), password, name.trim()) === 'signed-in') onSignedIn();
      else setNotice('Check your email to confirm your account, then sign in here.');
    } catch (caught) { setError(familyErrorMessage(caught, 'Signing in didn’t work. Please try again.')); }
    finally { setBusy(false); }
  };
  const google = async () => {
    setError('');
    try { await gateway.signInWithGoogle(); } catch (caught) { setError(familyErrorMessage(caught, 'Google sign-in didn’t start. Please try again.')); }
  };
  return <>
    <header className="page-intro"><p className="label">{reviewing ? 'Review' : 'Account'}</p><h1>{reviewing ? 'Sign in to review work.' : 'Sign in to Chronos.'}</h1><p>{reviewing ? 'Parents sign in here to read their learners’ answers and pass lessons.' : 'Sign in so your lessons follow you between devices, and so a parent can review your answers and award your Knowledge Cards.'}</p></header>
    <section className="family-card sign-in-card" aria-labelledby="sign-in-title">
      <h2 id="sign-in-title">{mode === 'sign-in' ? 'Sign in' : 'Create an account'}</h2>
      <button type="button" className="secondary google-button" onClick={google}>Continue with Google</button>
      <p className="family-divider"><span>or use email</span></p>
      <form onSubmit={submit} className="family-form">
        {mode === 'create' && <label>Your first name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="given-name" required maxLength={60} /></label>}
        <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} minLength={6} required /></label>
        <button className="primary" disabled={busy}>{busy ? 'One moment…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      {notice && <p className="family-success" role="status">{notice}</p>}
      <p className="family-switch">{mode === 'sign-in' ? 'New to Chronos?' : 'Already have an account?'} <button type="button" className="quiet-link" onClick={() => { setMode(mode === 'sign-in' ? 'create' : 'sign-in'); setError(''); setNotice(''); }}>{mode === 'sign-in' ? 'Create an account' : 'Sign in instead'}</button></p>
    </section>
  </>;
}

function inferredSetup(account: AccountSnapshot): AccountSetup | undefined {
  if (account.setup) return account.setup;
  if (account.profiles.length) return 'shared';
  if (account.learners.length) return 'separate';
  if (account.parents.length) return 'learner';
  return undefined;
}

function AccountPage({ gateway, session, onSignedOut }: { gateway: FamilyGateway; session: NonNullable<Session>; onSignedOut(): void }) {
  const [account, setAccount] = useState<AccountSnapshot>();
  const [waiting, setWaiting] = useState(0);
  const [error, setError] = useState('');
  const [choosing, setChoosing] = useState(false);
  const load = useCallback(async () => {
    setError('');
    try {
      const loaded = await gateway.loadAccount();
      setAccount(loaded);
      if (loaded.learners.length || loaded.profiles.length) setWaiting((await gateway.loadReviewQueue()).filter((item) => item.status === 'submitted').length);
    } catch (caught) { setError(familyErrorMessage(caught, 'Your account couldn’t be loaded. Check your connection and retry.')); }
  }, [gateway]);
  useEffect(() => { void load(); }, [load]);
  const signOut = async () => { await gateway.signOut().catch(() => undefined); onSignedOut(); };
  const choose = async (setup: AccountSetup) => {
    setError('');
    try { await gateway.saveSetup(setup); setChoosing(false); await load(); }
    catch (caught) { setError(familyErrorMessage(caught, 'That choice couldn’t be saved. Please try again.')); }
  };

  if (error && !account) return <><header className="page-intro"><p className="label">Account</p><h1>We couldn’t open your account.</h1><p>{error}</p></header><button className="primary" onClick={load}>Retry</button></>;
  if (!account) return <p className="family-loading" aria-busy="true">Opening your account…</p>;
  const setup = choosing ? undefined : inferredSetup(account);
  const changed = () => { refreshActiveLearner(); return load(); };
  const cards = setup === 'shared'
    ? [<KidsOnAccountCard key="kids" gateway={gateway} account={account} waiting={waiting} onChange={changed} />, <ParentPinCard key="pin" gateway={gateway} account={account} onChange={load} />, <ReviewLearnersCard key="linked" gateway={gateway} account={account} waiting={0} onChange={load} secondary />]
    : setup === 'separate'
      ? [<ReviewLearnersCard key="linked" gateway={gateway} account={account} waiting={waiting} onChange={load} />]
      : setup === 'learner'
        ? [<LinkToParentCard key="learner" gateway={gateway} account={account} onChange={load} />]
        : [];
  return <>
    <header className="page-intro"><p className="label">Account{setup === 'shared' ? ' · Parent view' : ''}</p><h1>Hi{account.displayName ? `, ${account.displayName}` : ''}.</h1><p>Signed in as {session.email ?? 'your account'}. <button className="quiet-link" onClick={signOut}><LogOut aria-hidden="true" /> Sign out</button></p></header>
    {error && <p className="error" role="alert">{error}</p>}
    <div className="family-grid">
      <DisplayNameCard gateway={gateway} account={account} onSaved={load} />
      {setup ? cards : <SetupChooser onChoose={choose} />}
    </div>
    {setup && <p className="family-hint family-change-setup">Set up for a different situation? <button className="quiet-link" onClick={() => setChoosing(true)}>Change how this account is used</button></p>}
  </>;
}

const setupChoices: Array<{ setup: AccountSetup; title: string; body: string; recommended?: boolean }> = [
  { setup: 'separate', recommended: true, title: 'My kid will have their own sign-in', body: 'Best for most families. Each kid signs in on their own and gives you a code to link, so their progress and cards stay theirs.' },
  { setup: 'shared', title: 'My kids will share this sign-in', body: 'For kids without their own email. Chronos opens as a kid, and a button in the menu switches kids or opens parent view. You can lock parent view with a PIN.' },
  { setup: 'learner', title: 'Just me. I’m the learner.', body: 'Your parent can link to you later with a code from this page.' },
];

function SetupChooser({ onChoose }: { onChoose(setup: AccountSetup): void }) {
  return <section className="family-card setup-card" aria-labelledby="setup-title">
    <h2 id="setup-title"><Users aria-hidden="true" /> Who will use Chronos on this account?</h2>
    <div className="setup-options">{setupChoices.map((choice) => <button key={choice.setup} type="button" className={`setup-option${choice.recommended ? ' recommended' : ''}`} onClick={() => onChoose(choice.setup)}>
      <span className="setup-option-title">{choice.title}{choice.recommended && <span className="setup-badge">Recommended</span>}</span>
      <span className="setup-option-body">{choice.body}</span>
    </button>)}</div>
  </section>;
}

function KidsOnAccountCard({ gateway, account, waiting, onChange }: { gateway: FamilyGateway; account: AccountSnapshot; waiting: number; onChange(): void }) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [renaming, setRenaming] = useState<{ id: string; name: string }>();
  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true); setError('');
    try { await gateway.addProfile(name); setName(''); onChange(); }
    catch (caught) { setError(familyErrorMessage(caught, 'That kid couldn’t be added. Please try again.')); }
    finally { setBusy(false); }
  };
  const rename = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!renaming?.name.trim()) return;
    try { await gateway.renameProfile(renaming.id, renaming.name); setRenaming(undefined); onChange(); }
    catch (caught) { setError(familyErrorMessage(caught, 'That name couldn’t be saved. Please try again.')); }
  };
  const remove = async (kid: FamilyMember) => {
    if (!window.confirm(`Remove ${nameOf(kid)}? Their progress, answers and cards on this account will be deleted.`)) return;
    try { await gateway.removeProfile(kid.id); onChange(); }
    catch (caught) { setError(familyErrorMessage(caught, 'That kid couldn’t be removed. Please try again.')); }
  };
  const first = account.profiles[0];
  return <section className="family-card" aria-labelledby="kids-title">
    <h2 id="kids-title"><Users aria-hidden="true" /> Kids on this account</h2>
    {account.profiles.length
      ? <>
          <ul className="family-members">{account.profiles.map((kid) => <li key={kid.id}>
            {renaming?.id === kid.id
              ? <form className="family-rename" onSubmit={rename}><label className="sr-only" htmlFor={`rename-${kid.id}`}>New name for {nameOf(kid)}</label><input id={`rename-${kid.id}`} value={renaming.name} onChange={(event) => setRenaming({ id: kid.id, name: event.target.value })} maxLength={60} autoFocus /><button className="secondary">Save</button><button type="button" className="quiet-link" onClick={() => setRenaming(undefined)}>Cancel</button></form>
              : <><span>{nameOf(kid)}</span><span className="family-member-actions"><button className="quiet-link" onClick={() => setRenaming({ id: kid.id, name: kid.displayName ?? '' })}>Rename</button><button className="quiet-link" onClick={() => remove(kid)}>Remove</button></span></>}
          </li>)}</ul>
          <div className="review-link-row">
            <a className="primary review-link" href="/review"><ClipboardCheck aria-hidden="true" /> {waiting ? `Review work · ${waiting} waiting` : 'Open Review'}</a>
            {first && <button className="secondary" onClick={() => switchToKid(first.id)}>Switch to {nameOf(first)}</button>}
          </div>
          <p className="family-hint">Chronos opens as a kid. To switch kids or come back to parent view, use the name button at the top of the menu.</p>
        </>
      : <p>Add each kid who will use this sign-in. They don’t need an email.</p>}
    <form className="family-inline-form" onSubmit={add}>
      <label htmlFor="kid-name">{account.profiles.length ? 'Add another kid' : 'Kid’s first name'}</label>
      <input id="kid-name" value={name} onChange={(event) => { setName(event.target.value); setError(''); }} maxLength={60} autoComplete="off" required autoFocus={!account.profiles.length} />
      <button className="secondary" disabled={busy || !name.trim()}><UserPlus aria-hidden="true" /> {busy ? 'Adding…' : 'Add kid'}</button>
    </form>
    {error && <p className="error" role="alert">{error}</p>}
  </section>;
}

function ParentPinCard({ gateway, account, onChange }: { gateway: FamilyGateway; account: AccountSnapshot; onChange(): void }) {
  const [editing, setEditing] = useState(false);
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const save = async (next: string | null) => {
    setBusy(true); setError(''); setNotice('');
    try { await gateway.setParentPin(next); setEditing(false); setPin(''); setNotice(next ? 'PIN saved.' : 'PIN turned off.'); onChange(); }
    catch (caught) { setError(familyErrorMessage(caught, 'The PIN couldn’t be saved. Please try again.')); }
    finally { setBusy(false); }
  };
  return <section className="family-card" aria-labelledby="pin-title">
    <h2 id="pin-title"><Lock aria-hidden="true" /> Parent view PIN</h2>
    <p>{account.parentPin ? 'On. Chronos asks for this PIN before opening parent view.' : 'Off. Anyone using this sign-in can open parent view. Add a PIN if you’d like to keep Review to yourself.'}</p>
    {editing
      ? <form className="family-inline-form" onSubmit={(event) => { event.preventDefault(); void save(pin); }}>
          <label htmlFor="new-pin">New 4-digit PIN</label>
          <input id="new-pin" className="pin-input" value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" autoComplete="off" maxLength={4} autoFocus />
          <button className="secondary" disabled={busy || pin.length !== 4}>{busy ? 'Saving…' : 'Save PIN'}</button>
        </form>
      : <div className="review-actions">
          <button className="secondary" onClick={() => { setEditing(true); setNotice(''); }}>{account.parentPin ? 'Change PIN' : 'Add a PIN'}</button>
          {account.parentPin && <button className="quiet-link" disabled={busy} onClick={() => save(null)}>Turn off the PIN</button>}
        </div>}
    {account.parentPin && <p className="family-hint">Forgot it? Sign out and sign back in. Signing in opens parent view, where you can change it.</p>}
    {notice && <p className="family-success" role="status"><Check aria-hidden="true" /> {notice}</p>}
    {error && <p className="error" role="alert">{error}</p>}
  </section>;
}

/** On a shared account in kid view, account and review pages lead back to parent view. */
function KidViewPage({ gateway, active, reviewing }: { gateway: FamilyGateway; active: ActiveLearner; reviewing: boolean }) {
  const kid = active.profiles.find((profile) => profile.id === active.learnerId);
  const others = active.profiles.filter((profile) => profile.id !== active.learnerId);
  return <>
    <header className="page-intro"><p className="label">{reviewing ? 'Review' : 'Account'}</p><h1>You’re using Chronos as {kid?.displayName ?? 'a kid'}.</h1><p>{reviewing ? 'Reviewing work happens in parent view.' : 'This sign-in belongs to your parent. Account settings are in parent view.'}</p></header>
    <section className="family-card kid-view-card" aria-label="Switch profile">
      <ParentViewEntry gateway={gateway} className="primary" label="Switch to parent view" onSwitch={() => { enterParentView(); window.location.reload(); }} />
      {others.length > 0 && <div className="kid-view-others"><p className="family-hint">Or switch to:</p>{others.map((other) => <button key={other.id} className="secondary" onClick={() => switchToKid(other.id)}>{other.displayName}</button>)}</div>}
      <a className="quiet-link" href="/home">Back to learning</a>
    </section>
  </>;
}

function DisplayNameCard({ gateway, account, onSaved }: { gateway: FamilyGateway; account: AccountSnapshot; onSaved(): void }) {
  const [name, setName] = useState(account.displayName ?? '');
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setState('saving');
    try { await gateway.saveDisplayName(name); setState('saved'); onSaved(); } catch { setState('error'); }
  };
  return <section className="family-card" aria-labelledby="name-title">
    <h2 id="name-title"><UserRound aria-hidden="true" /> Your name</h2>
    <p>This is the name your parent or learner sees.</p>
    <form className="family-inline-form" onSubmit={save}>
      <label className="sr-only" htmlFor="display-name">Your name</label>
      <input id="display-name" value={name} onChange={(event) => { setName(event.target.value); setState('idle'); }} maxLength={60} required />
      <button className="secondary" disabled={state === 'saving' || !name.trim()}>{state === 'saving' ? 'Saving…' : 'Save'}</button>
    </form>
    {state === 'saved' && <p className="family-success" role="status"><Check aria-hidden="true" /> Saved.</p>}
    {state === 'error' && <p className="error" role="alert">Your name couldn’t be saved. Please try again.</p>}
  </section>;
}

function LinkToParentCard({ gateway, account, onChange }: { gateway: FamilyGateway; account: AccountSnapshot; onChange(): void }) {
  const [code, setCode] = useState(account.linkCode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => setCode(account.linkCode), [account.linkCode]);
  const rotate = async () => {
    setBusy(true); setError('');
    try { setCode(await gateway.rotateLinkCode()); } catch (caught) { setError(familyErrorMessage(caught, 'A new code couldn’t be made. Please try again.')); }
    finally { setBusy(false); }
  };
  const unlink = async (parent: FamilyMember) => {
    if (!window.confirm(`Unlink ${nameOf(parent)}? They will stop seeing your lessons.`)) return;
    try { await gateway.unlink(parent.id, account.userId); onChange(); } catch (caught) { setError(familyErrorMessage(caught, 'That link couldn’t be removed. Please try again.')); }
  };
  const linked = account.parents.length > 0;
  return <section className="family-card" aria-labelledby="link-parent-title">
    <h2 id="link-parent-title"><KeyRound aria-hidden="true" /> {linked ? 'Your parent' : 'Link to a parent'}</h2>
    {linked
      ? <ul className="family-members">{account.parents.map((parent) => <li key={parent.id}><span><Check aria-hidden="true" /> {nameOf(parent)} reviews your lessons.</span><button className="quiet-link" onClick={() => unlink(parent)}>Unlink</button></li>)}</ul>
      : <p>When you finish a lesson, your parent reads your answers. When they pass it, you earn its Knowledge Cards.</p>}
    <p className="family-step">{linked ? 'To add another parent, give them this code:' : 'Give your parent this code. They enter it on their own Account page.'}</p>
    <p className="link-code" aria-label={`Your link code: ${code.split('').join(' ')}`}>{formatLinkCode(code)}</p>
    <p className="family-hint">Each code works once. <button className="quiet-link" onClick={rotate} disabled={busy}><RefreshCw aria-hidden="true" /> {busy ? 'Making a new code…' : 'Get a new code'}</button></p>
    {error && <p className="error" role="alert">{error}</p>}
  </section>;
}

function ReviewLearnersCard({ gateway, account, waiting, onChange, secondary = false }: { gateway: FamilyGateway; account: AccountSnapshot; waiting: number; onChange(): void; secondary?: boolean }) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [linkedName, setLinkedName] = useState('');
  const link = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true); setError(''); setLinkedName('');
    try { const learner = await gateway.linkLearner(code); setLinkedName(nameOf(learner)); setCode(''); onChange(); }
    catch (caught) { setError(familyErrorMessage(caught, 'That code couldn’t be linked. Please try again.')); }
    finally { setBusy(false); }
  };
  const unlink = async (learner: FamilyMember) => {
    if (!window.confirm(`Unlink ${nameOf(learner)}? You will stop seeing their lessons.`)) return;
    try { await gateway.unlink(account.userId, learner.id); onChange(); } catch (caught) { setError(familyErrorMessage(caught, 'That link couldn’t be removed. Please try again.')); }
  };
  const hasLearners = account.learners.length > 0;
  return <section className="family-card" aria-labelledby="review-learners-title">
    <h2 id="review-learners-title"><KeyRound aria-hidden="true" /> {secondary ? 'Kids with their own sign-in' : hasLearners ? 'Kids you review' : 'Link your kid'}</h2>
    {hasLearners
      ? <>
          <ul className="family-members">{account.learners.map((learner) => <li key={learner.id}><span>{nameOf(learner)}</span><button className="quiet-link" onClick={() => unlink(learner)}>Unlink</button></li>)}</ul>
          {!secondary && <a className="primary review-link" href="/review"><ClipboardCheck aria-hidden="true" /> {waiting ? `Review work · ${waiting} waiting` : 'Open Review'}</a>}
        </>
      : <p>{secondary ? 'If a kid has their own sign-in, enter the code from their Account page.' : 'Your kid creates their own account, chooses “Just me. I’m the learner.”, and reads you the code on their Account page. Enter it here.'}</p>}
    <form className="family-inline-form" onSubmit={link}>
      <label htmlFor="learner-code">{hasLearners ? 'Link another kid' : 'Kid’s link code'}</label>
      <input id="learner-code" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="ABCD-EFGH" autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={12} required />
      <button className="secondary" disabled={busy || code.replace(/[^A-Za-z0-9]/g, '').length < 8}>{busy ? 'Linking…' : 'Link'}</button>
    </form>
    {linkedName && <p className="family-success" role="status"><Check aria-hidden="true" /> Linked to {linkedName}.</p>}
    {error && <p className="error" role="alert">{error}</p>}
  </section>;
}

function ReviewPage({ gateway }: { gateway: FamilyGateway }) {
  const [account, setAccount] = useState<AccountSnapshot>();
  const [items, setItems] = useState<ReviewItem[]>();
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setError('');
    try {
      const [loadedAccount, queue] = await Promise.all([gateway.loadAccount(), gateway.loadReviewQueue()]);
      setAccount(loadedAccount); setItems(queue);
    } catch (caught) { setError(familyErrorMessage(caught, 'Review couldn’t be loaded. Check your connection and retry.')); }
  }, [gateway]);
  useEffect(() => { void load(); }, [load]);

  if (error && !items) return <><header className="page-intro"><p className="label">Review</p><h1>We couldn’t open Review.</h1><p>{error}</p></header><button className="primary" onClick={load}>Retry</button></>;
  if (!account || !items) return <p className="family-loading" aria-busy="true">Opening Review…</p>;
  const reviewable = [...account.learners, ...account.profiles];
  if (!reviewable.length) return <header className="page-intro"><p className="label">Review</p><h1>No kids to review yet.</h1><p>Link a kid with their code, or add kids to this sign-in, on <a href="/account">your Account page</a>.</p></header>;
  const learnerById = new Map(reviewable.map((learner) => [learner.id, learner]));
  const known = items.filter((item) => lessonById.has(item.lessonId) && learnerById.has(item.learnerId));
  const waiting = known.filter((item) => item.status === 'submitted').sort((left, right) => left.submittedAt.localeCompare(right.submittedAt));
  const reviewed = known.filter((item) => item.status !== 'submitted');
  return <>
    <header className="page-intro"><p className="label">Review</p><h1>{waiting.length ? `${waiting.length} ${waiting.length === 1 ? 'lesson is' : 'lessons are'} waiting.` : 'All caught up.'}</h1><p>Read each answer. Pass the lesson to award its Knowledge Cards, or send it back with a note about what to change.</p></header>
    <section aria-labelledby="waiting-title" className="review-list">
      <h2 id="waiting-title" className="sr-only">Waiting for review</h2>
      {waiting.map((item) => <ReviewCard key={`${item.learnerId}:${item.lessonId}`} item={item} learner={learnerById.get(item.learnerId)!} gateway={gateway} onReviewed={load} />)}
      {!waiting.length && <p className="family-hint">New submissions appear here when a learner finishes a lesson.</p>}
    </section>
    {reviewed.length > 0 && <section className="dashboard-section" aria-labelledby="reviewed-title">
      <div className="section-title"><div><p className="label">History</p><h2 id="reviewed-title">Reviewed</h2></div></div>
      <ul className="reviewed-list">{reviewed.map((item) => <li key={`${item.learnerId}:${item.lessonId}`}><span className={`review-tag review-tag-${item.status}`}>{item.status === 'passed' ? 'Passed' : 'Sent back'}</span><strong>{lessonById.get(item.lessonId)!.title}</strong><span>{nameOf(learnerById.get(item.learnerId))} · {shortDate(item.reviewedAt)}</span></li>)}</ul>
    </section>}
  </>;
}

function ReviewCard({ item, learner, gateway, onReviewed }: { item: ReviewItem; learner: FamilyMember; gateway: FamilyGateway; onReviewed(): void }) {
  const lesson = lessonById.get(item.lessonId)!;
  const cards = cardsForLesson(item.lessonId).map((id) => cardById.get(id)!).filter(Boolean);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState<ReviewDecision | ''>('');
  const [error, setError] = useState('');
  const name = nameOf(learner);
  const decide = async (decision: ReviewDecision) => {
    if (decision === 'return' && !note.trim()) { setError(`Add a note so ${name} knows what to change.`); return; }
    setBusy(decision); setError('');
    try { await gateway.review(item.learnerId, item.lessonId, decision, note, cards.map((card) => card.id)); onReviewed(); }
    catch (caught) { setError(familyErrorMessage(caught, 'Your review couldn’t be saved. Please try again.')); setBusy(''); }
  };
  const noteId = `note-${item.learnerId}-${item.lessonId}`;
  return <article className="family-card review-card" aria-labelledby={`${noteId}-title`}>
    <header>
      <p className="label">{name} · sent {shortDate(item.submittedAt)}{item.round > 1 ? ' · resubmitted' : ''}</p>
      <h3 id={`${noteId}-title`}><a href={`/learn/${lesson.id}`}>{lesson.title}</a></h3>
    </header>
    {item.round > 1 && item.feedback && <figure className="parent-note"><figcaption><MessageSquareQuote aria-hidden="true" /> Your last note</figcaption><blockquote>{item.feedback}</blockquote></figure>}
    <ol className="review-answers">{reviewEntries(lesson.promptIds, promptById, item.answers, item.questions).map((entry) => <li key={entry.promptId} className={entry.retired ? 'review-answer-retired' : undefined}>
      <p className="review-question">{entry.question}</p>
      {entry.retired && <p className="review-retired-note">This question has since changed in the lesson. It is shown as {name} saw it.</p>}
      <p className="review-answer">{entry.answer ?? <em className="no-answer">No answer</em>}</p>
      {entry.verdict === 'best' && <p className="review-verdict review-verdict-best"><Check aria-hidden="true" /> Best-supported answer</p>}
      {entry.verdict === 'other' && <p className="review-verdict review-verdict-other">Not the best-supported answer</p>}
      {entry.explanation && <details className="review-guide"><summary><ChevronDown aria-hidden="true" /> What a strong answer covers</summary><p>{entry.explanation}</p></details>}
    </li>)}</ol>
    <label htmlFor={noteId} className="review-note-label">Note for {name} <span>(needed to send it back)</span></label>
    <textarea id={noteId} value={note} onChange={(event) => { setNote(event.target.value); setError(''); }} maxLength={2000} placeholder={`Nice work, or what ${name} should add…`} />
    <div className="review-actions">
      <button className="primary" disabled={Boolean(busy)} onClick={() => decide('pass')}>{busy === 'pass' ? 'Passing…' : cards.length === 1 ? `Pass and award the ${cards[0].title} card` : cards.length > 1 ? `Pass and award ${cards.length} cards` : 'Pass'}</button>
      <button className="secondary" disabled={Boolean(busy)} onClick={() => decide('return')}>{busy === 'return' ? 'Sending back…' : 'Send back'}</button>
    </div>
    {error && <p className="error" role="alert">{error}</p>}
  </article>;
}
