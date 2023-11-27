/**
 * Parses .env parameters and ensures they are of required types and are not missing.
 * If any .env parameters are missing or of the wrong type, the an error will be thrown.
 */

import { cleanEnv } from "envalid";
import { str, json } from "envalid/dist/validators";

/**
 * Note that in NextJS, environment variables' names must start with
 * "NEXT_PUBLIC" in order to be exposed to the frontend
 */
export default cleanEnv(process.env, {
  NEXT_PUBLIC_BACKEND_URL: str(), // URL of our backend
  NEXT_PUBLIC_FIREBASE_SETTINGS: json(), // Firebase settings for frontend, stored as a JSON string
});
