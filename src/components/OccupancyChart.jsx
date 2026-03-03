import { useMemo } from 'react';
import { fund1, fund2, sidecars, occupancy, occupancySummary } from '../data/fundData';
import { fmt } from '../lib/utils';

/* ── colour stops for occupancy % ── */
function occColor(v) {
  if (v === null || v === undefined) return '#1E3347';   // no data
  if (v >= 0.95) return '#2D8B6F';  // deep sage
  if (v >= 0.90) return '#4CAF82';  // sage
  if (v >= 0.85) return '#5B8DEF';  // blue
  if (v >= 0.80) return '#9B7FD4';  // plum
  if (v >= 0.70) return '#E8A838';  // amber
  return '#E06B6B';                  // coral / concern
}

function occTextColor(v) {
  if (v === null || v === undefined) return '#4A5568';
  return '#fff';
}

export default function OccupancyChart() {
  /* Build heatmap rows from property quarterly data */
  const heatData = useMemo(() => {
    const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];
    const rows = [];
    const addFund = (fund, fundLabel) => {
      Object.values(fund.properties).forEach(p => {
        if (p.quarterly.length === 0) return;
        const qMap = {};
        p.quarterly.forEach(q => { qMap[q.quarter] = q.occupancy; });
        rows.push({
          property: p.alias || p.name,
          fund: fundLabel,
          sf: p.sf,
          quarters: quarters.map(qk => qMap[qk] ?? null),
        });
      });
    };
    addFund(fund1, 'Fund I');
    addFund(fund2, 'Fund II');
    // Sidecars
    Object.values(sidecars.properties).forEach(p => {
      if (p.quarterly.length === 0) return;
      const qMap = {};
      p.quarterly.forEach(q => { qMap[q.quarter] = q.occupancy; });
      rows.push({
        property: p.alias || p.name,
        fund: 'Sidecar',
        sf: p.sf,
        quarters: quarters.map(qk => qMap[qk] ?? null),
      });
    });
    return { quarters, rows };
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display text-white">Occupancy Comparison</h2>
        <p className="text-mhc-muted text-sm">Year-end 2024 vs Year-end 2025 across all properties</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 stagger">
        {occupancySummary.map(s => (
          <div key={s.label} className="bg-mhc-card border border-mhc-border rounded-xl p-5">
            <span className="text-mhc-muted text-xs font-medium uppercase tracking-wider block mb-1">{s.label}</span>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-white">{fmt.pct(s.occ2025)}</span>
              <span className={`text-sm ${s.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {fmt.pctDelta(s.change)} YoY
              </span>
            </div>
            <span className="text-mhc-muted text-xs">{fmt.sf(s.sf)}</span>
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="bg-mhc-card border border-mhc-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-sm font-semibold">Quarterly Occupancy Heatmap</h3>
          <div className="flex items-center gap-2 text-[10px] text-mhc-muted">            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{background:'#E06B6B'}} />&lt;70%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{background:'#E8A838'}} />70-80%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{background:'#9B7FD4'}} />80-85%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{background:'#5B8DEF'}} />85-90%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{background:'#4CAF82'}} />90-95%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{background:'#2D8B6F'}} />&gt;95%</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-mhc-muted text-xs">
                <th className="text-left py-2 px-3 font-medium w-40">Property</th>
                <th className="text-left py-2 px-2 font-medium w-16">Fund</th>
                {heatData.quarters.map(q => (
                  <th key={q} className="text-center py-2 px-2 font-medium">{q.replace(' 2025', '')}</th>
                ))}
                <th className="text-center py-2 px-2 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {heatData.rows.map((row, ri) => {
                const first = row.quarters.find(v => v !== null);
                const last = [...row.quarters].reverse().find(v => v !== null);
                const trend = (first !== null && last !== null && first !== undefined && last !== undefined)
                  ? last - first : null;
                return (
                  <tr key={ri} className="border-t border-mhc-border/30 hover:bg-mhc-navy/30">                    <td className="py-2 px-3 text-white text-xs font-medium">{row.property}</td>
                    <td className="py-2 px-2 text-mhc-muted text-[10px]">{row.fund}</td>
                    {row.quarters.map((v, qi) => (
                      <td key={qi} className="py-1.5 px-1.5 text-center">
                        <div
                          className="rounded-md py-1.5 px-2 text-xs font-semibold transition-all"
                          style={{ background: occColor(v), color: occTextColor(v) }}
                        >
                          {v !== null ? `${(v * 100).toFixed(1)}%` : '—'}
                        </div>
                      </td>
                    ))}
                    <td className="py-2 px-2 text-center text-xs font-medium">
                      {trend !== null ? (
                        <span className={trend >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                          {trend >= 0 ? '+' : ''}{(trend * 100).toFixed(1)}%
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* YoY detail table */}
      <div className="bg-mhc-card border border-mhc-border rounded-xl overflow-hidden">        <div className="px-5 py-3 border-b border-mhc-border">
          <h3 className="text-white text-sm font-semibold">Year-over-Year Detail</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mhc-border text-mhc-muted text-xs">
                <th className="text-left px-5 py-2.5 font-medium">Property</th>
                <th className="text-left px-5 py-2.5 font-medium">Fund</th>
                <th className="text-right px-5 py-2.5 font-medium">SF</th>
                <th className="text-right px-5 py-2.5 font-medium">2024</th>
                <th className="text-right px-5 py-2.5 font-medium">2025</th>
                <th className="text-right px-5 py-2.5 font-medium">Change</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {occupancy.map(d => (
                <tr key={d.property} className="border-b border-mhc-border/50 hover:bg-mhc-navy/40">
                  <td className="px-5 py-2.5">{d.property}</td>
                  <td className="px-5 py-2.5 text-mhc-muted">{d.fund}</td>
                  <td className="px-5 py-2.5 text-right">{fmt.sf(d.sf)}</td>
                  <td className="px-5 py-2.5 text-right">{d.occ2024 ? fmt.pct(d.occ2024) : '—'}</td>
                  <td className="px-5 py-2.5 text-right">{d.occ2025 ? fmt.pct(d.occ2025) : '—'}</td>
                  <td className={`px-5 py-2.5 text-right ${d.change > 0 ? 'text-emerald-400' : d.change < 0 ? 'text-red-400' : 'text-mhc-muted'}`}>
                    {d.change !== null ? fmt.pctDelta(d.change) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}