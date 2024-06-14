import { useEffect } from "react";

interface UseDirtyFormProps {
  isDirty: boolean;
}

/**
 * A hook that conditionally marks the page as dirty so the browser will display
 * a confirmation dialog when the user tries to leave or reload it.
 */
export const useDirtyForm = ({ isDirty }: UseDirtyFormProps) => {
  /**
   * Returning true from this event handler tells the browser to display a confirmation
   * dialog telling the user they have unsaved changes.
   */
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (!isDirty) {
      return false;
    }

    e.preventDefault();
    e.returnValue = true;
    return true;
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
};
