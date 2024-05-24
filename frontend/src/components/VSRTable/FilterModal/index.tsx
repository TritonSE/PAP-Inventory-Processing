import styles from "@/components/VSRTable/FilterModal/styles.module.css";
import { useState } from "react";
import { BaseModal } from "@/components/shared/BaseModal";
import { Button } from "@/components/shared/Button";
import TextField from "@/components/shared/input/TextField";
import MultipleChoice from "@/components/shared/input/MultipleChoice";
import { incomeOptions } from "@/constants/fieldOptions";
import FilterChip from "@/components/VSRTable/FilterChip";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInputEntered: (zipCodes: string[] | undefined, incomeLevel: string | undefined) => void;
  onResetFilters: () => void;
}

const FilterModal = ({ isOpen, onClose, onInputEntered, onResetFilters }: FilterModalProps) => {
  if (!isOpen) return null;

  const finalZipCodes: string[] = [];
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [currentZipCode, setCurrentZipCode] = useState("");

  const [income, setIncome] = useState<string>("");

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setZipCodes(e.target.value.split(",").map((zip) => zip.trim())); // Assuming zip codes are comma-separated
    setCurrentZipCode(e.target.value);
  };

  const handleApplyFilter = () => {
    // Pass the entered zip codes to the parent component when the user applies the filter
    zipCodes.forEach((zipCode) => {
      finalZipCodes.push(zipCode);
    });
    if (currentZipCode.trim() !== "") {
      finalZipCodes.push(currentZipCode);
    }
    onInputEntered(finalZipCodes, income);
    onClose(); // Close the modal
  };

  const handleReset = () => {
    onResetFilters();
    onClose(); // Close the modal
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (currentZipCode.trim()) {
        setZipCodes((prevZipCodes) => [...prevZipCodes, currentZipCode.trim()]);
        setCurrentZipCode(""); // Clear the text field after adding the zipcode
      }
      event.preventDefault(); // Prevent the default action of the Enter key
    }
  };

  const handleZipCodeEnter = () => {
    if (currentZipCode.trim()) {
      setZipCodes((prevZipCodes) => [...prevZipCodes, currentZipCode.trim()]);
      setCurrentZipCode(""); // Clear the text field after adding the zipcode
    }
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
            <div className={styles.zipCodeContainer}>
              <TextField
                label="Zip Code(s)"
                variant="outlined"
                type="number"
                placeholder="e.g. 92093"
                onChange={handleZipCodeChange}
                onKeyDown={handleKeyDown}
                value={currentZipCode}
                required={false}
              />
              <Button
                variant="primary"
                outlined={false}
                text="Enter"
                onClick={handleZipCodeEnter}
                className={styles.enterButton}
              />
            </div>
            <br />
            <div className={styles.filterChips}>
              {zipCodes?.map((zipCode) => (
                <FilterChip
                  label={"Zip Code: " + zipCode}
                  key={zipCode}
                  onDelete={function (): void {
                    setZipCodes(zipCodes?.filter((z) => z !== zipCode));
                  }}
                />
              ))}
            </div>
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
