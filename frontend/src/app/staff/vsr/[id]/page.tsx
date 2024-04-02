"use client";
import { VSRIndividualPage } from "@/components/VSRIndividual";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

export default function Individual() {
  useRedirectToLoginIfNotSignedIn();

  return (
    <div>
      <VSRIndividualPage />
    </div>
  );
}
