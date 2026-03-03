import { fmt } from '../lib/utils';

export default function PropertyCard({ property, onClick }) {
  const latest = property.quarterly[property.quarterly.length - 1];
  if (!latest) {
    return (
      <div
        className="bg-mhc-card border border-mhc-border rounded-xl p-5 opacity-60 cursor-default"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm">{property.name}</h3>
          <span className="text-xs text-mhc-muted bg-mhc-navy px-2 py-0.5 rounded">{property.assetClass}</span>
        </div>
        <p className="text-mhc-muted text-xs">{property.sf > 0 ? fmt.sf(property.sf) : 'N/A'}</p>
        <p className="text-mhc-muted text-xs mt-2">No quarterly data available</p>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick?.(property)}
      className="bg-mhc-card border border-mhc-border rounded-xl p-5 hover:border-mhc-accent/40 transition cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm group-hover:text-mhc-accent transition">{property.name}</h3>
        <span className="text-xs text-mhc-muted bg-mhc-navy px-2 py-0.5 rounded">{property.assetClass}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-mhc-muted block">Occupancy</span>
          <span className="text-white font-medium">{fmt.pct(latest.occupancy)}</span>
        </div>
        <div>
          <span className="text-mhc-muted block">NOI</span>
          <span className="text-white font-medium">{fmt.usdK(latest.noi)}</span>
        </div>
        <div>
          <span className="text-mhc-muted block">Revenue</span>
          <span className="text-white font-medium">{fmt.usdK(latest.revenue)}</span>
        </div>
        <div>
          <span className="text-mhc-muted block">SF</span>
          <span className="text-white font-medium">{property.sf > 0 ? fmt.sf(property.sf) : 'N/A'}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-mhc-border flex items-center justify-between">
        <span className="text-mhc-muted text-xs">{latest.quarter}</span>
        <span className="text-mhc-accent text-xs opacity-0 group-hover:opacity-100 transition">View Details →</span>
      </div>
    </div>
  );
}
