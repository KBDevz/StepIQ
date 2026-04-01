import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ResponsiveContainer,
  Label,
} from 'recharts';
import type { LevelResult } from '../../types';
import { linReg } from '../../utils/scoring';

interface RegressionChartProps {
  data: LevelResult[];
  maxHR: number;
  vo2Max: number;
}

export default function RegressionChart({ data, maxHR, vo2Max }: RegressionChartProps) {
  if (data.length === 0) return null;

  // Build actual data points
  const actualPoints = data.map((d) => ({
    hr: d.hr,
    vo2: d.vo2Estimate,
    label: `L${d.level}`,
  }));

  // Build regression line
  const pts = data.map((d) => ({ x: d.hr, y: d.vo2Estimate }));
  const reg = data.length >= 2 ? linReg(pts) : null;

  // Chart data: actual points + extrapolated line
  const minHR = Math.min(...data.map((d) => d.hr)) - 10;
  const chartMin = Math.max(40, minHR);

  let lineData: { hr: number; actual?: number; predicted?: number }[] = [];

  if (reg) {
    // Create smooth line from min data HR to max HR
    const steps = 50;
    const hrRange = maxHR - chartMin;
    for (let i = 0; i <= steps; i++) {
      const hr = chartMin + (hrRange * i) / steps;
      const vo2 = reg.slope * hr + reg.intercept;
      const lastDataHR = Math.max(...data.map((d) => d.hr));

      if (hr <= lastDataHR) {
        lineData.push({ hr: Math.round(hr), actual: Math.round(vo2 * 10) / 10 });
      } else {
        lineData.push({ hr: Math.round(hr), predicted: Math.round(vo2 * 10) / 10 });
      }
    }
  }

  // Merge actual data points for the scatter effect
  const scatterData = actualPoints.map((p) => ({
    hr: p.hr,
    dot: p.vo2,
    label: p.label,
  }));

  return (
    <div className="w-full bg-[#0D1829]/80 backdrop-blur-md border border-[#1C2F4A] rounded-2xl p-4">
      <p className="font-mono text-xs text-[#5A7090] uppercase tracking-wider mb-3">
        HR vs VO2 Regression
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid stroke="#1C2F4A" strokeDasharray="3 3" />
          <XAxis
            dataKey="hr"
            type="number"
            domain={[chartMin, maxHR + 5]}
            tick={{ fill: '#5A7090', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
            stroke="#1C2F4A"
          >
            <Label
              value="Heart Rate (bpm)"
              position="bottom"
              offset={0}
              style={{ fill: '#5A7090', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            />
          </XAxis>
          <YAxis
            tick={{ fill: '#5A7090', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
            stroke="#1C2F4A"
          >
            <Label
              value="VO2 ml/kg/min"
              angle={-90}
              position="insideLeft"
              offset={10}
              style={{ fill: '#5A7090', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            />
          </YAxis>
          <Tooltip
            contentStyle={{
              background: '#0D1829',
              border: '1px solid #1C2F4A',
              borderRadius: '8px',
              fontFamily: 'IBM Plex Mono',
              fontSize: 11,
            }}
            labelStyle={{ color: '#5A7090' }}
          />

          {/* Actual regression line (solid) */}
          {reg && (
            <Line
              data={lineData.filter((d) => d.actual !== undefined)}
              dataKey="actual"
              xAxisId={0}
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          )}

          {/* Predicted line (dashed) */}
          {reg && (
            <Line
              data={lineData.filter((d) => d.predicted !== undefined)}
              dataKey="predicted"
              xAxisId={0}
              stroke="#00E5A0"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              isAnimationActive={false}
            />
          )}

          {/* Data points */}
          <Line
            data={scatterData}
            dataKey="dot"
            xAxisId={0}
            stroke="transparent"
            dot={{ fill: '#3B82F6', r: 5, stroke: '#0D1829', strokeWidth: 2 }}
            isAnimationActive={false}
          />

          {/* VO2 max intersection point */}
          {reg && (
            <ReferenceDot
              x={maxHR}
              y={Math.round(vo2Max * 10) / 10}
              r={6}
              fill="#00E5A0"
              stroke="#0D1829"
              strokeWidth={2}
              xAxisId={0}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
