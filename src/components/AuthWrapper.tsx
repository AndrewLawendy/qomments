import { useEffect, FC } from "react";
import { useLocation } from "wouter";

import useAuth from "~/hooks/useAuth";

const AuthWrapper: FC = ({ children }) => {
  const [, setLocation] = useLocation();
  const [user] = useAuth();

  useEffect(() => {
    if (user) {
      setLocation("/");
    } else {
      setLocation("/login");
    }
  }, [user]);

  if (user) return <>{children}</>;
  return null;
};

export default AuthWrapper;
