import { useState } from "react";
import googleSignInBtn from "../images/gSignIn.png";
import "./auth.scss";
import { SignInResp, useAuth } from "./useAuth";

export const SignIn = (): JSX.Element => {
  const [errorState, setErrorState] = useState<SignInResp | null>(null);
  const { signIn } = useAuth((resp) => {
    if (resp.status === "error") {
      setErrorState(resp);
    } else {
      setErrorState(null);
    }
  });
  return (
    <div className="signIn">
      <img onClick={signIn} src={googleSignInBtn} alt="sign in with google" />
      {errorState && (
        <>
          <div className="error">
            Failed to sign in: {errorState.data.errorMessage}
          </div>
          <button onClick={() => setErrorState(null)}>Clear</button>
        </>
      )}
    </div>
  );
};
