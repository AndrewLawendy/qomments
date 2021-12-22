import { collection, query, where, QueryConstraint } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { useAuthContext } from "~contexts/AuthContext";
import { db } from "~/utils/firebase";

const useTopicsCollection = (...queryConstraints: QueryConstraint[]) => {
  const { authData } = useAuthContext();
  const q = query(
    collection(db, "topics"),
    where("user", "==", authData?.uid),
    ...queryConstraints
  );
  return useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
};

export { useTopicsCollection };
