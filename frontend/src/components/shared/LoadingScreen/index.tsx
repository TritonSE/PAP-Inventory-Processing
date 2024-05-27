import { CircularProgress } from "@mui/material";
import { CSSProperties } from "react";
import styles from "@/components/shared/LoadingScreen/styles.module.css";

interface LoadingScreenProps {
  style?: CSSProperties;
}

/**
 * A component that displays a loading screen with a spinner and some text
 */
export const LoadingScreen = ({ style }: LoadingScreenProps) => {
  return (
    <div className={styles.root} style={style}>
      <CircularProgress />
      <p className={styles.text}>Please wait...</p>
    </div>
  );
};
