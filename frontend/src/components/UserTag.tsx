import React, { useEffect, useState } from "react";
import styles from "src/components/UserTag.module.css";
import { getVSR, type VSR } from "@/api/VSRs";
import { useParams } from "next/navigation";

export interface UserTagProps {
  // vsr: VSR | undefined;
}

export function UserTag(/*{ vsr }: UserTagProps*/) {
  const [vsr, setVSR] = useState<VSR>({} as VSR);
  const { id } = useParams();

  useEffect(() => {
    getVSR(id as string).then((result) => {
      if (result.success) {
        setVSR(result.data);
      }
    });
  }, [id]);
  return (
    <div className={styles.items}>
      {vsr === undefined ? <span>Not assigned</span> : <span> {vsr.name} </span>}
    </div>
  );
}
