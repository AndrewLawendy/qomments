import { FC } from "react";
import { Redirect } from "wouter";

import useAuth from "~/hooks/useAuth";
import { hasLocalAuth } from "~utils";

const AuthWrapper: FC = ({ children }) => {
  const isUserLoggedIn = hasLocalAuth();
  const [user] = useAuth();

  if (isUserLoggedIn || user) return <>{children}</>;
  return <Redirect to="/login" />;
};

export default AuthWrapper;
