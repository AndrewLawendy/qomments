import { Decorator, Topic, Block } from "/src/types";

export interface GeneratorTopic extends Topic {
  level?: string;
  sourceIndex?: number;
}

export interface GeneratorDecorator extends Decorator {
  sourceIndex?: number;
}

export interface BlocksValues {
  [topicId: string]: BlockValues;
}

export interface BlockValues {
  levels: string[];
  blocks: { [blockLevel: string]: Block };
  length: number;
}
