import { yoyGrowth } from '../data/fundData';
import { fmt } from '../lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine,
} from 'recharts';

function DeltaCell({ value }) {
  if (value === null || value === undefined) return <span className="text-mhc-muted">—</span>;
  const color = value >= 0 ? 'text-emerald-400' : 'text-red-400';
  return <span className={color}>{fmt.pctDelta(value)}</span>;
}

function GrowthTable({ title, data }) {
  return (
    <div className="bg-mhc-card border border-mhc-border rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-mhc-border">
        <h3 className="text-white text-sm font-semibold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-mhc-border text-mhc-muted text-xs">
              <th className="text-left px-4 py-2.5 font-medium">Asset</th>
              <th className="text-right px-3 py-2.5 font-medium">NOI '24</th>
              <th className="text-right px-3 py-2.5 font-medium">NOI '25</th>
              <th className="text-right px-3 py-2.5 font-medium">Δ NOI</th>
              <th className="text-right px-3 py-2.5 font-medium">Budget NOI</th>
              <th className="text-right px-3 py-2.5 font-medium">vs Budget</th>
              <th className="text-right px-3 py-2.5 font-medium">Rev '24</th>
              <th className="text-right px-3 py-2.5 font-medium">Rev '25</th>
              <th className="text-right px-3 py-2.5 font-medium">Δ Rev</th>
              <th className="text-right px-3 py-2.5 font-medium">vs Budget</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {data.map(row => (
              <tr key={row.asset} className="border-b border-mhc-border/50 hover:bg-mhc-navy/40">
                <td className="px-4 py-2.5 font-medium">{row.asset}</td>
                <td className="px-3 py-2.5 text-right">{fmt.usdK(row.noi2024)}</td>
                <td className="px-3 py-2.5 text-right">{fmt.usdK(row.noi2025)}</td>
                <td className="px-3 py-2.5 text-right"><DeltaCell value={row.noiChange} /></td>
                <td className="px-3 py-2.5 text-right text-mhc-muted">{fmt.usdK(row.budgetNOI)}</td>
                <td className="px-3 py-2.5 text-right"><DeltaCell value={row.noiVsBudget} /></td>
                <td className="px-3 py-2.5 text-right">{fmt.usdK(row.rev2024)}</td>
                <td className="px-3 py-2.5 text-right">{fmt.usdK(row.rev2025)}</td>
                <td className="px-3 py-2.5 text-right"><DeltaCell value={row.revChange} /></td>
                <td className="px-3 py-2.5 text-right"><DeltaCell value={row.revVsBudget} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function YOYGrowthTable() {
  // Combine for chart
  const allAssets = [...yoyGrowth.fund1, ...yoyGrowth.fund2].filter(d => d.noi2024 > 0 || d.noi2025 > 0);
  const chartData = allAssets.map(d => ({
    asset: d.asset.length > 14 ? d.asset.slice(0, 12) + '…' : d.asset,
    '2024 NOI': d.noi2024,
    '2025 NOI': d.noi2025,
    'Budget NOI': d.budgetNOI,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display text-white">Year-over-Year Growth</h2>
        <p className="text-mhc-muted text-sm">NOI and Revenue comparison — 2024 vs 2025 with budget variance</p>
      </div>

      {/* Chart */}
      <div className="bg-mhc-card border border-mhc-border rounded-xl p-5">
        <h3 className="text-white text-sm font-semibold mb-4">NOI: 2024 vs 2025 vs Budget</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E3347" />
            <XAxis dataKey="asset" tick={{ fill: '#8A9BB0', fontSize: 11 }} />
            <YAxis tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: '#8A9BB0', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#0F2236', border: '1px solid #1E3347', borderRadius: 8, color: '#fff' }}
              formatter={(v) => [fmt.usd(v), undefined]}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: '#8A9BB0' }} />
            <Bar dataKey="2024 NOI" fill="#D4A843" radius={[3, 3, 0, 0]} />
            <Bar dataKey="2025 NOI" fill="#00BFA5" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Budget NOI" fill="#6366f1" radius={[3, 3, 0, 0]} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tables */}
      <GrowthTable title="Fund I — Year-over-Year" data={yoyGrowth.fund1} />
      <GrowthTable title="Fund II — Year-over-Year" data={yoyGrowth.fund2} />
    </div>
  );
}
