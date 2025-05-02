import { createRoot, Root } from 'react-dom/client';
import { ReactNode } from 'react';

let root: Root | null = null;
let container: HTMLDivElement | null = null;

export const getOrCreateFrameRoot = (): Root => {
  if (!container) {
    container = document.createElement('div');
    container.id = 'ui-coverage-agent-root';
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.zIndex = '9999';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);
  }

  if (!root && container) {
    root = createRoot(container);
  }

  return root!;
};

export const destroyFrameRoot = () => {
  if (root) {
    root.unmount(); // корректно удаляем компонент из React DOM
    root = null;
  }

  if (container) {
    container.remove();
    container = null;
  }
};

const patchHistoryMethod = (method: 'pushState' | 'replaceState', callback: () => void) => {
  const original = history[method];
  history[method] = function (...args) {
    const result = original.apply(this, args);
    callback();
    return result;
  };
};

export const watchFrameRoot = (getFrame: () => ReactNode) => {
  let currentUrl = location.href;

  const initFrame = () => {
    const root = getOrCreateFrameRoot();
    root.render(getFrame());
  };

  const onUrlChange = () => {
    const newUrl = location.href;
    if (newUrl !== currentUrl) {
      currentUrl = newUrl;
      destroyFrameRoot();
      initFrame();
    }
  };

  patchHistoryMethod('pushState', onUrlChange);
  patchHistoryMethod('replaceState', onUrlChange);

  window.addEventListener('popstate', onUrlChange);

  const observer = new MutationObserver(onUrlChange);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });

  initFrame();
};
