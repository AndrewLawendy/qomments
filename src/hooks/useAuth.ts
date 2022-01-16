import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "/src/utils/firebase";

const useAuth = () => {
  return useAuthState(auth);
};

export default useAuth;
