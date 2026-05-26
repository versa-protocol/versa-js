import styles from "./lifecycle-status-badge.module.css";

type LifecycleStatusInput =
  | "active"
  | "canceled"
  | "refunded"
  | null
  | undefined;

export function LifecycleStatusBadge({
  status,
}: {
  status: LifecycleStatusInput;
}) {
  if (!status || status === "active") {
    return null;
  }

  const label = status === "canceled" ? "Canceled" : "Refunded";

  return (
    <div className={styles.badge} aria-label={`Status: ${label}`}>
      {label}
    </div>
  );
}
