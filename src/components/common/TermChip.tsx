type TermChipProps = {
  label: string;
  onExplain: () => void;
};

export function TermChip({ label, onExplain }: TermChipProps) {
  return (
    <span className="term-chip">
      <span>{label}</span>
      <button type="button" aria-label={`查看${label}解释`} onClick={onExplain}>
        ?
      </button>
    </span>
  );
}
