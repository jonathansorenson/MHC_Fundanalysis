import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell,
} from 'recharts';
import KPICard from './KPICard';
import PropertyCard from './PropertyCard';
import MetricBadge from './metrics/MetricBadge';
import { fmt } from '../lib/utils';

const tooltipStyle = {
  background: '#0F2236', border: '1px solid #1E3347',
  borderRadius: 8, color: '#fff', fontSize: 12, padding: '8px 12px',
};

export default function FundOverview({ fund, onSelectProperty }) {
  const properties = Object.values(fund.properties);
  const consolidated = fund.consolidated || [];

  const kpis = useMemo(() => {
    const totalNOI = consolidated.reduce((s, q) => s + q.noi, 0);
    const totalRev = consolidated.reduce((s, q) => s + q.revenue, 0);
    const totalDist = consolidated.reduce((s, q) => s + q.distribution, 0);
    const totalSF = properties.reduce((s, p) => s + (p.sf || 0), 0);

    const latestOccs = properties
      .filter(p => p.quarterly.length > 0)
      .map(p => ({ occ: p.quarterly[p.quarterly.length - 1].occupancy, sf: p.sf }));    const totalWeightedSF = latestOccs.reduce((s, x) => s + x.sf, 0);
    const avgOcc = totalWeightedSF > 0
      ? latestOccs.reduce((s, x) => s + x.occ * x.sf, 0) / totalWeightedSF
      : 0;

    return { totalNOI, totalRev, totalDist, totalSF, avgOcc, propCount: properties.length };
  }, [consolidated, properties]);

  // Area chart data: Revenue vs NOI with gradient fills
  const areaData = consolidated.map(q => ({
    quarter: q.quarter.replace('2025', "'25"),
    Revenue: q.revenue,
    NOI: q.noi,
  }));

  // Horizontal bar: NOI by property
  const propNOI = properties
    .map(p => ({
      name: p.alias || p.name,
      noi: p.quarterly.reduce((s, q) => s + q.noi, 0),
      revenue: p.quarterly.reduce((s, q) => s + q.revenue, 0),
    }))
    .filter(d => d.noi > 0)
    .sort((a, b) => b.noi - a.noi);

  return (
    <div className="space-y-6">
      {/* Fund header */}
      <div className="flex items-center justify-between">
        <div>          <h2 className="text-xl font-display text-white">{fund.fullName}</h2>
          <p className="text-mhc-muted text-sm">{fund.strategy} &middot; Vintage {fund.vintage} &middot; As of {fund.asOfDate}</p>
        </div>
        <div className="text-right text-xs text-mhc-muted">
          <span className="block">{kpis.propCount} Properties</span>
          <span className="block">{fmt.sf(kpis.totalSF)}</span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
        <KPICard label="Total NOI" value={fmt.usdM(kpis.totalNOI)} sub="2025 Full Year" />
        <KPICard label="Total Revenue" value={fmt.usdM(kpis.totalRev)} sub="2025 Full Year" />
        <KPICard label="Distributions" value={fmt.usdM(kpis.totalDist)} sub="2025 Cumulative" />
        <KPICard label="Avg Occupancy" value={fmt.pct(kpis.avgOcc)} sub="Latest Quarter" />
      </div>

      {/* Fund Metrics */}
      {fund.metrics && (
        <div className="bg-mhc-card border border-mhc-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-white text-sm font-semibold">Fund Metrics</h3>
            <MetricBadge type="placeholder" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard label="Net IRR" value={fmt.rate(fund.metrics.performance.irrNet)} sub={`Gross: ${fmt.rate(fund.metrics.performance.irrGross)}`} />
            <KPICard label="Equity Multiple" value={fmt.multiple(fund.metrics.performance.equityMultipleNet)} sub={`TVPI: ${fmt.multiple(fund.metrics.performance.tvpi)}`} />
            <KPICard label="Deployment" value={fmt.rate(fund.metrics.capital.deploymentPace)} sub={`${fmt.usdM(fund.metrics.capital.dryPowder)} dry powder`} />            <KPICard label="Leverage" value={fmt.ratio(fund.metrics.debt.leverageRatio)} sub={`LTV: ${fmt.rate(fund.metrics.debt.ltv)}`} />
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Revenue vs NOI area chart */}
        <div className="bg-mhc-card border border-mhc-border rounded-xl p-5">
          <h3 className="text-white text-sm font-semibold mb-4">Revenue vs NOI</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3347" vertical={false} />
              <XAxis dataKey="quarter" tick={{ fill: '#8A9BB0', fontSize: 11 }} axisLine={{ stroke: '#1E3347' }} tickLine={false} />
              <YAxis tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: '#8A9BB0', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt.usd(v), undefined]} />
              <Area type="monotone" dataKey="Revenue" stroke="#4CAF82" strokeWidth={2.5} fill="#4CAF82" fillOpacity={0.55} />
              <Area type="monotone" dataKey="NOI" stroke="#5B8DEF" strokeWidth={2.5} fill="#5B8DEF" fillOpacity={0.7} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-3 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-mhc-muted"><span className="w-3 h-0.5 inline-block rounded" style={{background:'#4CAF82'}} /> Revenue</span>
            <span className="flex items-center gap-1.5 text-xs text-mhc-muted"><span className="w-3 h-0.5 inline-block rounded" style={{background:'#5B8DEF'}} /> NOI</span>
          </div>
        </div>

        {/* NOI by property horizontal bar */}
        <div className="bg-mhc-card border border-mhc-border rounded-xl p-5">
          <h3 className="text-white text-sm font-semibold mb-4">NOI by Property</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={propNOI} layout="vertical" margin={{ left: 5, right: 15 }} barSize={20}>              <CartesianGrid strokeDasharray="3 3" stroke="#1E3347" horizontal={false} />
              <XAxis type="number" tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: '#8A9BB0', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#CBD5E1', fontSize: 11 }} width={80} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt.usd(v), 'NOI']} cursor={{ fill: 'rgba(0,191,165,0.06)' }} />
              <Bar dataKey="noi" radius={[0, 6, 6, 0]}>
                {propNOI.map((_, i) => (
                  <Cell key={i} fill="#5B8DEF" fillOpacity={0.7 + (i === 0 ? 0.2 : 0)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Property cards */}
      <div>
        <h3 className="text-white text-sm font-semibold mb-3">Properties</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {properties.map(p => (
            <PropertyCard key={p.id} property={p} onClick={onSelectProperty} />
          ))}
        </div>
      </div>
    </div>
  );
}