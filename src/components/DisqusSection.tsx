import { useEffect, useRef, useState } from 'react';

const BASE_URL = 'https://projectyoon.com/';

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
    <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/15 shadow-editorial p-7 md:p-8 font-body">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-secondary-fixed-variant text-2xl">forum</span>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary font-headline">Community</span>
          <h3 className="text-xl md:text-2xl font-extrabold font-headline text-primary tracking-tight">{title}</h3>
          <p className="text-sm text-on-surface-variant mt-1">{subtitle}</p>
        </div>
      </div>

      {isDev ? (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 text-[13px] text-amber-900 leading-relaxed">
          <p className="font-bold mb-1 font-headline">🛠️ 개발 환경 안내</p>
          <p>Disqus는 배포된 도메인에서만 작동합니다. 배포 후 자동 활성화됩니다.</p>
          <p className="mt-1 text-xs">shortname: <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">firo-b-simrigeomsa</code></p>
        </div>
      ) : (
        <>
          {!ready && <div className="text-center text-sm text-on-surface-variant py-8">댓글을 불러오는 중…</div>}
          <div id="disqus_thread" />
          <noscript>
            댓글을 보려면 JavaScript를 활성화해 주세요.{' '}
            <a href="https://disqus.com/?ref_noscript" className="text-secondary underline">Disqus 댓글 보기</a>
          </noscript>
        </>
      )}
    </div>
  );
}
