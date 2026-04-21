import type { FIROBScores } from '../types';

interface Props {
  scores: FIROBScores;
  size?: number;
}

const AXES = [
  { key: 'eI' as keyof FIROBScores, label: '포용\n표현', angle: -90 },
  { key: 'eC' as keyof FIROBScores, label: '통제\n표현', angle: -30 },
  { key: 'eA' as keyof FIROBScores, label: '애정\n표현', angle: 30 },
  { key: 'wA' as keyof FIROBScores, label: '애정\n수용', angle: 90 },
  { key: 'wC' as keyof FIROBScores, label: '통제\n수용', angle: 150 },
  { key: 'wI' as keyof FIROBScores, label: '포용\n수용', angle: 210 },
];

const toRad = (deg: number) => (deg * Math.PI) / 180;

export default function RadarChart({ scores, size = 300 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.33;
  const labelR = size * 0.44;

  const pt = (angle: number, score: number) => ({
    x: cx + (score / 9) * R * Math.cos(toRad(angle)),
    y: cy + (score / 9) * R * Math.sin(toRad(angle)),
  });

  const gridPt = (angle: number, level: number) => ({
    x: cx + (level / 9) * R * Math.cos(toRad(angle)),
    y: cy + (level / 9) * R * Math.sin(toRad(angle)),
  });

  const dataPoints = AXES.map(a => pt(a.angle, scores[a.key]));
  const polygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  const gridLevels = [3, 6, 9];
  const grids = gridLevels.map(lvl =>
    AXES.map(a => gridPt(a.angle, lvl)).map(p => `${p.x},${p.y}`).join(' ')
  );

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ overflow: 'visible' }}>
      {/* Grid polygons */}
      {grids.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="#E0D8FF" strokeWidth={i === 2 ? 1.5 : 1} />
      ))}

      {/* Axes */}
      {AXES.map(a => {
        const end = gridPt(a.angle, 9);
        return <line key={a.key} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#D0C8FF" strokeWidth="1" />;
      })}

      {/* Data polygon */}
      <polygon points={polygon} fill="rgba(124, 111, 255, 0.25)" stroke="#7C6FFF" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill="#7C6FFF" stroke="white" strokeWidth="2" />
      ))}

      {/* Labels */}
      {AXES.map(a => {
        const lx = cx + labelR * Math.cos(toRad(a.angle));
        const ly = cy + labelR * Math.sin(toRad(a.angle));
        const lines = a.label.split('\n');
        return (
          <text key={a.key} textAnchor="middle" fontSize="12" fill="#555" fontWeight="600">
            {lines.map((line, i) => (
              <tspan key={i} x={lx} y={ly + (i - (lines.length - 1) / 2) * 15}>
                {line}
              </tspan>
            ))}
          </text>
        );
      })}

      {/* Score values */}
      {dataPoints.map((p, i) => {
        const score = scores[AXES[i].key];
        return (
          <text key={`val-${i}`} x={p.x} y={p.y - 9} textAnchor="middle" fontSize="10" fill="#7C6FFF" fontWeight="700">
            {score.toFixed(1)}
          </text>
        );
      })}
    </svg>
  );
}
