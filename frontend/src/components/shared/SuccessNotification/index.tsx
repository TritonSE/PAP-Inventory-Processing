import styles from "@/components/shared/SuccessNotification/styles.module.css";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { Portal } from "@mui/material";
import Image from "next/image";

interface SuccessAction {
  text: string;
  onClick: () => unknown;
}

interface SuccessNotificationProps {
  isOpen: boolean;
  mainText: string;
  actions: SuccessAction[];
}

/**
 * A component that displays a success notification at the top of the screen
 */
export const SuccessNotification = ({ isOpen, mainText, actions }: SuccessNotificationProps) => {
  const { isMobile } = useScreenSizes();
  const iconSize = isMobile ? 36 : 49;

  return isOpen ? (
    <Portal>
      <div className={styles.root}>
        <Image src="/ic_success.svg" alt="Checkmark" width={iconSize} height={iconSize} />
        <p className={styles.mainText}>{mainText}</p>
        {actions.map((action, index) => (
          <p key={index} className={styles.actionText} onClick={action.onClick}>
            {action.text}
          </p>
        ))}
      </div>
    </Portal>
  ) : null;
};
