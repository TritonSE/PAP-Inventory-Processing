import React, { useEffect, useState } from "react";
import styles from "@/components/VeteranForm/SelectAll/styles.module.css";
import { FurnitureItem } from "@/api/FurnitureItems";
import Image from "next/image";

export interface SelectAllProps {
  label: string;
  options: FurnitureItem[];
  onChildDataChange: (arg0: CountMap, arg1: string) => void;
}

interface CountMap {
  [key: string]: number;
}

interface ClickState {
  [key: string]: boolean;
}

const SelectAll = ({ label, options, onChildDataChange }: SelectAllProps) => {
  const [counts, setCounts] = useState<CountMap>({});
  const [clickedStates, setClickedStates] = useState<ClickState>({});

  const sendDataToParent = (counts: CountMap) => {
    // Call the function passed as a prop by the parent
    onChildDataChange(counts, label);
  };

  useEffect(() => {
    const initialCounts = options.reduce<CountMap>((acc, option) => {
      acc[option.name] = 0;
      return acc;
    }, {});
    setCounts(initialCounts);

    const initialClickedStates = options.reduce<ClickState>((acc, option) => {
      acc[option.name] = false;
      return acc;
    }, {});
    setClickedStates(initialClickedStates);
  }, [options]);

  const incrementCount = (itemName: string) => {
    if (counts[itemName] == 0) {
      setClickedStates((prevStates) => ({
        ...prevStates,
        [itemName]: true,
      }));
    }
    setCounts((prevCounts) => ({
      ...prevCounts,
      [itemName]: (prevCounts[itemName] || 0) + 1,
    }));
  };

  useEffect(() => {
    sendDataToParent(counts);
  }, [counts]);

  const decrementCount = (itemName: string) => {
    if (counts[itemName] == 1) {
      setClickedStates((prevStates) => ({
        ...prevStates,
        [itemName]: false,
      }));
    }
    setCounts((prevCounts) => ({
      ...prevCounts,
      [itemName]: Math.max(0, (prevCounts[itemName] || 0) - 1),
    }));
    sendDataToParent(counts);
  };

  const toggleClickState = (itemName: string) => {
    if (counts[itemName] == 0 && !clickedStates[itemName]) {
      incrementCount(itemName);
      setClickedStates((prevStates) => ({
        ...prevStates,
        [itemName]: true,
      }));
    } else if (clickedStates[itemName]) {
      setCounts((prevCounts) => ({
        ...prevCounts,
        [itemName]: 0,
      }));
      setClickedStates((prevStates) => ({
        ...prevStates,
        [itemName]: false,
      }));
    }
  };

  return (
    <div className={styles.wrapperClass}>
      <p className={styles.sectionLabel}>{label}</p>
      <div className={styles.chipContainer}>
        {options.map((option) =>
          option.allowMultiple ? (
            <div
              key={option.name}
              className={`${styles.chip} ${
                clickedStates[option.name] ? styles.chipSelected : styles.chipUnselected
              }`}
              onClick={() => toggleClickState(option.name)}
            >
              <div className={styles.chipContent}>
                <span className={styles.chipTitle}>{option.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    decrementCount(option.name);
                  }}
                  className={styles.math}
                  type="button"
                >
                  <Image
                    className={`${styles.dec} ${
                      clickedStates[option.name] ? styles.decSelected : styles.dec
                    }`}
                    src="/icon_minus.svg"
                    width={22}
                    height={22}
                    alt="dropdown"
                  />
                </button>
                <span>{counts[option.name]}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    incrementCount(option.name);
                  }}
                  className={styles.math}
                  type="button"
                >
                  <Image
                    className={`${styles.inc} ${
                      clickedStates[option.name] ? styles.incSelected : styles.inc
                    }`}
                    src="/icon_plus.svg"
                    width={22}
                    height={22}
                    alt="dropdown"
                  />
                </button>
              </div>
            </div>
          ) : (
            <div
              key={option.name}
              className={`${styles.chip} ${
                clickedStates[option.name] ? styles.chipSelected : styles.chipUnselected
              }`}
              onClick={() => {
                clickedStates[option.name]
                  ? incrementCount(option.name)
                  : decrementCount(option.name);
                toggleClickState(option.name);
              }}
            >
              <div className={styles.chipContent}>
                <span className={styles.chipTitle}>{option.name}</span>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default SelectAll;
