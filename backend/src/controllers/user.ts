import { RequestHandler } from "express";
import { PAPRequest } from "src/middleware/auth";
import { firebaseAuth } from "src/services/firebase";
import UserModel, { DisplayUser } from "src/models/user";

/**
 * Retrieves data about the current user (their MongoDB ID, Firebase UID, and role).
 * Requires the user to be signed in.
 */
export const getWhoAmI: RequestHandler = async (req: PAPRequest, res, next) => {
  try {
    const { userUid } = req;
    const user = await UserModel.findOne({ uid: userUid });
    const { _id, uid, role } = user!;
    res.status(200).send({
      _id,
      uid,
      role,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a list of all users in our database
 */
export const getUsers: RequestHandler = async (req: PAPRequest, res, next) => {
  try {
    const papUsers = await UserModel.find();
    const displayUsers: DisplayUser[] = [];
    for (const papUser of papUsers) {
      const { uid, _id } = papUser;

      try {
        const firebaseUser = await firebaseAuth.getUser(uid);
        const { displayName, email } = firebaseUser!;

        const displayUser = { _id, uid, displayName, email };
        displayUsers.push(displayUser);
      } catch (error) {
        next(error);
      }
    }

    res.status(200).json(displayUsers);
  } catch (error) {
    next(error);
  }
};
