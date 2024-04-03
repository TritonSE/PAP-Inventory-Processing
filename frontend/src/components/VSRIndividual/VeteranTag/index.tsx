import styles from "@/components/VSRIndividual/VeteranTag/styles.module.css";
import { type VSR } from "@/api/VSRs";

export interface AdditionalInfoProps {
  vsr: VSR;
  isEditing: boolean;
}

/**
 * A component that displays the veteran's name at the top of the VSR individual page.
 */
export function VeteranTag({ vsr, isEditing }: AdditionalInfoProps) {
  return (
    <div className={styles.items} style={isEditing ? { opacity: 0.5 } : {}}>
      {vsr.name && vsr.name.length > 0 ? <span> {vsr.name} </span> : <span></span>}
    </div>
  );
}
