import React, { useEffect, useState } from "react";
import styles from "@/components/EditVSR/editPage.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { VSR, UpdateVSRRequest, updateVSR, getVSR } from "@/api/VSRs";
import { useParams } from "next/navigation";

interface EditPageProps {
  vsr: VSR;
  onUpdateVSR: (vsr: VSR) => void;
}

const EditPage: React.FC<EditPageProps> = ({ vsr, onUpdateVSR }) => {
  const { register, handleSubmit, setValue } = useForm<VSR>();
  const [isEditing, setIsEditing] = useState(false);
  const [vsrData, setVSRData] = useState<VSR>({} as VSR);
  const { id } = useParams(); // Destructure id from useParams()

  // Fetch VSR data when the component mounts
  useEffect(() => {
    const fetchVSR = async () => {
      try {
        const response = await getVSR(id as string);
        if (response.success) {
          const vsrData = response.data;
          // Set default values for all form fields using setValue from react-hook-form
          setValue("name", vsrData.name);
          setValue("gender", vsrData.gender);
          setValue("age", vsrData.age);
          setValue("maritalStatus", vsrData.maritalStatus);
          setValue("spouseName", vsrData.spouseName || ""); // Make sure to handle optional fields properly
          setValue("agesOfBoys", vsrData.agesOfBoys);
          setValue("agesOfGirls", vsrData.agesOfGirls);
          setValue("ethnicity", vsrData.ethnicity);
          setValue("employmentStatus", vsrData.employmentStatus);
          setValue("incomeLevel", vsrData.incomeLevel);
          setValue("sizeOfHome", vsrData.sizeOfHome);
          setValue("streetAddress", vsrData.streetAddress);
          setValue("city", vsrData.city);
          setValue("state", vsrData.state);
          setValue("zipCode", vsrData.zipCode);
          setValue("phoneNumber", vsrData.phoneNumber);
          setValue("email", vsrData.email);
          setValue("branch", vsrData.branch);
          setValue("conflicts", vsrData.conflicts);
          setValue("dischargeStatus", vsrData.dischargeStatus);
          setValue("serviceConnected", vsrData.serviceConnected);
          setValue("lastRank", vsrData.lastRank);
          setValue("militaryId", vsrData.militaryId);
          setValue("petCompanion", vsrData.petCompanion);
          setValue("bedroomFurnishing", vsrData.bedroomFurnishing);
          setValue("bathroomFurnishing", vsrData.bathroomFurnishing);
          setValue("kitchenFurnishing", vsrData.kitchenFurnishing);
          setValue("livingRoomFurnishing", vsrData.livingRoomFurnishing);
          setValue("diningRoomFurnishing", vsrData.diningRoomFurnishing);
          setValue("otherFurnishing", vsrData.otherFurnishing);
          setValue("dateReceived", vsrData.dateReceived);
          setValue("lastUpdated", vsrData.lastUpdated);
          setValue("status", vsrData.status);
          setValue("hearFrom", vsrData.hearFrom);
        }
      } catch (error) {
        console.error("Error fetching VSR:", error);
      }
    };
    fetchVSR();
  }, [id, setValue]);

  // Handle form submission
  const onSubmit: SubmitHandler<VSR> = async (formData) => {
    try {
      // Perform updateVSR request
      await updateVSR(formData);
      // Update state with updated VSR data
      setVSRData(formData);
      // Invoke callback to update VSR data in parent component if needed
      onUpdateVSR(formData);
      // Set editing state to false
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating VSR:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Render form fields here */}
        <button type="submit">Submit</button>
      </form>
      <button onClick={handleEditClick}>{isEditing ? "Cancel" : "Edit"}</button>
    </div>
  );
};

export default EditPage;
