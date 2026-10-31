import { Icon } from "./Icon";

export type SelectionBarProps = {
  /** e.g. "1:3:3:1–3"; nothing selected hides the bar */
  label: string | null;
  onCopy: () => void;
  onShare: () => void;
  onClose: () => void;
};

export function SelectionBar({ label, onCopy, onShare, onClose }: SelectionBarProps) {
  return (
    <div className={`selbar${label ? " show" : ""}`} role="region" aria-label="Bait terpilih">
      <b>{label}</b>
      <button onClick={onCopy}>
        <Icon name="copy" /> Salin
      </button>
      <button onClick={onShare}>
        <Icon name="share" /> Bagikan
      </button>
      <button aria-label="Batal pilih" onClick={onClose}>
        <Icon name="close" />
      </button>
    </div>
  );
}
