import { useState } from "react";
import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";

import { useAuthContext } from "/src/contexts/AuthContext";
import { db } from "../utils/firebase";
import { Common } from "/src/types";

export const useAddDocument = <T>(
  collectionName: string
): [
  (data: Omit<T, keyof Common>) => Promise<DocumentReference<DocumentData>>,
  boolean
] => {
  const [isLoading, setLoading] = useState(false);
  const { authData } = useAuthContext();

  const addDocument = (data: Omit<T, keyof Common>) => {
    setLoading(true);
    return addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      user: authData?.uid,
    }).finally(() => setLoading(false));
  };

  return [addDocument, isLoading];
};

export const useUpdateDocument = <T>(
  collectionName: string
): [
  (documentId: string, data: Partial<Omit<T, keyof Common>>) => Promise<void>,
  boolean
] => {
  const [isLoading, setLoading] = useState(false);
  const updateDocument = (
    documentId: string,
    data: Partial<Omit<T, keyof Common>>
  ) => {
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
