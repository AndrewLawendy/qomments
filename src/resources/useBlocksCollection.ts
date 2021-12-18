import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import useAuth from "~hooks/useAuth";
import { db } from "~utils/firebase";

const useBlocksCollection = () => {
  const [user] = useAuth();
  const q = query(collection(db, "blocks"), where("uid", "==", user.uid));
  return useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
};

export { useBlocksCollection };
