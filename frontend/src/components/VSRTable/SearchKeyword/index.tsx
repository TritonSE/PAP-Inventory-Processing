import styles from "@/components/VSRTable/SearchKeyword/styles.module.css";
import Image from "next/image";
import { UserContext } from "@/contexts/userContext";
import React, { useContext, useState } from "react";
import { getAllVSRs } from "@/api/VSRs";

/**
 * A component for the Search input above the VSR table.
 */

interface SearchProps {
  // eslint-disable-next-line @typescript-eslint/ban-types
  fetchFunction: Function;
}

export const SearchKeyword = ({ fetchFunction }: SearchProps) => {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (event: { target: { value: string } }) => {
    const input = event.target.value;
    setSearchInput(input);
    fetchFunction(input);
  };

  return (
    <div className={styles.search}>
      {/* image */}
      <Image width={24} height={24} src="/search.svg" alt="Search" className={styles.icons} />
      <input
        className={styles.searchInput}
        placeholder="Search Keyword..."
        value={searchInput}
        onChange={handleInputChange}
      />
    </div>
  );
};

// export default function SearchKeyword(fetchFunction: (input: string) => void) {
//   const { firebaseUser } = useContext(UserContext);
//   const [searchInput, setSearchInput] = useState("");

//   const handleInputChange = (event: { target: { value: string } }) => {
//     const input = event.target.value;
//     setSearchInput(input);
//     fetchFunction(input);
//   };

//   // const fetchSearchedVSRs = (input) => {
//   //   if (!firebaseUser) {
//   //     return;
//   //   }

//   //   firebaseUser?.getIdToken().then((firebaseToken) => {
//   //     getAllVSRs(firebaseToken, input).then((result) => {
//   //       if (result.success) {

//   //       }
//   //     });
//   //   });
//   // };

//   return (
//     <div className={styles.search}>
//       {/* image */}
//       <Image width={24} height={24} src="/search.svg" alt="Search" className={styles.icons} />
//       <input
//         className={styles.searchInput}
//         placeholder="Search Keyword..."
//         value={searchInput}
//         onChange={handleInputChange}
//       />
//     </div>
//   );
// }
