import { firebaseAuth } from "src/services/firebase";
import { AuthError } from "src/errors/auth";

/**
 * Decodes a Firebase token and returns the user info for the user who the token is for,
 * or throws an error if the token is invalid.
 */
async function decodeAuthToken(token: string) {
  try {
    const userInfo = await firebaseAuth.verifyIdToken(token);
    return userInfo;
  } catch (e) {
    throw AuthError.DECODE_ERROR;
  }
}

export { decodeAuthToken };
