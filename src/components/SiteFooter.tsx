export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary text-primary-fixed-dim font-body mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-xl bg-secondary text-white flex items-center justify-center font-headline font-extrabold text-sm">P</span>
            <span className="text-xl font-extrabold tracking-tight font-headline text-white">Project Yoon</span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">
            FIRO-B 기반 대인관계 심층 진단 소프트웨어. 자기이해와 관계 개선을 위한
            연구 기반 디지털 리포트를 제공합니다.
          </p>
          <p className="text-xs mt-5 opacity-70 leading-relaxed">
            본 서비스는 개인 성장 및 자기이해 목적의 자기보고식 심리 진단 소프트웨어입니다.
            임상 진단·의료 상담을 대체하지 않습니다.
          </p>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim mb-4 font-headline">Navigate</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: '/about.html',   label: '서비스 소개' },
              { href: '/privacy.html', label: '개인정보처리방침' },
              { href: '/terms.html',   label: '이용약관' },
            ].map(l => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-white transition-colors">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim mb-4 font-headline">Contact</h4>
          <a
            href="mailto:yuneunmi814@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-sm text-white font-medium"
          >
            <span className="material-symbols-outlined text-base">mail</span>
            <span>문의하기</span>
          </a>
          <p className="text-xs mt-5 opacity-70 leading-relaxed">
            Google AdSense 쿠키로 관련성 높은 광고를 제공합니다.{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener"
              className="underline decoration-secondary-fixed-dim/60 underline-offset-2 hover:text-white"
            >
              광고 설정
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs opacity-75">
          <p>© {year} Project Yoon · FIRO-B Insights</p>
          <p className="font-mono">Built on Cloudflare Pages</p>
        </div>
      </div>
    </footer>
  );
}
