import React, { useEffect, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { auditUnlockEnabled, envPreviewUnlockEnabled, setAuditUnlockEnabled, unlockPreviewLessonsEnabled } from '../config/runtimeFlags';
import { useChronosTheme } from '../theme/useChronosTheme';
import { GlobalNavigation } from './GlobalNavigation';
import '../learn/learn.css';
import './app.css';

const WORLD_HISTORY_HREF = '/library/journey.world-history';

type AuditAppProps = {
  search?: string;
  navigate?: (destination: string) => void;
};

const readSearch = (search: string) => new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);

export function AuditApp({
  search = typeof window === 'undefined' ? '' : window.location.search,
  navigate = (destination) => window.location.assign(destination),
}: AuditAppProps) {
  const { theme, toggleTheme } = useChronosTheme();
  const params = useMemo(() => readSearch(search), [search]);
  const autoOn = params.has('on');
  const autoOff = params.has('off');
  const browserOn = auditUnlockEnabled();
  const envOn = envPreviewUnlockEnabled();
  const previewOn = unlockPreviewLessonsEnabled();

  useEffect(() => {
    document.title = 'Audit mode · Chronos';
  }, []);

  useEffect(() => {
    if (autoOn) {
      setAuditUnlockEnabled(true);
      navigate(WORLD_HISTORY_HREF);
      return;
    }
    if (autoOff) {
      setAuditUnlockEnabled(false);
      navigate('/audit');
    }
  }, [autoOn, autoOff, navigate]);

  const turnOn = () => {
    setAuditUnlockEnabled(true);
    navigate(WORLD_HISTORY_HREF);
  };
  const turnOff = () => {
    setAuditUnlockEnabled(false);
    navigate('/audit');
  };

  return <div className="discovery-app" data-theme={theme}>
    <GlobalNavigation theme={theme} onTheme={toggleTheme} auditMode={previewOn} />
    <main className="discovery-main audit-page">
      <header className="page-intro">
        <p className="label">Internal</p>
        <h1>Audit mode</h1>
        <p>Open authored draft lessons and skip World History locks in this browser. Other visitors stay on the published learner path. This does not publish anything.</p>
      </header>
      <section className="audit-panel" aria-labelledby="audit-status-title">
        <p className="label">This browser</p>
        <h2 id="audit-status-title">{browserOn ? 'Audit mode is on.' : 'Audit mode is off.'}</h2>
        <p>{browserOn
          ? 'Draft lessons are openable here, and World History will not wait on earlier completions.'
          : 'Published lessons follow the usual curriculum gates. Turn this on when you want to inspect drafts on staging or production.'}</p>
        {envOn && !browserOn ? <p className="quiet-notice" role="status">This development environment also has the preview env flag on, so drafts are already open here even without the browser toggle.</p> : null}
        <div className="audit-actions">
          {browserOn
            ? <>
              <a className="primary-action" href={WORLD_HISTORY_HREF}>Open World History <ArrowRight /></a>
              <button type="button" onClick={turnOff}>Turn off audit mode</button>
            </>
            : <button className="primary-action" type="button" onClick={turnOn}>Turn on audit mode <ArrowRight /></button>}
        </div>
      </section>
    </main>
  </div>;
}
