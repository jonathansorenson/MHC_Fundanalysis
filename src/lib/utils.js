export const fmt = {
  usd: v => `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
  usdK: v => `$${(Number(v) / 1000).toFixed(0)}K`,
  usdM: v => `$${(Number(v) / 1000000).toFixed(2)}M`,
  sf: v => `${Number(v).toLocaleString()} SF`,
  pct: v => `${(Number(v) * 100).toFixed(1)}%`,
  pctDelta: v => {
    const val = Number(v) * 100;
    const sign = val >= 0 ? '+' : '';
    return `${sign}${val.toFixed(1)}%`;
  },
  quarter: v => v,
  multiple: v => `${Number(v).toFixed(2)}x`,
  rate: v => `${(Number(v) * 100).toFixed(1)}%`,
  ratio: v => `${Number(v).toFixed(2)}x`,
  years: v => `${Number(v).toFixed(1)} yrs`,
};

export const fmtM = v => `$${(v / 1000).toFixed(0)}K`;
export const fmtM1 = v => `$${(v / 1000).toFixed(1)}K`;
export const fmtDollar = v => `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;