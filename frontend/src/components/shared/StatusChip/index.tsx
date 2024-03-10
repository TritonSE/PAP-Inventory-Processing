import { StatusOption } from "@/components/shared/StatusDropdown";
import styles from "@/components/shared/StatusChip/styles.module.css";

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
