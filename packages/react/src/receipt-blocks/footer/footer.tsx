import { Download } from "react-feather";
import styles from "./footer.module.css";

export function Footer({ mapAttribution }: { mapAttribution: boolean }) {
  return (
    <div className={styles.finePrintWrap}>
      <div className={styles.downloadBlock}>
        <div>
          <Download size={16} /> <div>Download Invoice</div>
        </div>
        <div>
          <Download size={16} /> <div>Download Receipt</div>
        </div>
      </div>
      {mapAttribution && (
        <div className={styles.finePrintContent}>
          <div className={styles.mapAttribution}>
            <span className={styles.mapLabel}>Maps:</span>
            <ul>
              <li>
                © <a href="https://www.mapbox.com/about/maps/">Mapbox</a>
              </li>
              <li>
                ©{" "}
                <a href="http://www.openstreetmap.org/copyright">
                  OpenStreetMap
                </a>
              </li>
              <li>
                <a href="https://www.mapbox.com/map-feedback/" target="_blank">
                  Improve map
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
