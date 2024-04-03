import { useScreenSizes } from "@/hooks/useScreenSizes";
import { Chip } from "@mui/material";

interface StyledChipProps {
  text: string;
  selected: boolean;
  onClick: () => unknown;
}

export const StyledChip = ({ text, selected, onClick }: StyledChipProps) => {
  const { isMobile, isTablet } = useScreenSizes();

  return (
    <Chip
      label={text}
      onClick={onClick}
      clickable
      sx={{
        ".MuiChip-label": {
          padding: "0 !important",
        },

        borderWidth: 1,
        textAlign: "center",
        fontFamily: "Open Sans",
        fontSize: isMobile ? 12 : isTablet ? 14 : 16,
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        borderRadius: 64,
        border: "1px solid var(--Secondary-1, #102d5f)",
        padding: "8px 16px",
        height: isMobile ? 30 : isTablet ? 36 : 40,
        color: selected ? "white" : "var(--Accent-Blue-1, #102d5f)",
        background: selected ? "#102d5f" : "rgba(255, 255, 255, 0)",
      }}
    />
  );
};
