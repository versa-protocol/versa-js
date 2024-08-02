import { formatDateTime } from "@versaprotocol/belt";
import styles from "./activity-block.module.css";

export function ActivityBlock({ activities }: { activities: any[] }) {
  return (
    <div className={styles.activityBlockWrap}>
      <h2>Activity</h2>
      <ul>
        {activities.map((a, index) => (
          <li key={index}>
            <div>{a.description}</div>
            <div className={styles.date}>{formatDateTime(a.activity_at)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
