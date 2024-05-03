import styles from "@/components/shared/Button/styles.module.css";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Variant of the button (primary = dark blue, error = red)
  variant: "primary" | "error";

  // Whether the button should be outlined instead of filled
  outlined: boolean;

  // Optional: path to icon image to display on left side of button
  iconPath?: string;

  // Optional: alt for icon image
  iconAlt?: string;

  // Optional: Text to display inside the button
  text?: string;

  // Whether the button is loading (in which case it is disabled and a spinner is rendered)
  loading?: boolean;

  // Whether to hide the button's text on mobile screens
  hideTextOnMobile?: boolean;
}

/**
 * A reusable button component, styled to our application.
 */
export const Button = ({
  variant,
  outlined,
  iconPath,
  iconAlt,
  text,
  loading,
  hideTextOnMobile = false,
  ...props
}: ButtonProps) => {
  const { isMobile, isTablet } = useScreenSizes();
  const iconSize = isMobile ? 16 : isTablet ? 19 : 24;

  const mainColor = variant === "primary" ? "var(--color-tse-accent-blue-1)" : "#be2d46";

  return (
    <button
      {...props}
      className={`${props.className ?? ""} ${styles.button}`}
      style={{
        backgroundColor: outlined ? "transparent" : mainColor,
        border: outlined ? `1px solid ${mainColor}` : "none",
        color: outlined ? mainColor : "white",
        ...props.style,
      }}
      disabled={props.disabled || loading}
    >
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <>
          {iconPath ? (
            <Image width={iconSize} height={iconSize} src={iconPath} alt={iconAlt!} />
          ) : null}
          {hideTextOnMobile && isMobile ? null : text}
        </>
      )}
    </button>
  );
};
