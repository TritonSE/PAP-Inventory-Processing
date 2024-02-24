"use client";

import React from "react";
import "src/components/deletevsr.css";
import { useRouter } from "next/navigation";

const deleteVSR = () => {
  const router = useRouter();

  const deleteForms = async (ids: [string]) => {
    try {
      let count = 0;
      for (const id of ids) {
        const response = await fetch(`http://localhost/api/vsr/${id}`, {
          method: "DELETE",
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Failed to delete VSR");
          break;
        }
        count = count + 1;
      }
      if (count != ids.length) {
        console.error("Some VSR's not deleted.");
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("deleting VSR's failed: ", error);
    }
  };

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <body>
      <div className="delete-div">
        <button className="close-button">X</button>
        <div className="delete-container">
          <div className="delete-header"> Delete VSR(s) </div>
          <div className="delete-text">
            Deleted VSR’s cannot be recovered. Are you sure you’d like to delete the selected VSR
            forms (1)?
          </div>
          <form onSubmit={handleDelete}>
            <div className="button-container">
              <button className="cancel-delete-button"> Cancel </button>
              <button type="submit" className="delete-button">
                Delete VSR(s)
              </button>
            </div>
          </form>
        </div>
      </div>
    </body>
  );
};

export default deleteVSR;
