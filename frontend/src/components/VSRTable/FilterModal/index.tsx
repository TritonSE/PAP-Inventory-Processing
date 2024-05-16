import styles from "@/components/VSRTable/FilterModal/styles.module.css";
import { useState } from "react";
import { BaseModal } from "@/components/shared/BaseModal";
import { Button } from "@/components/shared/Button";
import TextField from "@/components/shared/input/TextField";
import MultipleChoice from "@/components/shared/input/MultipleChoice";
import { incomeOptions } from "@/constants/fieldOptions";
import { on } from "events";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInputEntered: (zipCodes: string[] | undefined, incomeLevel: string | undefined) => void;
  onResetFilters: () => void;
}

const FilterModal = ({ isOpen, onClose, onInputEntered, onResetFilters }: FilterModalProps) => {
  if (!isOpen) return null;

  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [income, setIncome] = useState<string>("");

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCodes(e.target.value.split(",").map((zip) => zip.trim())); // Assuming zip codes are comma-separated
  };

  const handleApplyFilter = () => {
    // Pass the entered zip codes to the parent component when the user applies the filter
    onInputEntered(zipCodes, income);
    onClose(); // Close the modal
  };

  const handleReset = () => {
    onResetFilters();
    onClose(); // Close the modal
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title=""
        content={
          <div>
            <MultipleChoice
              label="Select a Category"
              options={incomeOptions}
              value={income}
              onChange={(newValue: string | string[]) =>
                setIncome(Array.isArray(newValue) ? newValue[0] : newValue)
              }
              required
            ></MultipleChoice>
            <br />
            <TextField
              label="Zip Code(s)"
              variant="outlined"
              placeholder="e.g. 92093"
              onChange={handleZipCodeChange}
              required={false}
            />
          </div>
        }
        bottomRow={
          <div className={styles.buttonContainer}>
            <Button
              variant="error"
              outlined
              text="Reset Selection"
              onClick={handleReset}
              className={styles.button}
            />
            <Button
              variant="primary"
              outlined={false}
              text="Apply Filters"
              onClick={handleApplyFilter}
              className={styles.button}
            />
          </div>
        }
      />
    </>
  );
};

export default FilterModal;
