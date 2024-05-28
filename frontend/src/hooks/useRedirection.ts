import { User } from "@/api/Users";
import { ADMIN_ROLE } from "@/constants/roles";
import { UserContext } from "@/contexts/userContext";
import { User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export const LOGIN_URL = "/login";
export const HOME_URL = "/staff/vsr";

/**
 * An interface for the user's current authentication credentials
 */
export interface AuthCredentials {
  firebaseUser: FirebaseUser | null;
  papUser: User | null;
}

/**
 * A type for a function that determines whether the user should be redirected
 * based on their current credentials
 */
export type CheckShouldRedirect = (authCredentials: AuthCredentials) => boolean;

export interface UseRedirectionProps {
  checkShouldRedirect: CheckShouldRedirect;
  redirectURL: string;
}

/**
 * A base hook that redirects the user to redirectURL if checkShouldRedirect returns true
 */
export const useRedirection = ({ checkShouldRedirect, redirectURL }: UseRedirectionProps) => {
  const { firebaseUser, papUser, loadingUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    // Don't redirect if we are still loading the current user
    if (loadingUser) {
      return;
    }

    if (checkShouldRedirect({ firebaseUser, papUser })) {
      router.push(redirectURL);
    }
  }, [firebaseUser, papUser, loadingUser]);
};

/**
 * A hook that redirects the user to the staff/admin home page if they are already signed in
 */
export const useRedirectToHomeIfSignedIn = () => {
  useRedirection({
    checkShouldRedirect: ({ firebaseUser, papUser }) => firebaseUser !== null && papUser !== null,
    redirectURL: HOME_URL,
  });
};

/**
 * A hook that redirects the user to the login page if they are not signed in
 */
export const useRedirectToLoginIfNotSignedIn = () => {
  useRedirection({
    checkShouldRedirect: ({ firebaseUser, papUser }) => firebaseUser === null || papUser === null,
    redirectURL: LOGIN_URL,
  });
};

/**
 * A hook that redirects the user to the staff home page if they are signed in, but not an admin
 */
export const useRedirectToHomeIfNotAdmin = () => {
  useRedirection({
    checkShouldRedirect: ({ papUser }) => papUser !== null && papUser.role !== ADMIN_ROLE,
    redirectURL: HOME_URL,
  });
};
