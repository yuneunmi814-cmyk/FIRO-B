import { useEffect, useRef, useState } from 'react';

// ※ disqus.com에 등록한 shortname으로 교체하세요
const SHORTNAME = 'firo-b';
// ※ 배포된 실제 도메인으로 교체하세요
const PROD_URL  = 'https://firob.vercel.app/';

const isDev = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export default function DisqusSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded       = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isDev || loaded.current) return;
    loaded.current = true;

    // disqus 전역 설정
    (window as unknown as Record<string, unknown>).disqus_config = function (this: Record<string, string>) {
      this.page_url        = PROD_URL;
      this.page_identifier = 'firob-results-main';
    };

    const existing = document.getElementById('dsq-embed-scr');
    if (existing) {
      // 이미 로드된 경우 리셋
      const reset = (window as unknown as { DISQUS?: { reset: (opts: unknown) => void } }).DISQUS;
      if (reset) {
        reset.reset({
          reload: true,
          config: function (this: Record<string, string>) {
            this.page_url        = PROD_URL;
            this.page_identifier = 'firob-results-main';
          },
        });
      }
      setReady(true);
      return;
    }

    const script  = document.createElement('script');
    script.id     = 'dsq-embed-scr';
    script.src    = `https://${SHORTNAME}.disqus.com/embed.js`;
    script.async  = true;
    script.setAttribute('data-timestamp', String(Date.now()));
    script.onload = () => setReady(true);
    document.body.appendChild(script);
  }, []);

  if (isDev) {
    return (
      <div className="disqus-wrap">
        <div className="disqus-header">
          <span className="disqus-icon">💬</span>
          <div>
            <h3 className="disqus-title">커뮤니티 토론</h3>
            <p className="disqus-sub">다른 사람들의 결과와 비교하거나 느낀 점을 나눠보세요</p>
          </div>
        </div>
        <div className="disqus-dev-placeholder">
          <p className="disqus-dev-title">🛠️ 개발 환경 안내</p>
          <p>Disqus는 <strong>배포된 도메인</strong>에서만 작동합니다. 아래 단계를 완료하면 활성화됩니다.</p>
          <ol className="disqus-steps">
            <li><a href="https://disqus.com/admin/create/" target="_blank" rel="noopener">disqus.com/admin/create</a> → 새 사이트 생성</li>
            <li>Website Name: <code>FIRO-B 심리검사</code> / Shortname: <code>{SHORTNAME}</code></li>
            <li>Category: <strong>Education</strong> 선택</li>
            <li>사이트 등록 후 <code>DisqusSection.tsx</code>의 <code>SHORTNAME</code>을 확인</li>
            <li>배포 후 자동 활성화</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="disqus-wrap">
      <div className="disqus-header">
        <span className="disqus-icon">💬</span>
        <div>
          <h3 className="disqus-title">커뮤니티 토론</h3>
          <p className="disqus-sub">다른 사람들의 결과와 비교하거나 느낀 점을 나눠보세요</p>
        </div>
      </div>
      {!ready && (
        <div className="disqus-loading">댓글을 불러오는 중…</div>
      )}
      <div id="disqus_thread" ref={containerRef} />
    </div>
  );
}
