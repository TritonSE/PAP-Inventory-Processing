/**
 * This file contains the configuration for firebase
 * It exports a firebase auth object which will allow users
 * to access any firebase services. For this project we will use
 * firebase to for authentication.
 */

import * as firebase from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { InternalError } from "src/errors/internal";
import env from "src/util/validateEnv";

export const initFirebase = () => {
  let serviceAccountKey = "";

  if (!env.SERVICE_ACCOUNT_KEY) {
    throw InternalError.NO_SERVICE_ACCOUNT_KEY;
  } else {
    serviceAccountKey = env.SERVICE_ACCOUNT_KEY;
  }

  firebase.initializeApp({
    credential: firebase.cert(JSON.parse(serviceAccountKey)),
  });

  const firebaseAuth = getAuth();

  return firebaseAuth;
};
