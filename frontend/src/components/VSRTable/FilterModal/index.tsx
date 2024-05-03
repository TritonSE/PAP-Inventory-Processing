import styles from "@/components/VSRTable/FilterModal/styles.module.css";
import Image from "next/image";
import ReactDOM from "react-dom";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterModal = ({ isOpen, onClose }: FilterModalProps) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>
          X
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default FilterModal;
