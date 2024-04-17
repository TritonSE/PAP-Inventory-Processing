"use client";

import { initializeApp } from "firebase/app";
import { applyActionCode, getAuth } from "firebase/auth";
import { useEffect } from "react";
import env from "@/util/validateEnv";

const PasswordReset: React.FC = () => {
  console.log("Fetching reset info");
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  const actionCode = urlParams.get("oobCode");
  const firebaseConfig = env.NEXT_PUBLIC_FIREBASE_SETTINGS;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  if (mode == "resetPassword") {
    // verify email
    if (actionCode != null) {
      applyActionCode(auth, actionCode)
        .then((response) => {
          console.log("Email verified: " + response);
        })
        .catch((error) => {
          console.error("Password reset - email verification error: ", error);
        });
    }
  }

  return <div>hi</div>;
};
export default PasswordReset;
