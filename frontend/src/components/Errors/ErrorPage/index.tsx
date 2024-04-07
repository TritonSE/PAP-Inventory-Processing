import styles from "@/components/Errors/ErrorPage/styles.module.css";
import { ReactNode } from "react";

interface ErrorPageProps {
  imageComponent: ReactNode;
  title: string;
  content: (string | ReactNode)[];
}

/**
 * A component that renders an error page with a given image, title, and content
 */
export const ErrorPage = ({ imageComponent, title, content }: ErrorPageProps) => {
  return (
    <div className={styles.root}>
      {imageComponent}
      <h1 className={styles.title}>{title}</h1>
      {content.map((paragraph, index) => (
        <p key={index} className={styles.content}>
          {paragraph}
        </p>
      ))}
    </div>
  );
};
