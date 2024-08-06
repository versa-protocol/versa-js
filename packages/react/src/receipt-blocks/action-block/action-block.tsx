import styles from "./action-block.module.css";
import { Receipt } from "@versaprotocol/schema";

export function ActionBlock({
  actions,
  brandTheme,
  brandThemeContrastLight,
}: {
  actions: Receipt["actions"];
  brandTheme: any;
  brandThemeContrastLight: boolean;
}) {
  const normalizeUrl = (url: string) => {
    if (!url.startsWith("http")) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <>
      {actions && (
        <ul className={styles.actionBlock}>
          {actions.map((a, index) => (
            <li key={index}>
              <a
                href={normalizeUrl(a.url)}
                className={styles.actionButton}
                style={{
                  backgroundColor: brandTheme,
                  color: brandThemeContrastLight ? "black" : "white",
                }}
              >
                {a.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
