// EditPage.tsx
import React, { useEffect, useState } from "react";
import styles from "src/components/EditVSR/editPage.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { VSR, UpdateVSRRequest, updateVSR, getVSR } from "@/api/VSRs";



interface EditPageProps {
  vsr: VSR; 
}

const EditPage: React.FC<EditPageProps> = ({ vsr }) => {
  const { register, handleSubmit, setValue } = useForm<VSR>();
  const [isEditing, setIsEditing] = useState(false);
  const [vsrData, setVSRData] = useState<VSR | null>(null);

  //when component is mounted fetch the VSR data
  useEffect(() => {
    const response = await getVSR(vsr._id);
    if (response.success) {
      setVSRData(response.data);
    }
    });

  const handleEditClick = () =>{
    setIsEditing(!isEditing);
  }
  const onSubmit: SubmitHandler<VSR> = async (data) => {
    const response = await updateVSR(data);
    if (response.success) {
      setVSRData(response.data);
    }
  }




  
