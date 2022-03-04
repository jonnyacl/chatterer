import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  User,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { useEffect, useState } from "react";

const provider = new GoogleAuthProvider();

export interface SignInResp {
  status: "success" | "error";
  data: any;
}

export const useAuth = (callback?: (resp: SignInResp) => void) => {
  const [user, setUser] = useState<User | null>(getAuth().currentUser);
  const [fetchedSession, setFetchedSession] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => setFetchedSession(true), 500);
  }, []);
  useEffect(() => {
    getAuth().onAuthStateChanged((authUser: User | null) => {
      if (authUser) {
        setUser(authUser);
      }
    });
  }, []);

  const signIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const signedInUser = result.user;
        setUser(signedInUser);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error({ errorCode, errorMessage, email, credential });
        callback &&
          callback({
            status: "error",
            data: { errorCode, errorMessage, email, credential },
          });
      });
  };

  const signOut = () => {
    const currentUser = getAuth();
    firebaseSignOut(currentUser).then(() => {
      setUser(null);
    });
  };

  return { signOut, user, signIn, fetchedSession };
};

export const useSignOut = () => {};
