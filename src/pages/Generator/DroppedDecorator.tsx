import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import {
  Segment,
  Message,
  Icon,
  Header,
  Popup,
  Button,
  Confirm,
} from "semantic-ui-react";
import { css } from "@emotion/css";

import { Decorator } from "~/types";
import { startCase } from "~/utils";

type DroppedDecoratorProps = {
  decorator: Decorator;
  onDecoratorDelete: () => void;
  index: number;
  name: string;
};

const DroppedDecorator = ({
  decorator,
  onDecoratorDelete,
  index,
  name,
}: DroppedDecoratorProps) => {
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const title = startCase(decorator.type);

  return (
    <>
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

                <Header size="tiny">{title}</Header>
              </div>

              <Popup
                content={`Delete ${title}`}
                trigger={
                  <Button
                    icon="trash"
                    size="mini"
                    onClick={() => setDeleteConfirmOpen(true)}
                  />
                }
              />
            </Message>
            <Segment attached>
              {name ? decorator.body.replaceAll("*", name) : decorator.body}
            </Segment>
          </div>
        )}
      </Draggable>

      <Confirm
        dimmer="blurring"
        open={isDeleteConfirmOpen}
        content={`Are you sure you want to delete  ${title}?`}
        cancelButton={
          <Button color="red" onClick={() => setDeleteConfirmOpen(false)}>
            No
          </Button>
        }
        confirmButton={
          <Button color="green" onClick={onDecoratorDelete}>
            Yes
          </Button>
        }
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </>
  );
};

export default DroppedDecorator;
