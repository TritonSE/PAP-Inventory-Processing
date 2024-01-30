import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

if (!process.env.NEXT_PUBLIC_FIREBASE_SETTINGS) {
  throw new Error("Cannot get firebase settings");
}

const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_SETTINGS;

export const app = initializeApp(JSON.parse(firebaseConfig));
export const auth = getAuth(app);

export const initFirebase = () => {
  return { app, auth };
};
