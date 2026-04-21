export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="site-footer-copy">
          © {new Date().getFullYear()} FIRO-B 심리검사. 본 서비스는 교육·참고 목적으로 제공됩니다.
        </p>
        <nav className="site-footer-nav">
          <a href="/about.html">서비스 소개</a>
          <a href="/privacy.html">개인정보처리방침</a>
          <a href="/terms.html">이용약관</a>
          <a href="mailto:yuneunmi814@gmail.com">문의하기</a>
        </nav>
        <p className="site-footer-ad-note">
          본 사이트는 Google AdSense를 통해 광고를 제공합니다.
          Google은 쿠키를 사용하여 관련성 높은 광고를 게재합니다.
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">광고 설정</a>
        </p>
      </div>
    </footer>
  );
}
