import styles from "@/components/VSRTable/FilterChip/styles.module.css";

const FilterChip = ({ label, onDelete }: { label: string; onDelete: () => void }) => {
  return (
    <div className={styles.filterChip}>
      <span>{label}</span>
      <button onClick={onDelete}>X</button>
    </div>
  );
};

export default FilterChip;
