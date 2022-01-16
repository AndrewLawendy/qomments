import { collection, query, where, QueryConstraint } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { useAuthContext } from "/src/contexts/AuthContext";
import { db } from "/src/utils/firebase";

const useDecoratorsCollection = (...queryConstraints: QueryConstraint[]) => {
  const { authData } = useAuthContext();
  const q = query(
    collection(db, "decorators"),
    where("user", "==", authData?.uid),
    ...queryConstraints
  );
  return useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
};

export { useDecoratorsCollection };
