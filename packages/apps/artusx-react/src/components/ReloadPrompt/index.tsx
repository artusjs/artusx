import { useRegisterSW } from 'virtual:pwa-register/react';
import { useMeasure } from '../../hooks/useMeasure';
import './index.css';

const ReloadPrompt = () => {
  const swStartTime = performance.now();

  useMeasure('reloadPromptMeasure', 'root.render', 'reloadPrompt.render');

  // replaced dynamically
  const buildDate = '__DATE__';
  // replaced dyanmicaly
  const reloadSW = '__RELOAD_SW__';

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl: string, r: any) {
      console.log(`Service Worker at: ${swUrl}, buildDate: ${buildDate}, reloadSW: ${reloadSW}`);
      // @ts-expect-error just ignore
      if (reloadSW === 'true') {
        r &&
          setInterval(() => {
            console.log('Checking for sw update');
            r.update();
          }, 20000 /* 20s for testing purposes */);
      } else {
        // eslint-disable-next-line prefer-template
        console.log('SW Registered', r);
      }

      const swEndTime = performance.now();
      console.log(`SW Registered time: ${swEndTime - swStartTime}`);
    },
    onRegisterError(error: any) {
      console.log('SW registration error', error);
    },
  });

  console.log('offlineReady', offlineReady);
  console.log('needRefresh', needRefresh);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className="ReloadPrompt-container">
      {(offlineReady || needRefresh) && (
        <div className="ReloadPrompt-toast">
          <div className="ReloadPrompt-message">
            {offlineReady ? (
              <span>App ready to work offline</span>
            ) : (
              <span>New content available, click on reload button to update.</span>
            )}
          </div>
          {needRefresh && (
            <button className="ReloadPrompt-toast-button" onClick={() => updateServiceWorker(true)}>
              Reload
            </button>
          )}
          <button className="ReloadPrompt-toast-button" onClick={() => close()}>
            Close
          </button>
        </div>
      )}
      <div className="ReloadPrompt-date">{buildDate}</div>
    </div>
  );
};

export default ReloadPrompt;
