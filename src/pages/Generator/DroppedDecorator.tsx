import { Draggable } from "react-beautiful-dnd";
import { Segment, Message, Icon, Header, Button } from "semantic-ui-react";
import { css } from "@emotion/css";

import { Decorator } from "~/types";
import { startCase } from "~/utils";

type DroppedDecoratorProps = {
  decorator: Decorator;
  index: number;
  name: string;
};

const DroppedDecorator = ({
  decorator,
  index,
  name,
}: DroppedDecoratorProps) => {
  return (
    <Draggable draggableId={`dropped-${decorator.id}`} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <Message
            attached
            className={css`
              display: flex;
              justify-content: space-between;
            `}
          >
            <div
              className={css`
                display: flex;
                align-items: center;
              `}
            >
              <Icon
                name="bars"
                className={css`
                  cursor: move;
                `}
                {...provided.dragHandleProps}
              />

              <Header size="tiny">{startCase(decorator.type)}</Header>
            </div>

            <Button icon="trash" size="mini" />
          </Message>
          <Segment attached>
            {decorator.body.replaceAll("*", name || "*")}
          </Segment>
        </div>
      )}
    </Draggable>
  );
};

export default DroppedDecorator;
