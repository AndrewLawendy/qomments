import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import useAuth from "~hooks/useAuth";
import { db } from "../utils/firebase";

export const useAddDocument = (collectionName: string) => {
  const [user] = useAuth();

  return (data: any) =>
    addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      uid: user?.uid,
    });
};

export const useUpdateDocument = (collectionName: string) => {
  return (documentId: string, data: any) => {
    const documentRef = doc(db, collectionName, documentId);

    return updateDoc(documentRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };
};

export const useDeleteDocument = (collectionName: string) => {
  return (documentId: string) => deleteDoc(doc(db, collectionName, documentId));
};
