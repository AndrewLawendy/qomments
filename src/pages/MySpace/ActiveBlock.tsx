import { css } from "@emotion/css";

import Decorator from "./Decorator";
import Topic from "./Topic";

import { Topic as TopicType } from "~/types";

type ActiveBlockProps = {
  activeBlock: string;
  mountBlocks: {
    [key: string]: boolean;
  };

  topics: TopicType[];
};

const ActiveBlock = ({
  mountBlocks,
  activeBlock,
  topics,
}: ActiveBlockProps) => {
  return (
    <>
      {mountBlocks.Introduction && (
        <div
          className={css`
            display: ${activeBlock === "Introduction" ? "block" : "none"};
          `}
        >
          <Decorator title="Introduction" type="introduction" />
        </div>
      )}

      {mountBlocks.Closing && (
        <div
          className={css`
            display: ${activeBlock === "Closing" ? "block" : "none"};
          `}
        >
          <Decorator title="Closing" type="closing" />
        </div>
      )}
      {topics.map((topic) => {
        if (mountBlocks[topic.id]) {
          return (
            <div
              className={css`
                display: ${activeBlock === topic.id ? "block" : "none"};
              `}
              key={topic.id}
            >
              <Topic topic={topic} />
            </div>
          );
        }
      })}
    </>
  );
};

export default ActiveBlock;
