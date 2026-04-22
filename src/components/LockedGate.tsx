import type { ReactNode } from 'react';

interface Props {
  locked: boolean;
  children: ReactNode;
  onUnlock?: () => void;
  hint?: string;
}

export default function LockedGate({ locked, children, onUnlock, hint }: Props) {
  if (!locked) return <>{children}</>;

  return (
    <div className="locked-gate no-capture">
      <div className="locked-gate-inner" aria-hidden="true">
        {children}
      </div>
      <div className="locked-gate-overlay">
        <span className="locked-gate-lock" aria-hidden>🔒</span>
        <p className="locked-gate-hint">
          {hint ?? '전체 리포트 결제 후 열람할 수 있어요'}
        </p>
        {onUnlock && (
          <button
            type="button"
            className="locked-gate-cta"
            onClick={onUnlock}
          >
            잠금 해제하기 →
          </button>
        )}
      </div>
    </div>
  );
}
