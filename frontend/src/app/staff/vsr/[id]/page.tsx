"use client";
import { Page } from "@/components/VSRIndividual";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

export default function Individual() {
  useRedirectToLoginIfNotSignedIn();

  return (
    <div>
      <Page></Page>
    </div>
  );
}
