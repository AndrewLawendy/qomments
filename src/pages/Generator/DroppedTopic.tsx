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
  Placeholder,
  Modal,
  Form,
  Confirm,
} from "semantic-ui-react";
import { css } from "@emotion/css";

import { GeneratorTopic, BlockValues } from "./types";

import useRequiredForm from "~hooks/useRequiredForm";

type DroppedTopicProps = {
  topic: GeneratorTopic;
  blockValues: BlockValues;
  onTopicLevelChange: (index: number, level: string) => void;
  onTopicDelete: () => void;
  index: number;
  name: string;
  gender: "maleContent" | "femaleContent";
};

const DroppedTopic = ({
  topic,
  blockValues,
  onTopicLevelChange,
  onTopicDelete,
  index,
  name,
  gender,
}: DroppedTopicProps) => {
  const hasBlocks = blockValues.length > 0;
  const hasLevel = topic.level != undefined;
  const [openPopup, setOpenPopup] = useState(hasBlocks && !hasLevel);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const { values, errors, setFieldValue, setFieldTouched, handleSubmit } =
    useRequiredForm({
      Level: topic.level ? `${topic.level}` : "",
    });
  const levelOptions = blockValues.levels.map((level) => ({
    text: level,
    value: level,
  }));

  function submitLevel() {
    handleSubmit(({ Level }) => {
      onTopicLevelChange(index, Level);
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
                  {topic.name} {topic.level ? `(${topic.level})` : ""}
                </Header>
              </div>

              <div>
                {hasBlocks && hasLevel && (
                  <Popup
                    content={`Edit ${topic.name} Level`}
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
                topic.level ? (
                  <span className="topic-content">
                    {name
                      ? blockValues.blocks[topic.level][
                          gender || "maleContent"
                        ].replaceAll("*", name)
                      : blockValues.blocks[topic.level][
                          gender || "maleContent"
                        ]}
                  </span>
                ) : (
                  <Placeholder fluid>
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder>
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
        closeOnDimmerClick={hasLevel}
        closeOnEscape={hasLevel}
        onClose={() => {
          setOpenPopup(false);
        }}
        size="tiny"
      >
        <Modal.Header>Choose {topic.name} level</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Select
              options={levelOptions}
              label="Level"
              name="Level"
              value={values.Level}
              error={errors.Level}
              onChange={(_, { value }) =>
                setFieldValue("Level", value as string)
              }
              onBlur={() => setFieldTouched("Level")}
            />

            <Header as="h4">Preview</Header>

            <Segment>
              {values.Level ? (
                name ? (
                  blockValues.blocks[values.Level][
                    gender || "maleContent"
                  ].replaceAll("*", name)
                ) : (
                  blockValues.blocks[values.Level][gender || "maleContent"]
                )
              ) : (
                <Placeholder fluid>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder>
              )}
            </Segment>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          {hasLevel && (
            <Button
              negative
              onClick={() => {
                setOpenPopup(false);
              }}
            >
              Cancel
            </Button>
          )}
          <Button positive onClick={submitLevel}>
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
