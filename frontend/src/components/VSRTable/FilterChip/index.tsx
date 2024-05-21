import styles from "@/components/VSRTable/FilterChip/styles.module.css";
import Image from "next/image";

interface FilterChipProps {
  label: string;
  onDelete: () => void;
}

const FilterChip = ({ label, onDelete }: FilterChipProps) => {
  return (
    <div className={styles.filterChip}>
      <p className={styles.filterText}>{label}</p>
      <button onClick={onDelete} className={styles.deleteButton}>
        <Image src="/ic_close_clear.svg" alt="close" width={24} height={24} />
      </button>
    </div>
  );
};

export default FilterChip;
