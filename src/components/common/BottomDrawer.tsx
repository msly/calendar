import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode
} from 'react';
import { Link, useInRouterContext } from 'react-router-dom';

type BottomDrawerProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
  previewContent?: ReactNode;
  detailHref?: string;
};

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) {
    return [];
  }

  const selector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (element) =>
      !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true'
  );
}

export function BottomDrawer({
  isOpen,
  title,
  onClose,
  children,
  previewContent,
  detailHref
}: BottomDrawerProps) {
  const titleId = useId();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const isInRouterContext = useInRouterContext();
  const shouldShowDetailCta = Boolean(detailHref);
  const renderedChildren = shouldShowDetailCta ? previewContent ?? children : children;

  useEffect(() => {
    if (!isOpen) {
      const previousFocus = previousFocusRef.current;
      if (previousFocus && document.contains(previousFocus)) {
        previousFocus.focus();
      }
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
  }, [isOpen]);

  const onDrawerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusable = getFocusableElements(drawerRef.current);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeElement = document.activeElement;
    const isActiveInside =
      activeElement instanceof HTMLElement && drawerRef.current?.contains(activeElement);

    if (event.shiftKey) {
      if (activeElement === first || !isActiveInside) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (activeElement === last || !isActiveInside) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="bottom-drawer-backdrop" onClick={onClose}>
      <div
        ref={drawerRef}
        className="bottom-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onDrawerKeyDown}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="bottom-drawer-header">
          <h2 id={titleId}>{`${title}说明`}</h2>
          <button ref={closeButtonRef} type="button" aria-label="关闭说明" onClick={onClose}>
            关闭
          </button>
        </header>
        <div>{renderedChildren}</div>
        {shouldShowDetailCta && detailHref ? (
          <p>
            {isInRouterContext ? (
              <Link to={detailHref} onClick={onClose}>
                查看详细说明
              </Link>
            ) : (
              <a href={detailHref} onClick={onClose}>
                查看详细说明
              </a>
            )}
          </p>
        ) : null}
      </div>
    </div>
  );
}
