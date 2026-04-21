export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="/" className="site-logo">FIRO-B</a>
        <nav className="site-nav">
          <a href="/about.html" className="site-nav-link">검사 소개</a>
          <a href="/privacy.html" className="site-nav-link">개인정보처리방침</a>
          <a href="/terms.html" className="site-nav-link">이용약관</a>
        </nav>
      </div>
    </header>
  );
}
