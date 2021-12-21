import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { useAuthContext } from "~contexts/AuthContext";
import { db } from "~/utils/firebase";

const useBlocksCollection = () => {
  const { authData } = useAuthContext();
  const q = query(collection(db, "blocks"), where("uid", "==", authData?.uid));
  return useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
};

export { useBlocksCollection };
