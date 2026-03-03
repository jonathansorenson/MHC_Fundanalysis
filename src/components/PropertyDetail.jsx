import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import KPICard from './KPICard';
import { fmt } from '../lib/utils';

export default function PropertyDetail({ property, onBack }) {
  if (!property) return null;

  const quarters = property.quarterly || [];
  const latest = quarters[quarters.length - 1];
  const totalNOI = quarters.reduce((s, q) => s + q.noi, 0);
  const totalRev = quarters.reduce((s, q) => s + q.revenue, 0);

  const chartData = quarters.map(q => ({
    quarter: q.quarter.replace('20', "'"),
    NOI: q.noi,
    Revenue: q.revenue,
    Expenses: q.expenses,
  }));

  const occData = quarters.map(q => ({
    quarter: q.quarter.replace('20', "'"),
    Occupancy: +(q.occupancy * 100).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-mhc-accent hover:text-mhc-accent/80 transition text-sm flex items-center gap-1"
        >
          ← Back to Fund
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display text-white">{property.name}</h2>
          <p className="text-mhc-muted text-sm">{property.address}</p>
        </div>
        <div className="text-right text-xs text-mhc-muted">
          <span className="bg-mhc-navy px-3 py-1 rounded">{property.assetClass}</span>
          {property.sf > 0 && <span className="block mt-1">{fmt.sf(property.sf)}</span>}
        </div>
      </div>

      {/* KPIs */}
      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
          <KPICard label="Current Occupancy" value={fmt.pct(latest.occupancy)} sub={latest.quarter} />
          <KPICard label="Latest NOI" value={fmt.usdK(latest.noi)} sub={latest.quarter} />
          <KPICard label="YTD NOI" value={fmt.usdM(totalNOI)} sub={`${quarters.length} quarters`} />
          <KPICard label="YTD Revenue" value={fmt.usdM(totalRev)} sub={`${quarters.length} quarters`} />
        </div>
      )}

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-mhc-card border border-mhc-border rounded-xl p-5">
            <h3 className="text-white text-sm font-semibold mb-4">Financial Performance</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3347" />
                <XAxis dataKey="quarter" tick={{ fill: '#8A9BB0', fontSize: 11 }} />
                <YAxis tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: '#8A9BB0', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#0F2236', border: '1px solid #1E3347', borderRadius: 8, color: '#fff' }}
                  formatter={(v) => [fmt.usd(v), undefined]}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: '#8A9BB0' }} />
                <Line type="monotone" dataKey="Revenue" stroke="#D4A843" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="NOI" stroke="#00BFA5" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Expenses" stroke="#C41230" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-mhc-card border border-mhc-border rounded-xl p-5">
            <h3 className="text-white text-sm font-semibold mb-4">Occupancy Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={occData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3347" />
                <XAxis dataKey="quarter" tick={{ fill: '#8A9BB0', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fill: '#8A9BB0', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#0F2236', border: '1px solid #1E3347', borderRadius: 8, color: '#fff' }}
                  formatter={(v) => [`${v}%`, 'Occupancy']}
                />
                <Line type="monotone" dataKey="Occupancy" stroke="#00BFA5" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Quarterly table */}
      {quarters.length > 0 && (
        <div className="bg-mhc-card border border-mhc-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-mhc-border">
            <h3 className="text-white text-sm font-semibold">Quarterly Detail</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-mhc-border text-mhc-muted text-xs">
                  <th className="text-left px-5 py-2.5 font-medium">Quarter</th>
                  <th className="text-right px-5 py-2.5 font-medium">Occupancy</th>
                  <th className="text-right px-5 py-2.5 font-medium">Revenue</th>
                  <th className="text-right px-5 py-2.5 font-medium">Expenses</th>
                  <th className="text-right px-5 py-2.5 font-medium">NOI</th>
                  <th className="text-right px-5 py-2.5 font-medium">Margin</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {quarters.map(q => (
                  <tr key={q.quarter} className="border-b border-mhc-border/50">
                    <td className="px-5 py-2.5 font-medium">{q.quarter}</td>
                    <td className="px-5 py-2.5 text-right">{fmt.pct(q.occupancy)}</td>
                    <td className="px-5 py-2.5 text-right">{fmt.usd(q.revenue)}</td>
                    <td className="px-5 py-2.5 text-right">{fmt.usd(q.expenses)}</td>
                    <td className="px-5 py-2.5 text-right font-semibold">{fmt.usd(q.noi)}</td>
                    <td className="px-5 py-2.5 text-right text-mhc-muted">
                      {q.revenue > 0 ? fmt.pct(q.noi / q.revenue) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
