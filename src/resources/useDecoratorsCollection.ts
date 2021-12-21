import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { useAuthContext } from "~contexts/AuthContext";
import { db } from "~/utils/firebase";

const useDecoratorsCollection = () => {
  const { authData } = useAuthContext();
  const q = query(
    collection(db, "decorators"),
    where("uid", "==", authData?.uid)
  );
  return useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
};

export { useDecoratorsCollection };
