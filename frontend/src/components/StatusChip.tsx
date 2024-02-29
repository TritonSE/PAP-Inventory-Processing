import { StatusOption } from "@/components/VSRIndividual/DropdownDetail";
import styles from "@/components/StatusChip.module.css";

interface StatusChipProps {
  status: StatusOption;
}

export const StatusChip = ({ status }: StatusChipProps) => {
  return (
    <div className={styles.statusChip} style={{ backgroundColor: status.color }}>
      {status.value}
    </div>
  );
};
