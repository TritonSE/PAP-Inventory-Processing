"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { User, getWhoAmI } from "@/api/Users";
import { initFirebase } from "@/firebase/firebase";

interface IUserContext {
  firebaseUser: FirebaseUser | null;
  papUser: User | null;
  loadingUser: boolean;
  reloadUser: () => unknown;
}

export const UserContext = createContext<IUserContext>({
  firebaseUser: null,
  papUser: null,
  loadingUser: true,
  reloadUser: () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [papUser, setPapUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const { auth } = initFirebase();

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
    <UserContext.Provider value={{ firebaseUser, papUser, loadingUser, reloadUser }}>
      {children}
    </UserContext.Provider>
  );
};
