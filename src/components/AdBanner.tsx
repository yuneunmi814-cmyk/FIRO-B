import { useEffect, useRef } from 'react';

// ※ 실제 게시자 ID와 슬롯 ID로 교체하세요
const PUB_ID = 'ca-pub-XXXXXXXXXXXXXXXX';

interface Props {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  label?: string;
}

declare global {
  interface Window { adsbygoogle: unknown[] }
}

export default function AdBanner({ slot, format = 'auto', label = '광고' }: Props) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script not loaded yet (dev environment)
    }
  }, []);

  return (
    <div className="ad-wrap">
      <p className="ad-label">{label}</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
