import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell,
} from 'recharts';
import KPICard from './KPICard';
import MetricBadge from './metrics/MetricBadge';
import { fund1, fund2, sidecars, getConsolidatedTotals, getConsolidatedMetrics, computeWeightedOccupancy } from '../data/fundData';
import { fmt } from '../lib/utils';

const tooltipStyle = {
  background: '#0F2236', border: '1px solid #1E3347',
  borderRadius: 8, color: '#fff', fontSize: 12, padding: '8px 12px',
};

export default function ConsolidatedView() {
  const totals = useMemo(() => getConsolidatedTotals(), []);
  const cm = useMemo(() => getConsolidatedMetrics(), []);
  const wtdOcc = useMemo(() => {
    const o1 = computeWeightedOccupancy(fund1);
    const o2 = computeWeightedOccupancy(fund2);
    const sf1 = Object.values(fund1.properties).reduce((s, p) => s + p.sf, 0);
    const sf2 = Object.values(fund2.properties).reduce((s, p) => s + p.sf, 0);
    return (sf1 + sf2) > 0 ? (o1 * sf1 + o2 * sf2) / (sf1 + sf2) : 0;
  }, []);
  const areaData = useMemo(() => {
    const map = {};
    fund1.consolidated.forEach(q => {
      map[q.quarter] = { quarter: q.quarter.replace('2025', "'25"), 'Fund I': q.noi, 'Fund II': 0 };
    });
    fund2.consolidated.forEach(q => {
      if (!map[q.quarter]) map[q.quarter] = { quarter: q.quarter.replace('2025', "'25"), 'Fund I': 0, 'Fund II': 0 };
      else map[q.quarter].quarter = q.quarter.replace('2025', "'25");
      map[q.quarter]['Fund II'] = q.noi;
    });
    return Object.values(map);
  }, []);

  const noiBar = useMemo(() => {
    const allProps = [
      ...Object.values(fund1.properties).map(p => ({ ...p, fund: 'Fund I' })),
      ...Object.values(fund2.properties).map(p => ({ ...p, fund: 'Fund II' })),
    ];
    return allProps
      .map(p => ({ name: p.alias || p.name, noi: p.quarterly.reduce((s, q) => s + q.noi, 0), fund: p.fund }))
      .filter(d => d.noi > 0)
      .sort((a, b) => b.noi - a.noi);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display text-white">Consolidated Portfolio</h2>
        <p className="text-mhc-muted text-sm">Combined Fund I + Fund II + Sidecar overview</p>
      </div>      {/* Performance Highlights */}
      <div className="bg-mhc-card border border-mhc-border rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-white text-sm font-semibold">Performance Highlights</h3>
          <MetricBadge type="placeholder" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <KPICard label="Net IRR" value={fmt.rate(cm.performance.irrNet)} sub="Wtd average" />
          <KPICard label="Equity Multiple" value={fmt.multiple(cm.performance.equityMultipleNet)} sub="Net, wtd" />
          <KPICard label="TVPI" value={fmt.multiple(cm.performance.tvpi)} sub={`DPI ${fmt.multiple(cm.performance.dpi)}`} />
          <KPICard label="Deployment" value={fmt.rate(cm.capital.deploymentPace)} sub={`${fmt.usdM(cm.capital.dryPowder)} dry powder`} />
          <KPICard label="Wtd Occupancy" value={fmt.pct(wtdOcc)} sub="Latest quarter" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 stagger">
        <KPICard label="Total NOI" value={fmt.usdM(totals.totalNOI)} sub="2025 Full Year" />
        <KPICard label="Total Revenue" value={fmt.usdM(totals.totalRevenue)} sub="2025 Full Year" />
        <KPICard label="Distributions" value={fmt.usdM(totals.totalDistributions)} sub="2025 Cumulative" />
        <KPICard label="Total SF" value={fmt.sf(totals.totalSF)} sub={`${totals.propertyCount} properties`} />
        <KPICard label="Fund I NOI" value={fmt.usdM(totals.fund1NOI)} sub={`Fund II: ${fmt.usdM(totals.fund2NOI)}`} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-mhc-card border border-mhc-border rounded-xl p-5">
          <h3 className="text-white text-sm font-semibold mb-4">Quarterly NOI by Fund</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3347" vertical={false} />
              <XAxis dataKey="quarter" tick={{ fill: '#8A9BB0', fontSize: 11 }} axisLine={{ stroke: '#1E3347' }} tickLine={false} />
              <YAxis tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: '#8A9BB0', fontSize: 11 }} axisLine={false} tickLine={false} />              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt.usd(v), undefined]} />
              <Area type="monotone" dataKey="Fund I" stackId="1" stroke="#5B8DEF" strokeWidth={2.5} fill="#5B8DEF" fillOpacity={0.7} />
              <Area type="monotone" dataKey="Fund II" stackId="1" stroke="#4CAF82" strokeWidth={2.5} fill="#4CAF82" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-3 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-mhc-muted"><span className="w-3 h-0.5 inline-block rounded" style={{background:'#5B8DEF'}} /> Fund I</span>
            <span className="flex items-center gap-1.5 text-xs text-mhc-muted"><span className="w-3 h-0.5 inline-block rounded" style={{background:'#4CAF82'}} /> Fund II</span>
          </div>
        </div>
        <div className="bg-mhc-card border border-mhc-border rounded-xl p-5">
          <h3 className="text-white text-sm font-semibold mb-4">NOI by Property (2025)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={noiBar} layout="vertical" margin={{ left: 5, right: 15 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3347" horizontal={false} />
              <XAxis type="number" tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: '#8A9BB0', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#CBD5E1', fontSize: 11 }} width={95} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt.usd(v), 'NOI']} cursor={{ fill: 'rgba(0,191,165,0.06)' }} />
              <Bar dataKey="noi" radius={[0, 6, 6, 0]}>
                {noiBar.map((d, i) => (<Cell key={i} fill={d.fund === 'Fund I' ? '#5B8DEF' : '#4CAF82'} />))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-3 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-mhc-muted"><span className="w-2 h-2 rounded-full inline-block" style={{background:'#5B8DEF'}} /> Fund I</span>
            <span className="flex items-center gap-1.5 text-xs text-mhc-muted"><span className="w-2 h-2 rounded-full inline-block" style={{background:'#4CAF82'}} /> Fund II</span>
          </div>
        </div>
      </div>      <div className="bg-mhc-card border border-mhc-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-mhc-border">
          <h3 className="text-white text-sm font-semibold">Fund Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mhc-border text-mhc-muted text-xs">
                <th className="text-left px-5 py-2.5 font-medium">Metric</th>
                <th className="text-right px-5 py-2.5 font-medium">Fund I</th>
                <th className="text-right px-5 py-2.5 font-medium">Fund II</th>
                <th className="text-right px-5 py-2.5 font-medium">Combined</th>
              </tr>
            </thead>
            <tbody className="text-white">
              <tr className="border-b border-mhc-border/50">
                <td className="px-5 py-2.5 text-mhc-muted">Total NOI</td>
                <td className="px-5 py-2.5 text-right">{fmt.usdM(totals.fund1NOI)}</td>
                <td className="px-5 py-2.5 text-right">{fmt.usdM(totals.fund2NOI)}</td>
                <td className="px-5 py-2.5 text-right font-semibold">{fmt.usdM(totals.totalNOI)}</td>
              </tr>
              <tr className="border-b border-mhc-border/50">
                <td className="px-5 py-2.5 text-mhc-muted">Total Revenue</td>
                <td className="px-5 py-2.5 text-right">{fmt.usdM(totals.fund1Revenue)}</td>
                <td className="px-5 py-2.5 text-right">{fmt.usdM(totals.fund2Revenue)}</td>
                <td className="px-5 py-2.5 text-right font-semibold">{fmt.usdM(totals.totalRevenue)}</td>
              </tr>
              <tr className="border-b border-mhc-border/50">
                <td className="px-5 py-2.5 text-mhc-muted">Properties</td>
                <td className="px-5 py-2.5 text-right">{Object.keys(fund1.properties).length}</td>
                <td className="px-5 py-2.5 text-right">{Object.keys(fund2.properties).length}</td>
                <td className="px-5 py-2.5 text-right font-semibold">{totals.propertyCount}</td>              </tr>
              <tr>
                <td className="px-5 py-2.5 text-mhc-muted">Vintage</td>
                <td className="px-5 py-2.5 text-right">{fund1.vintage}</td>
                <td className="px-5 py-2.5 text-right">{fund2.vintage}</td>
                <td className="px-5 py-2.5 text-right text-mhc-muted">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}