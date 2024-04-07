"use client";

import { ErrorPage } from "@/components/Errors/ErrorPage";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import Image from "next/image";

const PAP_EMAIL = "info@patriotsandpaws.org";

/**
 * Page that is shown if our web app throws a 500 Internal Error (e.g. our JavaScript crashes)
 */
const InternalError500Page = () => {
  const { isMobile, isTablet } = useScreenSizes();

  return (
    <ErrorPage
      imageComponent={
        <Image
          priority
          src="/errors/500_internal_error.svg"
          alt="500 Internal Error"
          width={isMobile ? 100 : isTablet ? 220 : 320}
          height={isMobile ? 69 : isTablet ? 150 : 220}
        />
      }
      title="Internal Error"
      content={[
        "Something went wrong on our end. Our experts are trying to fix the problem.",
        "Please refresh the page or wait for some time.",
        <>
          If you need immediate help while the system is down, please email our staff at{" "}
          <a href={`mailto:${PAP_EMAIL}`}>{PAP_EMAIL}.</a>
        </>,
        "Error Code: 500",
      ]}
    />
  );
};

export default InternalError500Page;
