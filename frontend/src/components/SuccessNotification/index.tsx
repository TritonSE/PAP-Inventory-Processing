import styles from "@/components/SuccessNotification/styles.module.css";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { Portal } from "@mui/material";
import Image from "next/image";

interface SuccessNotificationProps {
  isOpen: boolean;
  mainText: string;
  actionText: string;
  onActionClicked: () => unknown;
}

/**
 * A component that displays a success notification at the top of the screen
 */
export const SuccessNotification = ({
  isOpen,
  mainText,
  actionText,
  onActionClicked,
}: SuccessNotificationProps) => {
  const { isMobile } = useScreenSizes();
  const iconSize = isMobile ? 36 : 49;

  return isOpen ? (
    <Portal>
      <div className={styles.root}>
        <Image src="/ic_success.svg" alt="Checkmark" width={iconSize} height={iconSize} />
        <p className={styles.mainText}>{mainText}</p>
        <p className={styles.actionText} onClick={onActionClicked}>
          {actionText}
        </p>
      </div>
    </Portal>
  ) : null;
};
