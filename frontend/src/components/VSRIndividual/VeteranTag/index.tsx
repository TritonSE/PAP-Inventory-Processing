import styles from "src/components/VSRIndividual/VeteranTag/styles.module.css";
import { type VSR } from "@/api/VSRs";

export interface AdditionalInfoProps {
  vsr: VSR;
}

/**
 * A component that displays the veteran's name at the top of the VSR individual page.
 */
export function VeteranTag({ vsr }: AdditionalInfoProps) {
  return (
    <div className={styles.items}>
      {vsr.name && vsr.name.length > 0 ? <span> {vsr.name} </span> : <span></span>}
    </div>
  );
}
