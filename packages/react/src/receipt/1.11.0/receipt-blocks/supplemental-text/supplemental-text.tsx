import { useEffect, useRef, useState } from "react";
import styles from "./supplemental-text.module.css";
import Markdown from "react-markdown";

export function SupplementalText({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };
  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > 80) {
        setShowToggleButton(true);
      }
    }
  }, []);
  return (
    <div
      className={`${styles.supplementalTextWrap} ${
        isExpanded ? styles.expanded : ""
      } ${showToggleButton ? styles.fadeOut : ""}`}
    >
      <div ref={contentRef} className={styles.content}>
        <Markdown>{text}</Markdown>
      </div>
      {showToggleButton && (
        <div className={styles.buttonWrap}>
          <button className={styles.toggleButton} onClick={toggleContent}>
            {isExpanded ? "View Less" : "View More"}
          </button>
        </div>
      )}
    </div>
  );
}
