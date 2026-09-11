import React, { useEffect } from 'react';
import { Printer } from 'lucide-react';
import { chronosContent } from '../../content/chronos';
import type { ChronosContentBundle } from '../../content/assemble';
import { GlobalNavigation } from '../app/GlobalNavigation';
import { useChronosTheme } from '../theme/useChronosTheme';
import { availableCompanions } from './companions';
import '../app/app.css';
import './educators.css';

/** This public route deliberately has no auth, learner-progress, or journey gateway. */
export function EducatorApp({ lessonId, content = chronosContent }: { lessonId?: string; content?: ChronosContentBundle }) {
  const { theme, toggleTheme } = useChronosTheme();
  const available = availableCompanions(content);
  const selected = available.find((item) => item.lesson.id === lessonId);
  useEffect(() => { document.title = `${selected?.lesson.title ?? 'Lesson companions'} · Parents and educators · Chronos`; }, [selected?.lesson.title]);
  return <div className="discovery-app educator-app" data-theme={theme}>
    <GlobalNavigation theme={theme} onTheme={toggleTheme} />
    <main className="discovery-main educator-main">
      <a className="back-link no-print" href={lessonId ? '/educators' : '/library'}>← {lessonId ? 'All lesson companions' : 'Back to Library'}</a>
      {lessonId && !selected ? <header className="page-intro"><h1>This companion isn’t available.</h1><p>Choose an available lesson companion. Your learning is unchanged.</p></header> : selected ? <>
        <header className="page-intro"><p className="label">Parent and educator companion</p><h1>{selected.lesson.title}</h1><p>{selected.lesson.masthead} · {selected.lesson.place}</p></header>
        <div className="companion-actions no-print"><a className="primary-action" href={`/learn/${selected.lesson.id}`}>Open lesson</a><button onClick={() => window.print()}><Printer aria-hidden="true" /> Print companion</button></div>
        <section><h2>Lesson purpose</h2><p>{selected.companion.purpose}</p><p>Invite an explanation in the learner’s own words. A sincere attempt completes the lesson; completion is not a claim of mastery.</p></section>
        <section><h2>Discuss together</h2><p>Let the learner look first. Use one question at a time and offer reading support when useful.</p><ol>{selected.companion.discussion.map((prompt) => <li key={prompt}>{prompt}</li>)}</ol></section>
        <section><h2>Ideas to listen for</h2>{selected.companion.misconceptions.map((item) => <div key={item.idea}><h3>{item.idea}</h3><p>{item.guidance}</p></div>)}</section>
        <section><h2>An example explanation</h2><p>{selected.companion.example.question}</p><blockquote>{selected.companion.example.explanation}</blockquote><p>This is one sound explanation, not a script to memorize or an assessment of a learner’s answer.</p></section>
        <section className="print-notes"><h2>Space for your conversation</h2><p>What evidence did we discuss? What could we return to another day?</p><div aria-hidden="true" /></section>
        <section className="companion-references"><h2>Edition and references</h2><p>Companion edition {selected.companion.revision} · {selected.companion.revisedOn} · Lesson reference: {selected.lesson.id}</p><p>These references accompany the canonical Chronos lesson. Source review status is retained below.</p><ul>{selected.companion.referenceSourceIds.map((id) => { const source = content.sources.find((item) => item.id === id); return source ? <li key={id}><a href={source.url}>{source.title}</a><span>{source.publisher} · accessed {source.accessedOn}{source.reviewStatus !== 'reviewed' ? ' · further editorial source review recorded' : ''}</span></li> : null; })}</ul><p>Curriculum mappings are not yet assigned. Future mappings will name the framework, its version, and the companion edition; Chronos retains editorial control of the lesson.</p></section>
      </> : <>
        <header className="page-intro"><p className="label">Parents and educators</p><h1>Learn together.</h1><p>Public lesson companions with purpose, discussion guidance, and printable material for independent or supported learning.</p></header>
        <div className="companion-list">{available.map(({ lesson, companion }) => <article key={lesson.id}><h2><a href={`/educators/${lesson.id}`}>{lesson.title}</a></h2><p>{companion.purpose}</p><small>Companion edition {companion.revision}</small></article>)}</div>
      </>}
      <aside className="companion-privacy"><h2>About these companions</h2><p>These pages contain public lesson material. They do not show a child’s progress, identity, or private explanations.</p><p>Shared progress views require family account relationships, consent, and access controls that are not yet available. Discuss learning together using what the learner chooses to share.</p></aside>
    </main>
  </div>;
}
