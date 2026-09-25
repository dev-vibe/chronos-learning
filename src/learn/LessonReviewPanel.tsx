import React from 'react';
import { ChevronRight, Hourglass, MessageSquareQuote, PartyPopper, UserRound } from 'lucide-react';
import type { KnowledgeCard, Lesson, UnderstandingPrompt } from '../domains/contracts';
import { KnowledgeCardReveal } from './KnowledgeCardReveal';
import type { LearnState } from './progress';

type Props = {
  lesson: Lesson;
  state: LearnState;
  prompts: UnderstandingPrompt[];
  configuredCards: KnowledgeCard[];
  ownedCards: KnowledgeCard[];
  next?: Lesson;
  ready: boolean;
  busy: boolean;
  error: string;
  onSubmit(): void;
};

const rewardPhrase = (cards: KnowledgeCard[]) => cards.length === 0
  ? 'When they pass it, the lesson is marked as passed.'
  : cards.length === 1
    ? `When they pass it, you earn the ${cards[0].title} Knowledge Card.`
    : `When they pass it, you earn ${cards.length} Knowledge Cards.`;

const sentAt = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
};

function NextLesson({ next }: { next?: Lesson }) {
  return <>
    <div className="next-lesson-preview">{next && <><h3>Next: {next.title}</h3><p>{next.significance}</p></>}</div>
    <div className="actions">{next ? <a className="primary" href={`/learn/${next.id}`}>Continue: {next.title} <ChevronRight /></a> : <span className="journey-end">You have reached the available lessons in this journey. Come back to explore them again.</span>}</div>
  </>;
}

function LinkParentNote() {
  return <p className="review-callout"><UserRound aria-hidden="true" /><span>You haven’t linked a parent yet. <a href="/account">Link one on your Account page</a> so they can review your answers.</span></p>;
}

function ParentNote({ label, note }: { label: string; note: string }) {
  return <figure className="parent-note"><figcaption><MessageSquareQuote aria-hidden="true" /> {label}</figcaption><blockquote>{note}</blockquote></figure>;
}

export function LessonReviewPanel({ lesson, state, prompts, configuredCards, ownedCards, next, ready, busy, error, onSubmit }: Props) {
  const review = state.review;
  const account = state.account;
  const answered = new Set(state.attemptedPromptIds);
  const errorLine = error ? <p className="error" role="alert">{error} <button onClick={onSubmit}>Retry</button></p> : null;
  const ownedList = ownedCards.length > 0 && <div className="card-reveal-list">{ownedCards.map((card) => <React.Fragment key={card.id}><KnowledgeCardReveal card={card} /></React.Fragment>)}</div>;

  // Guests finish in this browser only; cards need a parent's pass.
  if (!account) {
    if (state.status !== 'completed') return <section className="completion-panel" aria-labelledby="completion-title"><p className="eyebrow">Your next step</p><h2 id="completion-title">Finish {lesson.title}</h2><p>Share your thinking in the checks above, then finish the lesson when you are ready.</p><button className="primary" disabled={!ready || busy} onClick={onSubmit}>{busy ? 'Finishing…' : ready ? 'Finish lesson' : 'Answer the checks above'}</button><p className="review-callout"><UserRound aria-hidden="true" /><span><a href="/account">Sign in</a> to send your answers to a parent and earn Knowledge Cards.</span></p>{errorLine}</section>;
    return <section className="completion-panel" aria-labelledby="completion-title"><p className="eyebrow">Your next step</p><h2 id="completion-title">Lesson finished</h2><p className="completion-understanding">{lesson.learningOutcome ?? lesson.significance}</p>{ownedList}<p className="review-callout"><UserRound aria-hidden="true" /><span><a href="/account">Sign in</a> to send your answers to a parent and earn Knowledge Cards.</span></p><NextLesson next={next} /></section>;
  }

  if (!review) {
    if (account.view === 'parent') return <section className="completion-panel" aria-labelledby="completion-title"><p className="eyebrow">Parent view</p><h2 id="completion-title">You’re in parent view</h2><p>Kids finish lessons from their own profile. Use the Parent view button in the menu to switch to a kid, or <a href="/review">review their work</a>.</p><NextLesson next={next} /></section>;
    // Finished before parent review existed: the lesson stays finished; sending is how the cards are earned now.
    if (state.status === 'completed') return <section className="completion-panel" aria-labelledby="completion-title"><p className="eyebrow">Your next step</p><h2 id="completion-title">Lesson finished</h2><p className="completion-understanding">{lesson.learningOutcome ?? lesson.significance}</p>{ownedList}<p>Send your answers to your parent. {rewardPhrase(configuredCards)}</p>{!account.parentLinked && <LinkParentNote />}<button className="primary" disabled={!ready || busy} onClick={onSubmit}>{busy ? 'Sending…' : ready ? 'Send for review' : 'Answer the checks above to send'}</button>{errorLine}<NextLesson next={next} /></section>;
    return <section className="completion-panel" aria-labelledby="completion-title"><p className="eyebrow">Your next step</p><h2 id="completion-title">Finish {lesson.title}</h2><p>When you finish, your answers go to your parent. {rewardPhrase(configuredCards)}</p>{!account.parentLinked && <LinkParentNote />}<button className="primary" disabled={!ready || busy} onClick={onSubmit}>{busy ? 'Sending…' : ready ? 'Finish and send for review' : 'Answer the checks above'}</button>{errorLine}</section>;
  }

  if (review.status === 'returned') {
    return <section className="completion-panel review-returned" aria-labelledby="completion-title"><p className="eyebrow">Sent back</p><h2 id="completion-title">Your parent sent this back</h2>{review.feedback && <ParentNote label="Their note" note={review.feedback} />}<p>Change your answers in the checks above, then send it again. The lesson stays finished while you work on it.</p><ul className="review-prompt-links">{prompts.map((prompt, index) => <li key={prompt.id}><a href={`#prompt-${prompt.id}`}>Question {index + 1}: {prompt.question}</a>{prompt.required && !answered.has(prompt.id) && <span className="review-prompt-todo"> · not answered yet</span>}</li>)}</ul><button className="primary" disabled={!ready || busy} onClick={onSubmit}>{busy ? 'Sending…' : ready ? 'Send it again' : 'Answer every check above to send it again'}</button>{errorLine}<NextLesson next={next} /></section>;
  }

  if (review.status === 'submitted') {
    return <section className="completion-panel" aria-labelledby="completion-title"><p className="eyebrow">Waiting for review</p><h2 id="completion-title">Lesson finished</h2><p className="completion-understanding">{lesson.learningOutcome ?? lesson.significance}</p><p className="review-status" role="status"><Hourglass aria-hidden="true" /><span>Sent to your parent{sentAt(review.submittedAt) ? ` on ${sentAt(review.submittedAt)}` : ''}. {rewardPhrase(configuredCards)}</span></p>{!account.parentLinked && <LinkParentNote />}{review.round > 1 && review.feedback && <ParentNote label="Their last note" note={review.feedback} />}{ready
      ? <p className="review-update">Changed an answer above? <button className="quiet-link" disabled={busy} onClick={onSubmit}>{busy ? 'Sending…' : 'Send my updated answers'}</button></p>
      : <p className="review-update">To send updated answers, answer every check above first. Your parent already has the answers you sent.</p>}{errorLine}<NextLesson next={next} /></section>;
  }

  return <section className="completion-panel review-passed" aria-labelledby="completion-title"><p className="eyebrow"><PartyPopper aria-hidden="true" /> Passed</p><h2 id="completion-title">Lesson passed</h2><p className="completion-understanding">{lesson.learningOutcome ?? lesson.significance}</p>{review.feedback && <ParentNote label="Your parent said" note={review.feedback} />}{ownedList}<NextLesson next={next} /></section>;
}
