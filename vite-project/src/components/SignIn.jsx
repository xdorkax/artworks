import { useContext } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from '../firebase';
import { AuthContext } from "../context/AuthProvider";
import { Button } from "@mui/material";

const SignIn = () => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider);
  };

  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      {currentUser ? (
        <p>Hello, {currentUser.displayName}</p>
      ) : (
        <Button onClick={signInWithGoogle} style={{ color: "white" }}>Sign In with Google</Button>
      )}
    </div>
  );
};

export default SignIn;
