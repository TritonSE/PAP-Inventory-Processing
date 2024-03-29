import { useMediaQuery } from "@mui/material";

/**
 * A hook to determine the screen size (desktop vs. tablet vs. mobile)
 */
export const useScreenSizes = () => {
  const isMobile = useMediaQuery("@media screen and (max-width: 550px)");
  const isTablet = useMediaQuery("@media screen and (max-width: 850px)");

  return {
    isMobile,
    isTablet,
  };
};
