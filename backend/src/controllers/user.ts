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

export const getUsers: RequestHandler = async (req: PAPRequest, res, next) => {
  try {
    const users = await UserModel.find();
    const displayUsers = [];
    for (const user of users) {
      const { uid, _id } = user;

      try {
        // const userRecord = await firebaseAuth.getUser(uid);

        await firebaseAuth.updateUser(uid, {
          displayName: "Samvrit Srinath",
          photoURL:
            "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F42893664%2Ffirebase-photourl-from-a-google-auth-provider-returns-a-jpg-with-colors-inverted&psig=AOvVaw1rsKyabxOup86UrqGbfpsp&ust=1714873347675000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCIDx4Jjv8oUDFQAAAAAdAAAAABAD",
        });

        const newUser = await firebaseAuth.getUser(uid);
        const { displayName, email, photoURL } = newUser!;

        const displayUser = { _id, uid, displayName, email, photoURL };
        displayUsers.push(displayUser);
      } catch (error) {
        next(error);
      }
    }

    res.status(200).json(displayUsers as DisplayUser[]);
  } catch (error) {
    next(error);
  }
};
