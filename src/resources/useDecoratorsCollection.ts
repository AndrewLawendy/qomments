import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import useAuth from "~hooks/useAuth";
import { db } from "~utils/firebase";

const useDecoratorsCollection = () => {
  const [user] = useAuth();
  const q = query(collection(db, "decorators"), where("uid", "==", user.uid));
  return useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
};

export { useDecoratorsCollection };
