import styles from "@/components/ErrorNotification/styles.module.css";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { Portal } from "@mui/material";
import Image from "next/image";
import { CSSProperties } from "react";

interface ErrorNotificationProps {
  isOpen: boolean;
  mainText: string;
  subText: string;
  actionText: string;
  onActionClicked: () => unknown;
  style?: CSSProperties;
}

/**
 * A component that displays an error notification at the top of the screen
 */
export const ErrorNotification = ({
  isOpen,
  mainText,
  subText,
  actionText,
  onActionClicked,
  style,
}: ErrorNotificationProps) => {
  const { isMobile } = useScreenSizes();
  const iconSize = isMobile ? 36 : 49;

  return isOpen ? (
    <Portal>
      <div className={styles.root} style={style}>
        <Image
          className={styles.icon}
          src="/ic_error.svg"
          alt="Exclamation Mark"
          width={iconSize}
          height={iconSize}
        />
        <div className={styles.textColumn}>
          <p className={styles.mainText}>{mainText}</p>
          <p className={styles.subText}>{subText}</p>
        </div>
        <p className={styles.actionText} onClick={onActionClicked}>
          {actionText}
        </p>
      </div>
    </Portal>
  ) : null;
};
