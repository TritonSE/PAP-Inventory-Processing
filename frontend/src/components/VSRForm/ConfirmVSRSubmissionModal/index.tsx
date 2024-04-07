import { BaseModal } from "@/components/shared/BaseModal";

interface ConfirmVSRSubmissionModalProps {
  isOpen: boolean;
  onClose: () => unknown;
}

/**
 * A modal that displays a confirmation that a VSR was submitted successfully.
 */
export const ConfirmVSRSubmissionModal = ({ isOpen, onClose }: ConfirmVSRSubmissionModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Submitted successfully!"
      content={
        <>
          A copy of your submitted VSR form has been sent to your email. We&apos;ll review it
          promptly and respond via email as soon as possible. Allow up to 48 business hours to be
          contacted for appointment scheduling.
          <br></br>
          <br></br>
          Please check your spam folder if you don&apos;t receive a response within 48 business
          hours.
          <br></br>
          <br></br>
          If you need to make changes to your VSR form, submit another VSR form and let us know at{" "}
          <a
            style={{ textDecorationLine: "underline", fontStyle: "italic" }}
            href="veteran@patriotsandpaws.org"
          >
            veteran@patriotsandpaws.org.
          </a>
        </>
      }
      bottomRow={null}
    />
  );
};
