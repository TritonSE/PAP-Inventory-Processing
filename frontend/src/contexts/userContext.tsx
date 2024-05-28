"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { User, getWhoAmI } from "@/api/Users";
import { initFirebase } from "@/firebase/firebase";

type Notification = "deleteUser" | "changePassword" | null;

interface IUserContext {
  firebaseUser: FirebaseUser | null;
  papUser: User | null;
  loadingUser: boolean;
  reloadUser: () => unknown;
  successNotificationOpen: Notification;
  setSuccessNotificationOpen: (notification: Notification) => unknown;
  errorNotificationOpen: Notification;
  setErrorNotificationOpen: (notification: Notification) => unknown;
}

/**
 * A context that provides the current Firebase and PAP (MongoDB) user data,
 * automatically fetching them when the page loads.
 */
export const UserContext = createContext<IUserContext>({
  firebaseUser: null,
  papUser: null,
  loadingUser: true,
  reloadUser: () => {},
  successNotificationOpen: null,
  setSuccessNotificationOpen: () => {},
  errorNotificationOpen: null,
  setErrorNotificationOpen: () => {},
});

/**
 * A provider component that handles the logic for supplying the context
 * with its current user & loading state variables.
 */
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [papUser, setPapUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [successNotificationOpen, setSuccessNotificationOpen] = useState<Notification>(null);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState<Notification>(null);

  const { auth } = initFirebase();

  /**
   * Callback triggered by Firebase when the user logs in/out, or on page load
   */
  onAuthStateChanged(auth, (firebaseUser) => {
    setFirebaseUser(firebaseUser);
    setInitialLoading(false);
  });

  const reloadUser = () => {
    if (initialLoading) {
      return;
    }
    setLoadingUser(true);
    setPapUser(null);
    if (firebaseUser === null) {
      setLoadingUser(false);
    } else {
      firebaseUser.getIdToken().then((token) =>
        getWhoAmI(token).then((res) => {
          if (res.success) {
            setPapUser(res.data);
          } else {
            setPapUser(null);
          }
          setLoadingUser(false);
        }),
      );
    }
  };

  useEffect(reloadUser, [initialLoading, firebaseUser]);

  return (
    <UserContext.Provider
      value={{
        firebaseUser,
        papUser,
        loadingUser,
        reloadUser,
        successNotificationOpen,
        setSuccessNotificationOpen,
        errorNotificationOpen,
        setErrorNotificationOpen,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
