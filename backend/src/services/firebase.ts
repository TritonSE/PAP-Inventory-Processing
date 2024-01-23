/**
 * Setting up Firebase config
 */
import * as firebase from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(process.env.BACKEND_FIREBASE_SETTINGS as string);
firebase.initializeApp({
  credential: firebase.cert(serviceAccount) as firebase.Credential,
});

export const auth = getAuth();

export default firebase;
