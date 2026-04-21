import { useEffect, useRef, useState } from 'react';

const BASE_URL = 'https://firob.vercel.app/';

const isDev =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

interface Props {
  pageUrl?: string;
  pageIdentifier?: string;
  title?: string;
  subtitle?: string;
}

export default function DisqusSection({
  pageUrl = BASE_URL,
  pageIdentifier = 'firob-results-main',
  title = '커뮤니티 토론',
  subtitle = '다른 사람들의 결과와 비교하거나 느낀 점을 나눠보세요',
}: Props) {
  const loaded = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isDev || loaded.current) return;
    loaded.current = true;

    // 이미 로드된 경우 DISQUS.reset()으로 재초기화
    const disqus = (window as unknown as { DISQUS?: { reset: (o: unknown) => void } }).DISQUS;
    if (disqus) {
      disqus.reset({
        reload: true,
        config: function (this: { page: { url: string; identifier: string } }) {
          this.page.url        = pageUrl;
          this.page.identifier = pageIdentifier;
        },
      });
      setReady(true);
      return;
    }

    // 최초 로드
    (window as unknown as Record<string, unknown>).disqus_config = function (
      this: { page: { url: string; identifier: string } }
    ) {
      this.page.url        = pageUrl;
      this.page.identifier = pageIdentifier;
    };

    const d = document;
    const s = d.createElement('script');
    s.src = 'https://firo-b-simrigeomsa.disqus.com/embed.js';
    s.setAttribute('data-timestamp', String(+new Date()));
    s.onload = () => setReady(true);
    (d.head || d.body).appendChild(s);
  }, []);

  return (
    <div className="disqus-wrap">
      <div className="disqus-header">
        <span className="disqus-icon">💬</span>
        <div>
          <h3 className="disqus-title">{title}</h3>
          <p className="disqus-sub">{subtitle}</p>
        </div>
      </div>

      {isDev ? (
        <div className="disqus-dev-placeholder">
          <p className="disqus-dev-title">🛠️ 개발 환경 안내</p>
          <p>Disqus는 배포된 도메인에서만 작동합니다. 배포 후 자동 활성화됩니다.</p>
          <p style={{ marginTop: 8, fontSize: 13, color: '#92400E' }}>
            shortname: <code>firo-b-simrigeomsa</code>
          </p>
        </div>
      ) : (
        <>
          {!ready && <div className="disqus-loading">댓글을 불러오는 중…</div>}
          <div id="disqus_thread" />
          <noscript>
            댓글을 보려면 JavaScript를 활성화해 주세요.{' '}
            <a href="https://disqus.com/?ref_noscript">Disqus 댓글 보기</a>
          </noscript>
        </>
      )}
    </div>
  );
}
