import styles from "@/components/VSRTable/FilterModal/styles.module.css";
import { useState } from "react";
import Image from "next/image";
import ReactDOM from "react-dom";
import { BaseModal } from "@/components/shared/BaseModal";
import { Button } from "@/components/shared/Button";
import TextField from "@/components/shared/input/TextField";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onZipCodesEntered: (zipCodes: string[]) => void;
}

const FilterModal = ({ isOpen, onClose, onZipCodesEntered }: FilterModalProps) => {
  if (!isOpen) return null;

  const [zipCodes, setZipCodes] = useState<string[]>([]);

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCodes(e.target.value.split(",").map((zip) => zip.trim())); // Assuming zip codes are comma-separated
  };

  const handleApplyFilter = () => {
    // Pass the entered zip codes to the parent component when the user applies the filter
    onZipCodesEntered(zipCodes);
    onClose(); // Close the modal
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title=""
        content={
          <TextField
            label="Zip Code(s)"
            variant="outlined"
            placeholder="e.g. 92093"
            onChange={handleZipCodeChange}
            required={false}
          />
        }
        bottomRow={
          <div className={styles.buttonContainer}>
            <Button
              variant="error"
              outlined
              text="Reset Selection"
              onClick={onClose}
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
