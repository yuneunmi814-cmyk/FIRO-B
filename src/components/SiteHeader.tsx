export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-outline-variant/15 font-body">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-3.5 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-xl firo-gradient text-white flex items-center justify-center font-headline font-extrabold text-sm shadow-editorial">
            P
          </span>
          <span className="text-lg font-extrabold tracking-tight font-headline text-primary group-hover:text-secondary transition-colors">
            Project Yoon
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {[
            { href: '/about.html',   label: '검사 소개' },
            { href: '/privacy.html', label: '개인정보' },
            { href: '/terms.html',   label: '이용약관' },
          ].map(l => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="/about.html"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
          aria-label="메뉴"
        >
          <span className="material-symbols-outlined">menu</span>
        </a>
      </div>
    </header>
  );
}
