import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "react-feather";
import styles from "./themeToggle.module.css";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {(theme == "dark" || (theme == "system" && systemTheme == "dark")) && (
        <button
          onClick={() => setTheme("light")}
          className={styles.themeToggleButton}
        >
          <Sun size={20} />
        </button>
      )}
      {(theme == "light" || (theme == "system" && systemTheme == "light")) && (
        <button
          onClick={() => setTheme("dark")}
          className={styles.themeToggleButton}
        >
          <Moon size={20} />
        </button>
      )}
    </>
  );
}
