import styles from "@/components/shared/NotificationBanner/styles.module.css";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { Portal } from "@mui/material";
import Image from "next/image";
import { CSSProperties } from "react";

interface NotificationBannerProps {
  variant: "success" | "undone" | "error";
  isOpen: boolean;
  mainText: string;
  subText?: string;
  onDismissClicked: () => unknown;
  showUndo?: boolean;
  onUndoClicked?: () => unknown;
  style?: CSSProperties;
}

/**
 * A banner that displays a notification at the top of the screen
 */
export const NotificationBanner = ({
  variant,
  isOpen,
  mainText,
  subText,
  onDismissClicked,
  showUndo,
  onUndoClicked,
  style,
}: NotificationBannerProps) => {
  const { isMobile } = useScreenSizes();
  const iconSize = isMobile ? 36 : 49;
  const iconName = `/ic_${variant}.svg`;
  const iconAlt =
    variant === "undone" ? "Arrow Back" : variant === "error" ? "Exclamation Mark" : "Checkmark";
  const variantColor =
    variant === "undone" ? "#102D5F" : variant === "error" ? "#BE2D46" : "#3bb966";

  return isOpen ? (
    <Portal>
      <div className={styles.root} style={{ border: `2px solid ${variantColor}`, ...style }}>
        <Image src={iconName} alt={iconAlt} width={iconSize} height={iconSize} />
        <div className={styles.textColumn}>
          <p className={styles.mainText} style={{ color: variantColor }}>
            {mainText}
          </p>
          {subText ? <p className={styles.subText}>{subText}</p> : null}
        </div>
        {showUndo ? (
          <p className={`${styles.actionText} ${styles.undoText}`} onClick={onUndoClicked}>
            Undo
          </p>
        ) : null}
        <p className={styles.actionText} onClick={onDismissClicked}>
          Dismiss
        </p>
      </div>
    </Portal>
  ) : null;
};
