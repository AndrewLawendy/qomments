import { useState } from "react";
import { Link } from "wouter";
import { Draggable } from "react-beautiful-dnd";
import {
  Segment,
  Message,
  Icon,
  Header,
  Button,
  Dimmer,
  Placeholder,
  Modal,
  Form,
} from "semantic-ui-react";
import { css } from "@emotion/css";

import { Block } from "~/types";
import { GeneratorTopic } from "./types";

import useRequiredForm from "~hooks/useRequiredForm";

type DroppedTopicProps = {
  topic: GeneratorTopic;
  blocks: Block[];
  onTopicScoreChange: (index: number, score: number) => void;
  index: number;
  name: string;
  gender: "maleContent" | "femaleContent";
};

const DroppedTopic = ({
  topic,
  blocks,
  onTopicScoreChange,
  index,
  name,
  gender,
}: DroppedTopicProps) => {
  const [openPopup, setOpenPopup] = useState(topic.score == undefined);
  const {
    values,
    errors,
    setFieldValue,
    setFieldTouched,
    destroyForm,
    handleSubmit,
  } = useRequiredForm({
    Score: topic.score ? `${topic.score}` : "",
  });
  const hasBlocks = blocks.length > 0;
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

                <Header size="tiny">{topic.name}</Header>
              </div>

              <Button icon="trash" size="mini" />
            </Message>

            <Segment attached>
              {hasBlocks ? (
                topic.score != undefined ? (
                  blocks[topic.score][gender || "maleContent"].replaceAll(
                    "*",
                    name || "*"
                  )
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
                    Go to{" "}
                    <Link to={`my-space/${topic.id}`}>My Space/{topic.id}</Link>{" "}
                    to start adding topics
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
        closeOnDimmerClick={topic.score != undefined}
        closeOnEscape={topic.score != undefined}
        onClose={() => {
          setOpenPopup(false);
          destroyForm();
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
          {topic.score != undefined && (
            <Button
              negative
              onClick={() => {
                setOpenPopup(false);
                destroyForm();
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
    </>
  );
};

export default DroppedTopic;
