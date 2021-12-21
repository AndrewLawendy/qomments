import { Timestamp } from "firebase/firestore";

export type Decorator = {
  id: string;
  type: "introduction" | "closing";
  body: "string";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  user: string;
};
