import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import styles from "@/components/VeteranForm/SelectAll/styles.module.css";
import { FurnitureItem } from "@/api/FurnitureItems";

export interface SelectAllProps {
  label: string;
  options: FurnitureItem[];
}

// Define a type for the counts state with an index signature
type CountsState = {
  [optionName: string]: number;
};

const SelectAll = ({ label, options }: SelectAllProps) => {
  // Initialize counts state with all items starting at 0, with the correct type
  const [counts, setCounts] = useState<CountsState>(() => {
    const initialCounts: CountsState = {};
    options.forEach((option) => {
      initialCounts[option.name] = 0;
    });
    return initialCounts;
  });

  const incrementCount = (optionName: string) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [optionName]: (prevCounts[optionName] || 0) + 1, // Fallback to 0 if undefined
    }));
  };

  const decrementCount = (optionName: string) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [optionName]: Math.max(0, (prevCounts[optionName] || 0) - 1), // Fallback to 0 if undefined, prevents negative counts
    }));
  };

  return (
    <div className={styles.wrapperClass}>
      <p>{label}</p>
      <div className={styles.chipContainer}>
        {options.map((option) =>
          option.allowMultiple ? (
            <div key={option.name} className={styles.chip}>
              <span>{option.name}</span>
              <button onClick={() => decrementCount(option.name)} className={styles.button}>
                -
              </button>
              <div>{counts[option.name]}</div>
              <button onClick={() => incrementCount(option.name)} className={styles.button}>
                +
              </button>
            </div>
          ) : (
            <div key={option.name} className={styles.chip}>
              {option.name}
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default SelectAll;
