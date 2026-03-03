/**
 * MHC Fund Dashboard — Static Data Module
 * Source: Yardi-exported Excel files (MHCREF / MHCREF II / Occupancy / YOY)
 * DISCLAIMER: All figures are from property management system exports.
 * Verify against source systems before relying on for investment decisions.
 */

// ── FUND I (MHCREF) ─────────────────────────────────────────
export const fund1 = {
  name: 'MHCREF',
  fullName: 'MHC Real Estate Fund I',
  manager: 'NAI Merin Hunter Codman',
  vintage: 2019,
  strategy: 'Value-Add Office',
  asOfDate: '2025-12-31',
  properties: {
    'golden-bear': {
      id: 'golden-bear', name: 'Golden Bear Plaza', alias: 'Oakbrook',
      address: '11780 US Highway 1, North Palm Beach, FL',
      sf: 243353, assetClass: 'Office',
      quarterly: [
        { quarter: 'Q1 2025', occupancy: 0.9168, revenue: 2840837.19, expenses: 1433701.41, noi: 1407135.78 },
        { quarter: 'Q2 2025', occupancy: 0.9168, revenue: 2652269.64, expenses: 1441552.12, noi: 1210717.52 },
        { quarter: 'Q3 2025', occupancy: 0.934, revenue: 2634744.96, expenses: 1461065.03, noi: 1173679.93 },
        { quarter: 'Q4 2025', occupancy: 0.9435, revenue: 2648798.69, expenses: 1776204.69, noi: 872594.00 },
      ],
    },    '9000-town-center': {
      id: '9000-town-center', name: '9000 Town Center Parkway', alias: '9000 TC',
      address: '9000 Town Center Parkway, Lakewood Ranch, FL',
      sf: 101312, assetClass: 'Office',
      quarterly: [
        { quarter: 'Q1 2025', occupancy: 1.0, revenue: 987497.03, expenses: 302995.97, noi: 684501.06 },
        { quarter: 'Q2 2025', occupancy: 1.0, revenue: 979065.86, expenses: 283672.37, noi: 695393.49 },
        { quarter: 'Q3 2025', occupancy: 1.0, revenue: 1251627.11, expenses: 213526.52, noi: 1038100.59 },
      ],
    },
    '900-broken-sound': {
      id: '900-broken-sound', name: '900 Broken Sound Parkway', alias: '900 BS',
      address: '900 Broken Sound Parkway NW, Boca Raton, FL',
      sf: 116246, assetClass: 'Office',
      quarterly: [
        { quarter: 'Q1 2025', occupancy: 0.7528, revenue: 930141.78, expenses: 368383.35, noi: 561758.43 },
        { quarter: 'Q2 2025', occupancy: 0.7528, revenue: 815262.06, expenses: 365669.83, noi: 449592.23 },
        { quarter: 'Q3 2025', occupancy: 0.7528, revenue: 706127.58, expenses: 403258.82, noi: 302868.76 },
        { quarter: 'Q4 2025', occupancy: 0.7745, revenue: 1123930.52, expenses: 388999.37, noi: 734931.15 },
      ],
    },
    'oakland-park': {
      id: 'oakland-park', name: '2601 E Oakland Park Blvd', alias: 'Oakland',
      address: '2601 E Oakland Park Blvd, Fort Lauderdale, FL',
      sf: 59892, assetClass: 'Office',
      quarterly: [
        { quarter: 'Q1 2025', occupancy: 0.8458, revenue: 444051.32, expenses: 234934.15, noi: 209117.17 },
        { quarter: 'Q2 2025', occupancy: 0.8458, revenue: 115133.86, expenses: 71767.83, noi: 43366.03 },
      ],
    },    'prince-creek': {
      id: 'prince-creek', name: 'Prince Creek Village', alias: 'PCV',
      address: 'Prince Creek Village, Murrells Inlet, SC',
      sf: 0, assetClass: 'Retail',
      quarterly: [
        { quarter: 'Q1 2024', occupancy: 1.0, revenue: 0, expenses: 0, noi: 0 },
        { quarter: 'Q2 2024', occupancy: 1.0, revenue: 0, expenses: 0, noi: 0 },
      ],
    },
  },
  consolidated: [
    { quarter: 'Q1 2025', distribution: 372250, revenue: 5202527.32, expenses: 2340014.88, noi: 2862512.44 },
    { quarter: 'Q2 2025', distribution: 5422750, revenue: 4561731.42, expenses: 2162662.15, noi: 2399069.27 },
    { quarter: 'Q3 2025', distribution: 3235000, revenue: 4592499.65, expenses: 2077850.37, noi: 2514649.28 },
    { quarter: 'Q4 2025', distribution: 288500, revenue: 3772729.21, expenses: 2165204.06, noi: 1607525.15 },
  ],
};

// ── FUND II (MHCREF II) ──────────────────────────────────────
export const fund2 = {
  name: 'MHCREF II',
  fullName: 'MHC Real Estate Fund II',
  manager: 'NAI Merin Hunter Codman',
  vintage: 2022,
  strategy: 'Value-Add Office',
  asOfDate: '2025-12-31',
  properties: {
    'ecoplex': {
      id: 'ecoplex', name: 'EcoPlex Office Park', alias: 'Ecoplex',
      address: 'EcoPlex, Sunrise, FL',
      sf: 100525, assetClass: 'Office',      quarterly: [
        { quarter: 'Q1 2025', occupancy: 0.8493, revenue: 676339.15, expenses: 384654.09, noi: 291685.06 },
        { quarter: 'Q2 2025', occupancy: 0.8879, revenue: 789397.48, expenses: 409585.20, noi: 379812.28 },
        { quarter: 'Q3 2025', occupancy: 0.8879, revenue: 918060.52, expenses: 362094.45, noi: 555966.07 },
        { quarter: 'Q4 2025', occupancy: 0.8879, revenue: 880121.84, expenses: 345994.16, noi: 534127.68 },
      ],
    },
    'yamato': {
      id: 'yamato', name: 'Yamato Office Center', alias: 'Yamato',
      address: 'Yamato Road, Boca Raton, FL',
      sf: 172197, assetClass: 'Office',
      quarterly: [
        { quarter: 'Q1 2025', occupancy: 0.6503, revenue: 871524.47, expenses: 482982.16, noi: 388542.31 },
        { quarter: 'Q2 2025', occupancy: 0.6355, revenue: 963921.93, expenses: 582086.34, noi: 381835.59 },
        { quarter: 'Q3 2025', occupancy: 0.6538, revenue: 1040552.02, expenses: 609796.76, noi: 430755.26 },
        { quarter: 'Q4 2025', occupancy: 0.7676, revenue: 983489.39, expenses: 490734.50, noi: 492754.89 },
      ],
    },
    'bridgeport': {
      id: 'bridgeport', name: 'Bridgeport Center', alias: 'Bridgeport',
      address: 'Bridgeport Center, Bridgeport, CT',
      sf: 180257, assetClass: 'Office',
      quarterly: [
        { quarter: 'Q1 2025', occupancy: 0.9498, revenue: 1689214.61, expenses: 717055.38, noi: 972159.23 },
        { quarter: 'Q2 2025', occupancy: 0.9586, revenue: 2388228.76, expenses: 880110.20, noi: 1508118.56 },
        { quarter: 'Q3 2025', occupancy: 0.9684, revenue: 1666287.56, expenses: 900785.62, noi: 765501.94 },
        { quarter: 'Q4 2025', occupancy: 0.9684, revenue: 1971859.04, expenses: 713015.50, noi: 1258843.54 },
      ],
    },    'merritt-crossing': {
      id: 'merritt-crossing', name: 'Merritt Crossing', alias: 'Merritt',
      address: 'Merritt Crossing, Trumbull, CT',
      sf: 89727, assetClass: 'Office',
      quarterly: [
        { quarter: 'Q3 2025', occupancy: 0.9324, revenue: 210041.11, expenses: 105723.51, noi: 104317.60 },
        { quarter: 'Q4 2025', occupancy: 0.9324, revenue: 373314.95, expenses: 205457.96, noi: 167856.99 },
      ],
    },
  },
  consolidated: [
    { quarter: 'Q1 2025', distribution: 150000, revenue: 3237078.23, expenses: 1584691.63, noi: 1652386.60 },
    { quarter: 'Q2 2025', distribution: 100000, revenue: 4141548.17, expenses: 1871781.74, noi: 2269766.43 },
    { quarter: 'Q3 2025', distribution: 170000, revenue: 3834941.21, expenses: 1978400.34, noi: 1856540.87 },
    { quarter: 'Q4 2025', distribution: 142000, revenue: 4208785.22, expenses: 1755202.12, noi: 2453583.10 },
  ],
};

// ── SIDECAR PROPERTIES ───────────────────────────────────────
export const sidecars = {
  name: 'Sidecar / Co-Invest',
  properties: {
    '1-east-broward': {
      id: '1-east-broward', name: '1 East Broward', alias: '1EB',
      address: '1 East Broward Blvd, Fort Lauderdale, FL',
      sf: 349706, assetClass: 'Office',
      quarterly: [],
    },
    'sawgrass': {
      id: 'sawgrass', name: 'Sawgrass International Place', alias: 'SIP',
      address: 'Sawgrass International Place, Sunrise, FL',
      sf: 94132, assetClass: 'Office',      quarterly: [],
    },
  },
};

// ── OCCUPANCY DATA ───────────────────────────────────────────
export const occupancy = [
  { property: '2601 E Oakland Park', fund: 'Fund I', occ2024: 0.8815, occ2025: null, change: null, sf: 59892 },
  { property: 'Oakbrook', fund: 'Fund I', occ2024: 0.9168, occ2025: 0.9435, change: 0.0291, sf: 243353 },
  { property: '9000 Town Center Parkway', fund: 'Fund I', occ2024: 0.9899, occ2025: 1.0, change: 0.0102, sf: 101312 },
  { property: '900 Broken Sound', fund: 'Fund I', occ2024: 0.753, occ2025: 0.7745, change: 0.0286, sf: 116246 },
  { property: 'EcoPlex', fund: 'Fund II', occ2024: 0.895, occ2025: 0.8879, change: -0.0079, sf: 100525 },
  { property: 'Yamato Office Center', fund: 'Fund II', occ2024: 0.5927, occ2025: 0.7370, change: 0.2435, sf: 172197 },
  { property: 'Bridgeport Center', fund: 'Fund II', occ2024: 0.9498, occ2025: 0.9684, change: 0.0196, sf: 180257 },
  { property: 'Merritt Crossing', fund: 'Fund II', occ2024: 0.9324, occ2025: 0.9324, change: 0, sf: 89727 },
  { property: '1 East Broward', fund: 'Sidecar', occ2024: 0.7375, occ2025: 0.6951, change: -0.0575, sf: 349706 },
  { property: 'Sawgrass International Place', fund: 'Sidecar', occ2024: 0.9652, occ2025: 0.8697, change: -0.0989, sf: 94132 },
];

export const occupancySummary = [
  { label: 'Portfolio', occ2024: 0.8355, occ2025: 0.8431, change: 0.0090, sf: 1063509 },
  { label: 'Fund I', occ2024: 0.8904, occ2025: 0.9133, change: 0.0257, sf: 520803 },
  { label: 'Fund II', occ2024: 0.8235, occ2025: 0.8741, change: 0.0615, sf: 542706 },
];

// ── YOY GROWTH ───────────────────────────────────────────────
export const yoyGrowth = {
  fund1: [
    { asset: 'Oakbrook Center', noi2024: 5192251, noi2025: 4664127, noiChange: -0.1017, budgetNOI: 4743435, noiVsBudget: -0.0167, rev2024: 11584573, rev2025: 10776650, revChange: -0.0697, budgetRev: 10801549, revVsBudget: -0.0023 },
    { asset: '900 Broken Sound', noi2024: 2532652, noi2025: 2049151, noiChange: -0.1909, budgetNOI: 1857355, noiVsBudget: 0.1033, rev2024: 4097139, rev2025: 3575462, revChange: -0.1273, budgetRev: 3388955, revVsBudget: 0.0550 },
  ],  fund2: [
    { asset: 'Bridgeport', noi2024: 2975630, noi2025: 4504623, noiChange: 0.5138, budgetNOI: 4486447, noiVsBudget: 0.0041, rev2024: 6204065, rev2025: 7715590, revChange: 0.2436, budgetRev: 7325102, revVsBudget: 0.0533 },
    { asset: 'EcoPlex', noi2024: 1937917, noi2025: 1761591, noiChange: -0.0910, budgetNOI: 1661068, noiVsBudget: 0.0605, rev2024: 3507341, rev2025: 3263919, revChange: -0.0694, budgetRev: 3225098, revVsBudget: 0.0120 },
    { asset: 'Yamato Office Center', noi2024: 1666513, noi2025: 1693888, noiChange: 0.0164, budgetNOI: 2256572, noiVsBudget: -0.2494, rev2024: 3740793, rev2025: 3859488, revChange: 0.0317, budgetRev: 4348228, revVsBudget: -0.1124 },
    { asset: 'Merritt Crossing', noi2024: 0, noi2025: 272175, noiChange: null, budgetNOI: 0, noiVsBudget: null, rev2024: 0, rev2025: 583356, revChange: null, budgetRev: 0, revVsBudget: null },
  ],
};

// ── FUND-LEVEL METRICS ─────────────────────────────────────────
// dataType legend:
//   'derived'     — computed from quarterly operational data above
//   'placeholder' — realistic estimate; replace with actual LP/partner data
//   'mixed'       — some sub-fields derived, others placeholder

fund1.metrics = {
  performance: {
    irrGross: 0.152,  irrNet: 0.118,
    equityMultipleGross: 1.85, equityMultipleNet: 1.62,
    tvpi: 1.68, dpi: 0.48, rvpi: 1.20,
    dataType: 'placeholder',
  },
  capital: {
    committedCapital: 125000000,
    deployedCapital: 108500000,
    deploymentPace: 0.868,
    dryPowder: 16500000,
    recallableCapital: 8200000,
    recyclingUtilized: 12500000,
    recyclingRate: 0.115,
    capitalCalls: [
      { period: 'Q1 2019', called: 25000000, actual: 25000000 },
      { period: 'Q3 2019', called: 35000000, actual: 34200000 },      { period: 'Q1 2020', called: 30000000, actual: 30000000 },
      { period: 'Q3 2020', called: 20000000, actual: 19300000 },
      { period: 'Q1 2021', called: 15000000, actual: 15000000 },
    ],
    dataType: 'placeholder',
  },
  debt: {
    leverageRatio: 0.48,
    navAmount: 142000000,
    subscriptionFacility: { totalSize: 35000000, utilized: 18500000, available: 16500000, maturityDate: '2026-06-30', rate: 0.0625 },
    blendedCostOfCapital: 0.058,
    aggregateDebt: 68000000,
    aggregateGAV: 165000000,
    ltv: 0.412,
    dataType: 'placeholder',
  },
  composition: {
    geographic: [
      { region: 'South Florida', pct: 0.62, assets: 3 },
      { region: 'Southwest FL', pct: 0.19, assets: 1 },
      { region: 'South Carolina', pct: 0.0, assets: 1 },
    ],
    byAssetClass: [
      { cls: 'Office', pct: 0.81, assets: 4 },
      { cls: 'Retail', pct: 0.0, assets: 1 },
    ],
    dataType: 'derived',
  },  fees: {
    mgmtFeeRate: 0.0150,
    aum: 108500000,
    mgmtFeeAnnual: 1627500,
    mgmtFeeAccrued: 813750,
    prefReturnRate: 0.08,
    prefReturnAccrual: 4900000,
    carriedInterestRate: 0.20,
    carriedEarned: 3200000,
    carriedProjected: 4800000,
    catchUpPct: 0.72,
    orgExpenseCap: 1500000,
    orgExpenseYTD: 920000,
    orgExpenseUtil: 0.613,
    dataType: 'placeholder',
  },
  asOfDate: '2025-12-31',
};

fund2.metrics = {
  performance: {
    irrGross: 0.183, irrNet: 0.142,
    equityMultipleGross: 1.52, equityMultipleNet: 1.38,
    tvpi: 1.42, dpi: 0.12, rvpi: 1.30,
    dataType: 'placeholder',
  },
  capital: {
    committedCapital: 225000000,
    deployedCapital: 178000000,
    deploymentPace: 0.791,    dryPowder: 47000000,
    recallableCapital: 5500000,
    recyclingUtilized: 8200000,
    recyclingRate: 0.046,
    capitalCalls: [
      { period: 'Q1 2022', called: 45000000, actual: 45000000 },
      { period: 'Q3 2022', called: 55000000, actual: 53800000 },
      { period: 'Q1 2023', called: 40000000, actual: 40000000 },
      { period: 'Q3 2023', called: 25000000, actual: 25000000 },
      { period: 'Q1 2024', called: 20000000, actual: 14200000 },
    ],
    dataType: 'placeholder',
  },
  debt: {
    leverageRatio: 0.41,
    navAmount: 268000000,
    subscriptionFacility: { totalSize: 60000000, utilized: 32000000, available: 28000000, maturityDate: '2027-03-31', rate: 0.0650 },
    blendedCostOfCapital: 0.062,
    aggregateDebt: 110000000,
    aggregateGAV: 290000000,
    ltv: 0.379,
    dataType: 'placeholder',
  },
  composition: {
    geographic: [
      { region: 'South Florida', pct: 0.50, assets: 2 },
      { region: 'Connecticut', pct: 0.50, assets: 2 },
    ],
    byAssetClass: [
      { cls: 'Office', pct: 1.0, assets: 4 },
    ],    dataType: 'derived',
  },
  fees: {
    mgmtFeeRate: 0.0150,
    aum: 178000000,
    mgmtFeeAnnual: 2670000,
    mgmtFeeAccrued: 1335000,
    prefReturnRate: 0.08,
    prefReturnAccrual: 8500000,
    carriedInterestRate: 0.20,
    carriedEarned: 1200000,
    carriedProjected: 6500000,
    catchUpPct: 0.35,
    orgExpenseCap: 2500000,
    orgExpenseYTD: 1180000,
    orgExpenseUtil: 0.472,
    dataType: 'placeholder',
  },
  asOfDate: '2025-12-31',
};


// ── HELPER: Get fund data by key ─────────────────────────────
export function getFundByKey(key) {
  if (key === 'fund1') return fund1;
  if (key === 'fund2') return fund2;
  if (key === 'sidecars') return sidecars;
  return null;
}
// ── HELPER: Compute consolidated totals ──────────────────────
export function getConsolidatedTotals() {
  const f1Total = fund1.consolidated.reduce((s, q) => s + q.noi, 0);
  const f2Total = fund2.consolidated.reduce((s, q) => s + q.noi, 0);
  const f1Rev = fund1.consolidated.reduce((s, q) => s + q.revenue, 0);
  const f2Rev = fund2.consolidated.reduce((s, q) => s + q.revenue, 0);
  const f1Dist = fund1.consolidated.reduce((s, q) => s + q.distribution, 0);
  const f2Dist = fund2.consolidated.reduce((s, q) => s + q.distribution, 0);
  return {
    totalNOI: f1Total + f2Total,
    totalRevenue: f1Rev + f2Rev,
    totalDistributions: f1Dist + f2Dist,
    fund1NOI: f1Total,
    fund2NOI: f2Total,
    fund1Revenue: f1Rev,
    fund2Revenue: f2Rev,
    totalSF: Object.values(fund1.properties).reduce((s, p) => s + p.sf, 0)
            + Object.values(fund2.properties).reduce((s, p) => s + p.sf, 0)
            + Object.values(sidecars.properties).reduce((s, p) => s + p.sf, 0),
    propertyCount: Object.keys(fund1.properties).length + Object.keys(fund2.properties).length + Object.keys(sidecars.properties).length,
  };
}

// ── HELPER: Weighted average occupancy for a fund ────────────
export function computeWeightedOccupancy(fund) {
  const props = Object.values(fund.properties).filter(p => p.quarterly.length > 0 && p.sf > 0);
  const totalSF = props.reduce((s, p) => s + p.sf, 0);
  if (totalSF === 0) return 0;
  return props.reduce((s, p) => {
    const latest = p.quarterly[p.quarterly.length - 1];
    return s + latest.occupancy * p.sf;
  }, 0) / totalSF;
}
// ── HELPER: Get fund metrics for a given key ─────────────────
export function getFundMetrics(key) {
  const fund = getFundByKey(key);
  if (!fund || !fund.metrics) return null;
  return fund.metrics;
}

// ── HELPER: Consolidated metrics across both funds ───────────
export function getConsolidatedMetrics() {
  const m1 = fund1.metrics;
  const m2 = fund2.metrics;
  const w1 = m1.capital.deployedCapital;
  const w2 = m2.capital.deployedCapital;
  const totalDeployed = w1 + w2;

  return {
    performance: {
      irrNet: totalDeployed > 0 ? (m1.performance.irrNet * w1 + m2.performance.irrNet * w2) / totalDeployed : 0,
      irrGross: totalDeployed > 0 ? (m1.performance.irrGross * w1 + m2.performance.irrGross * w2) / totalDeployed : 0,
      equityMultipleNet: totalDeployed > 0 ? (m1.performance.equityMultipleNet * w1 + m2.performance.equityMultipleNet * w2) / totalDeployed : 0,
      tvpi: totalDeployed > 0 ? (m1.performance.tvpi * w1 + m2.performance.tvpi * w2) / totalDeployed : 0,
      dpi: totalDeployed > 0 ? (m1.performance.dpi * w1 + m2.performance.dpi * w2) / totalDeployed : 0,
      rvpi: totalDeployed > 0 ? (m1.performance.rvpi * w1 + m2.performance.rvpi * w2) / totalDeployed : 0,
      dataType: 'placeholder',
    },
    capital: {
      committedCapital: m1.capital.committedCapital + m2.capital.committedCapital,
      deployedCapital: totalDeployed,
      deploymentPace: (m1.capital.committedCapital + m2.capital.committedCapital) > 0        ? totalDeployed / (m1.capital.committedCapital + m2.capital.committedCapital) : 0,
      dryPowder: m1.capital.dryPowder + m2.capital.dryPowder,
      dataType: 'placeholder',
    },
    debt: {
      aggregateDebt: m1.debt.aggregateDebt + m2.debt.aggregateDebt,
      aggregateGAV: m1.debt.aggregateGAV + m2.debt.aggregateGAV,
      ltv: (m1.debt.aggregateGAV + m2.debt.aggregateGAV) > 0
        ? (m1.debt.aggregateDebt + m2.debt.aggregateDebt) / (m1.debt.aggregateGAV + m2.debt.aggregateGAV) : 0,
      leverageRatio: totalDeployed > 0
        ? (m1.debt.leverageRatio * w1 + m2.debt.leverageRatio * w2) / totalDeployed : 0,
      blendedCostOfCapital: totalDeployed > 0
        ? (m1.debt.blendedCostOfCapital * w1 + m2.debt.blendedCostOfCapital * w2) / totalDeployed : 0,
      dataType: 'placeholder',
    },
    fees: {
      mgmtFeeAnnual: m1.fees.mgmtFeeAnnual + m2.fees.mgmtFeeAnnual,
      prefReturnAccrual: m1.fees.prefReturnAccrual + m2.fees.prefReturnAccrual,
      carriedEarned: m1.fees.carriedEarned + m2.fees.carriedEarned,
      carriedProjected: m1.fees.carriedProjected + m2.fees.carriedProjected,
      dataType: 'placeholder',
    },
  };
}