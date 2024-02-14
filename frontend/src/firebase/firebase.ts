import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import env from "@/util/validateEnv";

export const initFirebase = () => {
  if (!env.NEXT_PUBLIC_FIREBASE_SETTINGS) {
    throw new Error("Cannot get firebase settings");
  }

  const firebaseConfig = env.NEXT_PUBLIC_FIREBASE_SETTINGS;

  const app = initializeApp(JSON.parse(firebaseConfig));
  const auth = getAuth(app);

  return { app, auth };
};
