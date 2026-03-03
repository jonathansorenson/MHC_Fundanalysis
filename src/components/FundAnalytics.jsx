import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell, PieChart, Pie,
} from 'recharts';
import KPICard from './KPICard';
import MetricBadge from './metrics/MetricBadge';
import { fund1, fund2, getConsolidatedMetrics, computeWeightedOccupancy } from '../data/fundData';
import { fmt } from '../lib/utils';

const TT = { background: '#0F2236', border: '1px solid #1E3347', borderRadius: 8, color: '#fff', fontSize: 12, padding: '8px 12px' };
const BLUE  = '#5B8DEF';
const SAGE  = '#4CAF82';
const AMBER = '#E8A838';
const PLUM  = '#9B7FD4';
const CORAL = '#E06B6B';
const PIE_COLORS = [BLUE, SAGE, AMBER, PLUM, CORAL];

function SectionHeader({ title, badge }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h3 className="text-white text-sm font-semibold">{title}</h3>
      {badge && <MetricBadge type={badge} />}
    </div>
  );
}

function Section({ title, badge, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-mhc-card border border-mhc-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-mhc-navy/30 transition">        <div className="flex items-center gap-3">
          <h3 className="text-white text-sm font-semibold">{title}</h3>
          {badge && <MetricBadge type={badge} />}
        </div>
        <span className={`text-mhc-muted text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && <div className="px-5 pb-5 border-t border-mhc-border/50 pt-4">{children}</div>}
    </div>
  );
}

export default function FundAnalytics() {
  const [view, setView] = useState('combined');

  const activeFund = view === 'fund1' ? fund1 : view === 'fund2' ? fund2 : null;
  const m = useMemo(() => {
    if (view === 'combined') return getConsolidatedMetrics();
    return (view === 'fund1' ? fund1 : fund2).metrics;
  }, [view]);

  const fundLabel = view === 'fund1' ? 'Fund I' : view === 'fund2' ? 'Fund II' : 'Combined';

  const perf = m.performance;
  const cap  = m.capital;
  const debt = m.debt;
  const fees = m.fees;
  const comp = activeFund?.metrics?.composition;
  const distData = useMemo(() => {
    if (view === 'combined') {
      return fund1.consolidated.map((q, i) => ({
        quarter: q.quarter.replace('2025', "'25"),
        'Fund I': q.distribution,
        'Fund II': fund2.consolidated[i]?.distribution || 0,
      }));
    }
    const fund = view === 'fund1' ? fund1 : fund2;
    return fund.consolidated.map(q => ({
      quarter: q.quarter.replace('2025', "'25"),
      Distributions: q.distribution,
      NOI: q.noi,
    }));
  }, [view]);

  const capBarData = useMemo(() => {
    if (view === 'combined') {
      return [
        { name: 'Fund I', deployed: fund1.metrics.capital.deployedCapital, remaining: fund1.metrics.capital.dryPowder },
        { name: 'Fund II', deployed: fund2.metrics.capital.deployedCapital, remaining: fund2.metrics.capital.dryPowder },
      ];
    }
    return [
      { name: 'Deployed', value: cap.deployedCapital },
      { name: 'Dry Powder', value: cap.dryPowder },
      ...(cap.recallableCapital ? [{ name: 'Recallable', value: cap.recallableCapital }] : []),
    ];
  }, [view, cap]);
  const feeBarData = useMemo(() => [
    { name: 'Mgmt Fee', value: fees.mgmtFeeAnnual || 0 },
    { name: 'Pref Accrual', value: fees.prefReturnAccrual || 0 },
    { name: 'Carry Earned', value: fees.carriedEarned || 0 },
    { name: 'Carry Projected', value: fees.carriedProjected || 0 },
  ], [fees]);

  return (
    <div className="space-y-5">
      {/* Header + Fund Selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-display text-white">Fund Analytics</h2>
          <p className="text-mhc-muted text-sm">Performance, capital, debt, composition & fee tracking</p>
        </div>
        <div className="flex bg-mhc-card border border-mhc-border rounded-lg overflow-hidden">
          {[
            { key: 'combined', label: 'Combined' },
            { key: 'fund1', label: 'Fund I' },
            { key: 'fund2', label: 'Fund II' },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setView(opt.key)}
              className={`px-4 py-2 text-xs font-medium transition ${
                view === opt.key
                  ? 'bg-mhc-accent text-mhc-navy'
                  : 'text-mhc-muted hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {/* ── 1. Performance & Returns ── */}
      <Section title="Performance & Returns" badge={perf.dataType}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <KPICard label="Net IRR" value={fmt.rate(perf.irrNet)} sub={view !== 'combined' ? `Gross: ${fmt.rate(perf.irrGross || 0)}` : 'Weighted avg'} />
          <KPICard label="Equity Multiple" value={fmt.multiple(perf.equityMultipleNet)} sub={view !== 'combined' ? `Gross: ${fmt.multiple(perf.equityMultipleGross || 0)}` : 'Net, weighted'} />
          <KPICard label="TVPI" value={fmt.multiple(perf.tvpi)} sub={`DPI: ${fmt.multiple(perf.dpi)} + RVPI: ${fmt.multiple(perf.rvpi)}`} />
          <KPICard label="DPI" value={fmt.multiple(perf.dpi)} sub="Cash returned to LPs" />
        </div>
        <div className="bg-mhc-navy/40 rounded-lg p-4">
          <p className="text-mhc-muted text-xs mb-3">Distributions Trend — {fundLabel}</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={distData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3347" vertical={false} />
              <XAxis dataKey="quarter" tick={{ fill: '#8A9BB0', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: '#8A9BB0', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} formatter={v => [fmt.usd(v), undefined]} />
              {view === 'combined' ? (
                <>
                  <Area type="monotone" dataKey="Fund I" stackId="1" stroke={BLUE} fill={BLUE} fillOpacity={0.7} strokeWidth={2} />
                  <Area type="monotone" dataKey="Fund II" stackId="1" stroke={SAGE} fill={SAGE} fillOpacity={0.6} strokeWidth={2} />
                </>
              ) : (
                <>
                  <Area type="monotone" dataKey="Distributions" stroke={SAGE} fill={SAGE} fillOpacity={0.6} strokeWidth={2} />
                  <Area type="monotone" dataKey="NOI" stroke={BLUE} fill={BLUE} fillOpacity={0.7} strokeWidth={2} />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Section>
      {/* ── 2. Capital & Deployment ── */}
      <Section title="Capital & Deployment" badge={cap.dataType}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <KPICard label="Committed" value={fmt.usdM(cap.committedCapital)} sub={fundLabel} />
          <KPICard label="Deployed" value={fmt.usdM(cap.deployedCapital)} sub={fmt.rate(cap.deploymentPace) + ' pace'} />
          <KPICard label="Dry Powder" value={fmt.usdM(cap.dryPowder)} sub="Undeployed" />
          <KPICard label="Deployment" value={fmt.rate(cap.deploymentPace)} sub="Of committed" />
        </div>
        {/* Deployment progress bar */}
        <div className="bg-mhc-navy/40 rounded-lg p-4">
          <div className="flex justify-between text-xs text-mhc-muted mb-2">
            <span>Deployment Progress</span>
            <span>{fmt.rate(cap.deploymentPace)}</span>
          </div>
          <div className="w-full bg-mhc-border rounded-full h-3 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-mhc-accent to-mhc-gold transition-all" style={{ width: `${(cap.deploymentPace || 0) * 100}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-mhc-muted mt-1.5">
            <span>$0</span>
            <span>{fmt.usdM(cap.committedCapital)}</span>
          </div>
        </div>
        {/* Capital call schedule (individual fund only) */}
        {cap.capitalCalls && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-mhc-border text-mhc-muted">
                  <th className="text-left py-2 px-3 font-medium">Period</th>
                  <th className="text-right py-2 px-3 font-medium">Called</th>                  <th className="text-right py-2 px-3 font-medium">Actual</th>
                  <th className="text-right py-2 px-3 font-medium">Variance</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {cap.capitalCalls.map((cc, i) => (
                  <tr key={i} className="border-b border-mhc-border/30 hover:bg-mhc-navy/30">
                    <td className="py-2 px-3 text-mhc-muted">{cc.period}</td>
                    <td className="py-2 px-3 text-right">{fmt.usdM(cc.called)}</td>
                    <td className="py-2 px-3 text-right">{fmt.usdM(cc.actual)}</td>
                    <td className={`py-2 px-3 text-right ${cc.actual >= cc.called ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {fmt.usdM(cc.actual - cc.called)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* ── 3. Fund-Level Debt ── */}
      <Section title="Fund-Level Debt" badge={debt.dataType}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <KPICard label="Leverage Ratio" value={fmt.ratio(debt.leverageRatio)} sub="Debt / NAV" />
          <KPICard label="Fund LTV" value={fmt.rate(debt.ltv)} sub="Debt / GAV" />
          <KPICard label="Aggregate Debt" value={fmt.usdM(debt.aggregateDebt)} sub={`GAV: ${fmt.usdM(debt.aggregateGAV)}`} />
          <KPICard label="Cost of Capital" value={fmt.rate(debt.blendedCostOfCapital)} sub="Blended rate" />
        </div>        {/* Sub facility detail (individual fund) */}
        {activeFund?.metrics?.debt?.subscriptionFacility && (() => {
          const sf = activeFund.metrics.debt.subscriptionFacility;
          const utilPct = sf.totalSize > 0 ? sf.utilized / sf.totalSize : 0;
          return (
            <div className="bg-mhc-navy/40 rounded-lg p-4">
              <p className="text-mhc-muted text-xs mb-3">Subscription Facility</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div><span className="text-mhc-muted block">Facility Size</span><span className="text-white font-medium">{fmt.usdM(sf.totalSize)}</span></div>
                <div><span className="text-mhc-muted block">Utilized</span><span className="text-white font-medium">{fmt.usdM(sf.utilized)} ({fmt.rate(utilPct)})</span></div>
                <div><span className="text-mhc-muted block">Available</span><span className="text-emerald-400 font-medium">{fmt.usdM(sf.available)}</span></div>
                <div><span className="text-mhc-muted block">Maturity</span><span className="text-white font-medium">{sf.maturityDate}</span></div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-mhc-border rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${utilPct * 100}%` }} />
                </div>
              </div>
            </div>
          );
        })()}
      </Section>

      {/* ── 4. Portfolio Composition ── */}
      <Section title="Portfolio Composition" badge={comp ? comp.dataType : 'derived'}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <KPICard
            label="Wtd Avg Occupancy"
            value={fmt.pct(activeFund ? computeWeightedOccupancy(activeFund) : (computeWeightedOccupancy(fund1) * 0.5 + computeWeightedOccupancy(fund2) * 0.5))}
            sub="Latest quarter"
          />          <KPICard
            label="Total Assets"
            value={activeFund ? Object.values(activeFund.properties).filter(p => p.quarterly.length > 0).length : Object.values(fund1.properties).filter(p => p.quarterly.length > 0).length + Object.values(fund2.properties).filter(p => p.quarterly.length > 0).length}
            sub="With operational data"
          />
          <KPICard label="Avg Hold Period" value={activeFund ? fmt.years(2025 - activeFund.vintage) : 'Mixed'} sub={activeFund ? `Vintage ${activeFund.vintage}` : `${fund1.vintage} / ${fund2.vintage}`} />
          <KPICard label="Strategy" value={activeFund?.strategy || 'Value-Add'} sub="Office focus" />
        </div>
        {comp && (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Geographic */}
            <div className="bg-mhc-navy/40 rounded-lg p-4">
              <p className="text-mhc-muted text-xs mb-3">Geographic Concentration</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={comp.geographic.filter(g => g.pct > 0)}
                    dataKey="pct"
                    nameKey="region"
                    cx="50%" cy="50%"
                    innerRadius={45} outerRadius={70}
                    stroke="#0F2236" strokeWidth={2}
                  >
                    {comp.geographic.filter(g => g.pct > 0).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} fillOpacity={0.8} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TT} formatter={(v) => [fmt.rate(v), undefined]} />
                </PieChart>
              </ResponsiveContainer>              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {comp.geographic.filter(g => g.pct > 0).map((g, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-[10px] text-mhc-muted">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {g.region} ({fmt.rate(g.pct)})
                  </span>
                ))}
              </div>
            </div>
            {/* Asset Class */}
            <div className="bg-mhc-navy/40 rounded-lg p-4">
              <p className="text-mhc-muted text-xs mb-3">Asset Class Breakdown</p>
              <div className="space-y-3 mt-6">
                {comp.byAssetClass.map((ac, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-mhc-muted">{ac.cls}</span>
                      <span className="text-white">{fmt.rate(ac.pct)} · {ac.assets} asset{ac.assets !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full bg-mhc-border rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${ac.pct * 100}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {!comp && (
          <div className="bg-mhc-navy/40 rounded-lg p-4 text-mhc-muted text-xs">
            Select an individual fund to view composition breakdown.
          </div>
        )}      </Section>

      {/* ── 5. Fee & Waterfall Tracking ── */}
      <Section title="Fee & Waterfall Tracking" badge={fees.dataType}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <KPICard label="Mgmt Fee (Annual)" value={fmt.usdM(fees.mgmtFeeAnnual)} sub={activeFund ? `${fmt.rate(activeFund.metrics.fees.mgmtFeeRate)} of AUM` : 'Combined'} />
          <KPICard label="Pref Return Accrual" value={fmt.usdM(fees.prefReturnAccrual)} sub={activeFund ? `${fmt.rate(activeFund.metrics.fees.prefReturnRate)} hurdle` : 'Total accrued'} />
          <KPICard label="Carry Earned" value={fmt.usdM(fees.carriedEarned)} sub={`Projected: ${fmt.usdM(fees.carriedProjected)}`} />
          {activeFund?.metrics?.fees?.catchUpPct !== undefined && (
            <KPICard label="Catch-Up" value={fmt.rate(activeFund.metrics.fees.catchUpPct)} sub="Of full catch-up" />
          )}
        </div>
        {/* Fee waterfall bar */}
        <div className="bg-mhc-navy/40 rounded-lg p-4">
          <p className="text-mhc-muted text-xs mb-3">Fee & Carry Breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={feeBarData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3347" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#8A9BB0', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: '#8A9BB0', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} formatter={v => [fmt.usd(v), undefined]} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {feeBarData.map((_, i) => (
                  <Cell key={i} fill={[BLUE, SAGE, PLUM, PLUM][i]} fillOpacity={i === 3 ? 0.4 : 0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Org expense cap (individual fund) */}
        {activeFund?.metrics?.fees?.orgExpenseCap && (
          <div className="mt-4 bg-mhc-navy/40 rounded-lg p-4">            <div className="flex justify-between text-xs text-mhc-muted mb-2">
              <span>Org Expense Cap Utilization</span>
              <span>{fmt.rate(activeFund.metrics.fees.orgExpenseUtil)} ({fmt.usd(activeFund.metrics.fees.orgExpenseYTD)} / {fmt.usd(activeFund.metrics.fees.orgExpenseCap)})</span>
            </div>
            <div className="w-full bg-mhc-border rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${activeFund.metrics.fees.orgExpenseUtil > 0.8 ? 'bg-red-400' : 'bg-emerald-400'}`}
                style={{ width: `${activeFund.metrics.fees.orgExpenseUtil * 100}%` }}
              />
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}