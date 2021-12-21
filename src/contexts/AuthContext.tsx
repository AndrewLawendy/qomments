import { useState, createContext, useContext, FC, Dispatch } from "react";
import { User } from "firebase/auth";
import { getLocalUser } from "~/utils";

const user = getLocalUser();

interface AuthContextType {
  authData: User | null;
  setAuthData: Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  authData: user,
  setAuthData: () => false,
});

const AuthProvider: FC = ({ children }) => {
  const [authData, setAuthData] = useState<User | null>(user);

  return (
    <AuthContext.Provider value={{ authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    console.error("useAuthContext must be used within a AppContextProvider");
  }
  return context;
};

export default AuthProvider;
