const styles = {
  derived:     { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Derived' },
  placeholder: { bg: 'bg-amber-500/15',   text: 'text-amber-400',   label: 'Placeholder' },
  mixed:       { bg: 'bg-orange-500/15',   text: 'text-orange-400',  label: 'Mixed' },
};

export default function MetricBadge({ type = 'placeholder' }) {
  const s = styles[type] || styles.placeholder;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${s.bg} ${s.text}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}