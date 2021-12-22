import { Timestamp } from "firebase/firestore";

export interface Common {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  user: string;
}

export interface Decorator extends Common {
  type: "introduction" | "closing";
  body: string;
}

export interface Block extends Common {
  maleContent: string;
  femaleContent: string;
  score: number;
  topic: string;
}

export interface Topic extends Common {
  name: string;
}
