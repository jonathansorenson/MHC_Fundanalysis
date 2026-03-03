export default function KPICard({ label, value, sub, trend, icon }) {
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-mhc-muted';
  const trendIcon = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '';

  return (
    <div className="bg-mhc-card border border-mhc-border rounded-xl p-5 hover:border-mhc-accent/30 transition group">
      <div className="flex items-start justify-between mb-2">
        <span className="text-mhc-muted text-xs font-medium uppercase tracking-wider">{label}</span>
        {icon && <span className="text-mhc-accent/60 text-lg">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {sub && (
        <div className={`text-sm flex items-center gap-1 ${trendColor}`}>
          {trendIcon && <span className="text-xs">{trendIcon}</span>}
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}
