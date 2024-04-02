import { StatusOption } from "@/components/shared/StatusDropdown";
import styles from "@/components/shared/StatusChip/styles.module.css";

interface StatusChipProps {
  status: StatusOption;
}

/**
 * A component that displays a chip with a VSR's status, with a certain text
 * and background color based on the status
 */
export const StatusChip = ({ status }: StatusChipProps) => {
  return (
    <div className={styles.statusChip} style={{ backgroundColor: status.color }}>
      {status.value}
    </div>
  );
};
