import { DiscussionEmbed } from 'disqus-react';

export default function DisqusSection() {
  return (
    <div className="disqus-wrap">
      <div className="disqus-header">
        <span className="disqus-icon">💬</span>
        <div>
          <h3 className="disqus-title">커뮤니티 토론</h3>
          <p className="disqus-sub">다른 사람들의 결과와 비교하거나 느낀 점을 나눠보세요</p>
        </div>
      </div>
      <DiscussionEmbed
        shortname="firo-b"
        config={{
          url: window.location.href,
          identifier: 'firob-results-main',
          title: '관계 욕구 자가진단 결과 토론',
          language: 'ko_KR',
        }}
      />
    </div>
  );
}
