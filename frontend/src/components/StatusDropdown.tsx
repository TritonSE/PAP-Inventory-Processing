import * as React from "react";
import styles from "src/components/StatusDropdown.module.css";

export default function StatusDropdown() {
  return (
    <div className={styles.dropdowndiv}>
      <text className={styles.text}>Status:</text>

      {/* <label for="cars">Choose a car:</label> */}

      {/* <select name="Status" id="status">
        <option value="Pending">Pending</option>
        <option value="Appointment Schedule">Appointment Schedule</option>
        <option value="Approved">Approved</option>
        <option value="Resubmit">Resubmit</option>
        <option value="No-show / Incomplete">No-show / Incomplete</option>
        <option value="Archived">Archived</option>
      </select> */}

      {/* <div className={styles.dropdown}>
        <span>Mouse over me</span>
        <div className={styles.dropdowncontent}>
          <p>Hello World!</p>
        </div>
    </div> */}
    </div>
  );
}
