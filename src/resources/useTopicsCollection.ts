import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { useAuthContext } from "~contexts/AuthContext";
import { db } from "~/utils/firebase";

const useTopicsCollection = () => {
  const { authData } = useAuthContext();
  const q = query(collection(db, "topics"), where("user", "==", authData?.uid));
  return useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
};

export { useTopicsCollection };
