"use client";

import { initializeApp } from "firebase/app";
import { applyActionCode, getAuth, verifyPasswordResetCode } from "firebase/auth";
import { useEffect } from "react";
import env from "@/util/validateEnv";

const PasswordReset: React.FC = () => {
  useEffect(() => {
    console.log("Fetching reset info");
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const actionCode = urlParams.get("oobCode");
    const firebaseConfig = env.NEXT_PUBLIC_FIREBASE_SETTINGS;

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    console.log(actionCode);
    if (mode == "resetPassword") {
      // verify email
      if (actionCode != null) {
        verifyPasswordResetCode(auth, actionCode).then((email) => {
          console.log("Password reset code verified");
        });
      }
    }
  }, []);

  return <div>hi</div>;
};
export default PasswordReset;
