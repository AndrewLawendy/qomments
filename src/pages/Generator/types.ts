import { Topic, Decorator } from "~/types";

export interface GeneratorTopic extends Topic {
  score?: number;
  sourceIndex?: number;
}

export interface GeneratorDecorator extends Decorator {
  sourceIndex?: number;
}
