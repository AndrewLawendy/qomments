import { useEffect, FC } from "react";
import { Redirect } from "wouter";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "~utils/firebase";
import { useAuthContext } from "~contexts/AuthContext";

const AuthWrapper: FC = ({ children }) => {
  const { authData, setAuthData } = useAuthContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setAuthData);

    return unsubscribe;
  }, []);

  if (authData) return <>{children}</>;
  return <Redirect to="/login" />;
};

export default AuthWrapper;
