import { firebaseAuth } from "src/services/firebase";
import { AuthError } from "src/errors/auth";

async function decodeAuthToken(token: string) {
  try {
    const userInfo = await firebaseAuth.verifyIdToken(token);
    return userInfo;
  } catch (e) {
    throw AuthError.DECODE_ERROR;
  }
}

export { decodeAuthToken };
