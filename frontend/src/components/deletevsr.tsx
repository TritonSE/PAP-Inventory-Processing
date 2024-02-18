import React from "react";
import "./deletevsr.module.css";

export default function deleteVSR() {
  return (
    <body>
      <div className="delete-div">
        <button className="close-button">X</button>
        <div className="delete-container">
          <div className="delete-header">Delete VSR(s)</div>
        </div>
      </div>
    </body>
  );
}
