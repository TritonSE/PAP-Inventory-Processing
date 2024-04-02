"use client";

import { ErrorPage } from "@/components/Errors/ErrorPage";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import Image from "next/image";

const VSR_URL = "/vsr";

/**
 * Page that is shown on any URL that does not match one of our defined frontend routes.
 */
const NotFound404Page = () => {
  const { isMobile, isTablet } = useScreenSizes();

  return (
    <ErrorPage
      imageComponent={
        <Image
          priority
          src="/errors/404_not_found.svg"
          alt="404 Not Found"
          width={isMobile ? 232 : isTablet ? 310 : 464}
          height={isMobile ? 90 : isTablet ? 120 : 180}
        />
      }
      title="Page Not Found"
      content={[
        "Sorry, we couldn't find the page you're looking for.",
        <>
          If you would like to submit a VSR form, please click{" "}
          {
            <a
              style={{
                textDecoration: "underline",
                fontStyle: "italic",
              }}
              href={VSR_URL}
            >
              here
            </a>
          }
          .
        </>,
        "Please ensure that the URL is correct and try again.",
        "Error Code: 404",
      ]}
    />
  );
};

export default NotFound404Page;
