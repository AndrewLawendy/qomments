import { useState } from "react";
import { Link } from "wouter";
import { Draggable } from "react-beautiful-dnd";
import {
  Segment,
  Message,
  Icon,
  Header,
  Popup,
  Button,
  Dimmer,
  Placeholder,
  Modal,
  Form,
  Confirm,
} from "semantic-ui-react";
import { css } from "@emotion/css";

import { Block } from "~/types";
import { GeneratorTopic } from "./types";

import useRequiredForm from "~hooks/useRequiredForm";

type DroppedTopicProps = {
  topic: GeneratorTopic;
  blocks: Block[];
  onTopicScoreChange: (index: number, score: number) => void;
  onTopicDelete: () => void;
  index: number;
  name: string;
  gender: "maleContent" | "femaleContent";
};

const DroppedTopic = ({
  topic,
  blocks,
  onTopicScoreChange,
  onTopicDelete,
  index,
  name,
  gender,
}: DroppedTopicProps) => {
  const hasBlocks = blocks.length > 0;
  const hasScore = topic.score != undefined;
  const [openPopup, setOpenPopup] = useState(hasBlocks && !hasScore);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const { values, errors, setFieldValue, setFieldTouched, handleSubmit } =
    useRequiredForm({
      Score: topic.score ? `${topic.score}` : "",
    });
  const scoreOptions = blocks.reduce<{ text: string; value: string }[]>(
    (options, _, index) => {
      options.push({
        text: `Score ${index + 1}`,
        value: `${index}`,
      });

      return options;
    },
    []
  );

  function submitScore() {
    handleSubmit(({ Score }) => {
      onTopicScoreChange(index, Number(Score));
      setOpenPopup(false);
    });
  }

  return (
    <>
      <Draggable draggableId={`dropped-${topic.id}`} index={index}>
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

                <Header size="tiny">
                  {topic.name}
                  {topic.score != undefined && `(Score ${topic.score + 1})`}
                </Header>
              </div>

              <div>
                {hasBlocks && hasScore && (
                  <Popup
                    content={`Edit ${topic.name} Score`}
                    trigger={
                      <Button
                        icon="edit"
                        size="mini"
                        onClick={() => setOpenPopup(true)}
                      />
                    }
                  />
                )}
                <Popup
                  content={`Delete ${topic.name}`}
                  trigger={
                    <Button
                      icon="trash"
                      size="mini"
                      onClick={() => setDeleteConfirmOpen(true)}
                    />
                  }
                />
              </div>
            </Message>

            <Segment attached>
              {hasBlocks ? (
                topic.score != undefined ? (
                  <span className="topic-content">
                    {name
                      ? blocks[topic.score][gender || "maleContent"].replaceAll(
                          "*",
                          name
                        )
                      : blocks[topic.score][gender || "maleContent"]}
                  </span>
                ) : (
                  <>
                    <Dimmer active inverted />
                    <Placeholder fluid>
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                    </Placeholder>
                  </>
                )
              ) : (
                <div
                  className={css`
                    text-align: center;
                  `}
                >
                  <Header as="h3">No blocks available</Header>
                  <p>
                    Go to <Link to={`my-space/${topic.id}`}>My Space</Link> to
                    start adding topics
                  </p>
                </div>
              )}
            </Segment>
          </div>
        )}
      </Draggable>

      <Modal
        dimmer="blurring"
        open={openPopup}
        closeOnDimmerClick={hasScore}
        closeOnEscape={hasScore}
        onClose={() => {
          setOpenPopup(false);
        }}
        size="tiny"
      >
        <Modal.Header>Choose {topic.name} score</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Select
              options={scoreOptions}
              label="Score"
              name="Score"
              value={values.Score}
              error={errors.Score}
              onChange={(_, { value }) =>
                setFieldValue("Score", value as string)
              }
              onBlur={() => setFieldTouched("Score")}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          {hasScore && (
            <Button
              negative
              onClick={() => {
                setOpenPopup(false);
              }}
            >
              Cancel
            </Button>
          )}
          <Button positive onClick={submitScore}>
            Submit
          </Button>
        </Modal.Actions>
      </Modal>

      <Confirm
        dimmer="blurring"
        open={isDeleteConfirmOpen}
        content={`Are you sure you want to delete  ${topic.name}?`}
        cancelButton={
          <Button color="red" onClick={() => setDeleteConfirmOpen(false)}>
            No
          </Button>
        }
        confirmButton={
          <Button color="green" onClick={onTopicDelete}>
            Yes
          </Button>
        }
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </>
  );
};

export default DroppedTopic;
