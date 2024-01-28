import Image from "next/image";
import styles from "@/app/page.module.css";
import TextField from '@mui/material/TextField';

export default function Home() {
  return (
    <main style={{ backgroundColor: 'white' }}>
      <div>
      <TextField label='Name' variant='outlined'/>
      <TextField label='Name' variant='outlined'/>
      <TextField label='Name' variant='outlined'/>
      </div>
    </main>
  );
}
