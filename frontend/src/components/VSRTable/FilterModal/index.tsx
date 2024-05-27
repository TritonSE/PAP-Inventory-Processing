import styles from "@/components/VSRTable/FilterModal/styles.module.css";
import { useEffect, useState } from "react";
import { Button } from "@/components/shared/Button";
import TextField from "@/components/shared/input/TextField";
import MultipleChoice from "@/components/shared/input/MultipleChoice";
import { incomeOptions } from "@/constants/fieldOptions";
import FilterChip from "@/components/VSRTable/FilterChip";
import { ClickAwayListener, Popper } from "@mui/material";

interface FilterModalProps {
  anchorElement: HTMLElement | null;
  initialZipCodes: string[];
  initialIncomeLevel: string;
  onClose: () => unknown;
  onInputEntered: (zipCodes: string[] | undefined, incomeLevel: string | undefined) => void;
  onResetFilters: () => void;
}

const FilterModal = ({
  anchorElement,
  initialZipCodes,
  initialIncomeLevel,
  onClose,
  onInputEntered,
  onResetFilters,
}: FilterModalProps) => {
  const [zipCodes, setZipCodes] = useState(initialZipCodes);
  const [currentZipCode, setCurrentZipCode] = useState("");
  const [zipCodeError, setZipCodeError] = useState(false);

  const [income, setIncome] = useState(initialIncomeLevel);

  useEffect(() => {
    setZipCodes(initialZipCodes);
    setIncome(initialIncomeLevel);
  }, [initialZipCodes, initialIncomeLevel]);

  const applyButtonEnabled = zipCodes.length > 0 || currentZipCode !== "" || income !== "";

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentZipCode(e.target.value);
    setZipCodeError(false);
  };

  const handleApplyFilter = () => {
    if (currentZipCode.trim() !== "" && currentZipCode.length !== 5) {
      setZipCodeError(true);
      return;
    }
    // Pass the entered zip codes to the parent component when the user applies the filter
    onInputEntered(
      [...zipCodes, ...(currentZipCode.trim() === "" ? [] : [currentZipCode.trim()])],
      income,
    );
    setCurrentZipCode("");
    setZipCodeError(false);
    onClose(); // Close the modal
  };

  const handleReset = () => {
    onResetFilters();
    setCurrentZipCode("");
    setZipCodeError(false);
    onClose(); // Close the modal
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (currentZipCode.trim()) {
        if (currentZipCode.length === 5) {
          setZipCodeError(false);
          setZipCodes((prevZipCodes) => [...prevZipCodes, currentZipCode.trim()]);
          setCurrentZipCode(""); // Clear the text field after adding the zipcode
        } else {
          setZipCodeError(true);
        }
      }
      event.preventDefault(); // Prevent the default action of the Enter key
    }
  };

  const renderPopper = () => (
    <Popper open={anchorElement !== null} anchorEl={anchorElement} placement="bottom-end">
      <div className={styles.root}>
        <MultipleChoice
          label="Income Level"
          options={incomeOptions}
          value={income}
          onChange={(newValue: string | string[]) =>
            setIncome(Array.isArray(newValue) ? newValue[0] : newValue)
          }
          required={false}
        />
        <TextField
          label="Zip Code(s)"
          variant="outlined"
          type="number"
          placeholder="e.g. 92093"
          onChange={handleZipCodeChange}
          onKeyDown={handleKeyDown}
          value={currentZipCode}
          required={false}
          error={zipCodeError}
          helperText={zipCodeError ? "Please enter a valid zip code" : ""}
        />
        {zipCodes && zipCodes.length > 0 ? (
          <div className={styles.filterChips}>
            {zipCodes?.map((zipCode) => (
              <FilterChip
                label={zipCode}
                key={zipCode}
                onDelete={() => {
                  setZipCodes(zipCodes?.filter((z) => z !== zipCode));
                }}
              />
            ))}
          </div>
        ) : null}

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
            className={`${styles.button} ${applyButtonEnabled ? "" : styles.disabled}`}
            disabled={!applyButtonEnabled}
          />
        </div>
      </div>
    </Popper>
  );

  return anchorElement === null ? (
    renderPopper()
  ) : (
    <ClickAwayListener onClickAway={onClose}>{renderPopper()}</ClickAwayListener>
  );
};

export default FilterModal;
