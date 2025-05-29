import styles from "../../../../receipt-blocks/action-block/action-block.module.css";
import { lts } from "@versaprotocol/schema";

export function ActionBlock({
  actions,
  brandTheme,
  brandThemeContrastLight,
}: {
  actions: lts.v1_11_0.Action[];
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
