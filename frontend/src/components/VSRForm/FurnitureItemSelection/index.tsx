import { FurnitureItem } from "@/api/FurnitureItems";
import { FurnitureInput } from "@/api/VSRs";
import styles from "@/components/VSRForm/FurnitureItemSelection/styles.module.css";
import Image from "next/image";

export interface FurnitureItemSelectionProps {
  furnitureItem: FurnitureItem;
  selection?: FurnitureInput;
  onChangeSelection?: (newSelection: FurnitureInput) => unknown;
  isActive: boolean;
}

/**
 * An input component that enables a user to select one or more of a single furniture
 * item on the VSR form.
 */
export const FurnitureItemSelection = ({
  furnitureItem,
  selection,
  onChangeSelection,
  isActive,
}: FurnitureItemSelectionProps) => {
  const handleChipClicked = () => {
    if (isActive) {
      if (selection!.quantity === 0) {
        incrementCount();
      } else if (!furnitureItem.allowMultiple) {
        onChangeSelection!({ ...selection!, quantity: 0 });
      }
    }
  };

  const incrementCount = () => {
    if (isActive) {
      onChangeSelection!({ ...selection!, quantity: selection!.quantity + 1 });
    }
  };

  const decrementCount = () => {
    if (isActive) {
      if (selection!.quantity > 0) {
        onChangeSelection!({ ...selection!, quantity: selection!.quantity - 1 });
      }
    }
  };

  return (
    <div
      className={`${styles.chip} ${
        selection && selection.quantity > 0 ? styles.chipSelected : styles.chipUnselected
      }`}
      onClick={handleChipClicked}
    >
      <div className={styles.chipContent}>
        <span className={styles.chipTitle}>{furnitureItem.name}</span>
        {furnitureItem.allowMultiple ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                decrementCount();
              }}
              className={styles.math}
              type="button"
            >
              <Image
                className={`${styles.dec} ${
                  selection && selection.quantity > 0 ? styles.decSelected : styles.dec
                }`}
                src="/icon_minus.svg"
                width={22}
                height={22}
                alt="dropdown"
              />
            </button>
            <span className={styles.quantityText}>{selection?.quantity ?? 0}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                incrementCount();
              }}
              className={styles.math}
              type="button"
            >
              <Image
                className={`${styles.inc} ${
                  selection && selection.quantity > 0 ? styles.incSelected : styles.inc
                }`}
                src="/icon_plus.svg"
                width={22}
                height={22}
                alt="dropdown"
              />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};
