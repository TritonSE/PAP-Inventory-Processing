import styles from "@/components/VSRTable/FilterChip/styles.module.css";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import Image from "next/image";

interface FilterChipProps {
  label: string;
  onDelete: () => void;
}

const FilterChip = ({ label, onDelete }: FilterChipProps) => {
  const { isTablet } = useScreenSizes();
  const iconSize = isTablet ? 18 : 24;

  return (
    <div className={styles.filterChip}>
      <p className={styles.filterText}>{label}</p>
      <button onClick={onDelete} className={styles.deleteButton}>
        <Image src="/ic_close_clear.svg" alt="close" width={iconSize} height={iconSize} />
      </button>
    </div>
  );
};

export default FilterChip;
