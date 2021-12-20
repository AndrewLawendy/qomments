import { useState } from "react";
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

export const useAddDocument = (
  collectionName: string
): [(data: any) => void, boolean] => {
  const [isLoading, setLoading] = useState(false);
  const [user] = useAuth();

  const addDocument = (data: any) => {
    setLoading(true);
    addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      uid: user?.uid,
    }).finally(() => setLoading(false));
  };

  return [addDocument, isLoading];
};

export const useUpdateDocument = (
  collectionName: string
): [(documentId: string, data: any) => Promise<void>, boolean] => {
  const [isLoading, setLoading] = useState(false);
  const updateDocument = (documentId: string, data: any) => {
    setLoading(true);
    const documentRef = doc(db, collectionName, documentId);

    return updateDoc(documentRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }).finally(() => setLoading(false));
  };
  return [updateDocument, isLoading];
};

export const useDeleteDocument = (
  collectionName: string
): [(documentId: string) => Promise<void>, boolean] => {
  const [isLoading, setLoading] = useState(false);

  const deleteDocument = (documentId: string) => {
    setLoading(true);
    return deleteDoc(doc(db, collectionName, documentId)).finally(() =>
      setLoading(false)
    );
  };
  return [deleteDocument, isLoading];
};
