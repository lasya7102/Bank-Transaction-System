export default function StatusBadge({ status }) {
  const normalized = (status || "").toUpperCase();
  const className = `status-badge status-badge--${normalized.toLowerCase()}`;

  return <span className={className}>{normalized || "UNKNOWN"}</span>;
}
