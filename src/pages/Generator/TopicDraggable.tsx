import { Draggable } from "react-beautiful-dnd";
import { Label } from "semantic-ui-react";
import { css } from "@emotion/css";

import { Topic, Decorator } from "/src/types";
import { startCase } from "/src/utils";

type TopicDragSourceProps = {
  topic: Topic | Decorator;
  index: number;
};

function isTopic(droppedTopic: Decorator | Topic): droppedTopic is Topic {
  return (droppedTopic as Topic).name !== undefined;
}

const TopicDragSource = ({ topic, index }: TopicDragSourceProps) => {
  const isDroppedTopic = isTopic(topic);

  return (
    <Draggable draggableId={`topic-${topic.id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={css`
            cursor: pointer;
          `}
        >
          {isDroppedTopic ? (
            <Label>{topic.name}</Label>
          ) : (
            <Label>{startCase(topic.type)}</Label>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TopicDragSource;
