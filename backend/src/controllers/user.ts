import { RequestHandler } from "express";
import { PAPRequest } from "src/middleware/auth";
import { firebaseAuth } from "src/services/firebase";
import UserModel, { DisplayUser, UserRole } from "src/models/user";
import { validationResult } from "express-validator";
import validationErrorParser from "src/util/validationErrorParser";

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

/**
 * Creates a new user, in both the Firebase and MongoDB databases
 */
export const createUser: RequestHandler = async (req: PAPRequest, res, next) => {
  const errors = validationResult(req);

  try {
    validationErrorParser(errors);

    const { name, email, password } = req.body;

    // First, call the Firebase API to create a new user
    const firebaseUser = await firebaseAuth.createUser({
      displayName: name,
      email,
      password,
    });

    // Now, using the UID of the new Firebase user, create a user in our MongoDB database
    const user = await UserModel.create({
      uid: firebaseUser.uid,
      // We can only create new staff accounts, not admin accounts.
      role: UserRole.STAFF,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
