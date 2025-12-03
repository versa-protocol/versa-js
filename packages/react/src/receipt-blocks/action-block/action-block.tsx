import styles from "./action-block.module.css";
import { Action } from "@versa/schema";
import { ExternalLink } from "../../icons/externalLink";
import { Facebook } from "../../icons/facebook";
import { Instagram } from "../../icons/instagram";
import { XIcon } from "../../icons/x";

type SocialMediaPlatform = "x" | "instagram" | "facebook" | null;

interface SocialMediaInfo {
  platform: SocialMediaPlatform;
  username: string;
  displayName: string;
}

function parseSocialMediaUrl(url: string): SocialMediaInfo | null {
  const normalizedUrl = url.toLowerCase();

  // X (Twitter) pattern: https://x.com/username or https://twitter.com/username
  const xMatch = normalizedUrl.match(
    /(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]+)\/?$/i
  );
  if (xMatch) {
    const username = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]+)\/?$/i
    )?.[1];
    return {
      platform: "x",
      username: username || "",
      displayName: `@${username}`,
    };
  }

  // Instagram pattern: https://www.instagram.com/username
  const instagramMatch = normalizedUrl.match(
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]+)\/?$/i
  );
  if (instagramMatch) {
    const username = url.match(
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]+)\/?$/i
    )?.[1];
    return {
      platform: "instagram",
      username: username || "",
      displayName: `Instagram: ${username}`,
    };
  }

  // Facebook pattern: https://www.facebook.com/username
  const facebookMatch = normalizedUrl.match(
    /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9_.]+)\/?$/i
  );
  if (facebookMatch) {
    const username = url.match(
      /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9_.]+)\/?$/i
    )?.[1];
    return {
      platform: "facebook",
      username: username || "",
      displayName: `Facebook: ${username}`,
    };
  }

  return null;
}

function SocialMediaIcon({ platform }: { platform: SocialMediaPlatform }) {
  const iconStyle = { width: 16, height: 16, opacity: 0.8 };

  switch (platform) {
    case "x":
      return <XIcon className={styles.actionIcon} style={iconStyle} />;
    case "instagram":
      return <Instagram className={styles.actionIcon} style={iconStyle} />;
    case "facebook":
      return <Facebook className={styles.actionIcon} style={iconStyle} />;
    default:
      return null;
  }
}

export function ActionBlock({
  actions,
  brandTheme,
  brandThemeContrastLight,
}: {
  actions: Action[];
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
          {actions.map((a, index) => {
            const socialMedia = parseSocialMediaUrl(a.url);
            const displayName = socialMedia ? socialMedia.displayName : a.name;

            return (
              <li key={index}>
                <a
                  href={normalizeUrl(a.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionButton}
                  style={{
                    backgroundColor: brandTheme,
                    color: brandThemeContrastLight ? "black" : "white",
                  }}
                >
                  {socialMedia && (
                    <SocialMediaIcon platform={socialMedia.platform} />
                  )}
                  <span>{displayName}</span>
                  <ExternalLink
                    className={styles.externalLinkIcon}
                    style={{ width: 16, height: 16 }}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
