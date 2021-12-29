import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Container,
  Segment,
  Header,
  Form,
  Dimmer,
  Loader,
  Placeholder,
} from "semantic-ui-react";
import {
  DragDropContext,
  Droppable,
  DropResult,
  DraggableLocation,
} from "react-beautiful-dnd";
import { css } from "@emotion/css";

import TopicDraggable from "./TopicDraggable";
import DroppedDecorator from "./DroppedDecorator";

import useRequiredForm from "~hooks/useRequiredForm";
import { useTopicsCollection } from "~/resources/useTopicsCollection";
import { useDecoratorsCollection } from "~/resources/useDecoratorsCollection";

import { Topic, Decorator } from "~/types";

const genderOptions = [
  {
    text: "Male",
    value: "maleContent",
  },
  {
    text: "Female",
    value: "femaleContent",
  },
];

function isTopic(droppedTopic: Decorator | Topic): droppedTopic is Topic {
  return (droppedTopic as Topic).name !== undefined;
}

const Generator = () => {
  const { values, errors, onChange, onBlur, setFieldValue, setFieldTouched } =
    useRequiredForm({
      Name: "",
      Gender: "",
    });
  const [decoratorsRef, isDecoratorsLoading] = useDecoratorsCollection();
  const [decorators, setDecorators] = useState<Decorator[]>([]);

  const [topicsRef, isTopicsLoading] = useTopicsCollection();
  const [topics, setTopics] = useState<Topic[]>([]);

  const [droppedTopics, setDroppedTopics] = useState<Array<Decorator | Topic>>(
    []
  );

  useEffect(() => {
    const decorators: Decorator[] = [];
    decoratorsRef?.forEach((document) =>
      decorators.push({
        id: document.id,
        ...document.data(),
      } as Decorator)
    );

    setDecorators(decorators);
  }, [decoratorsRef]);

  useEffect(() => {
    const topicsValues: Topic[] = [];
    const topicsPaths: string[] = [];
    topicsRef?.forEach((topic) => {
      topicsValues.push({
        id: topic.id,
        ...topic.data(),
      } as Topic);
      topicsPaths.push(topic.id);
    });

    setTopics(topicsValues);
  }, [topicsRef]);

  function handleDropped({ source, destination }: DropResult) {
    let droppedItem: Decorator | Topic;
    if (source.droppableId === (destination as DraggableLocation).droppableId) {
      // Reorder
      [droppedItem] = droppedTopics.splice(source.index, 1);
    } else {
      // Drop

      [droppedItem] =
        source.droppableId === "availableDecorators"
          ? decorators.splice(source.index, 1)
          : topics.splice(source.index, 1);
    }

    droppedTopics.splice(
      (destination as DraggableLocation).index,
      0,
      droppedItem
    );
    setDroppedTopics(droppedTopics);
  }

  function onDropEnd(result: DropResult) {
    const { destination } = result;
    if (!destination) return;

    if (destination.droppableId === "droppedTopics") {
      handleDropped(result);
    }
  }

  return (
    <Container
      className={css`
        padding: 24px;
      `}
    >
      <Segment>
        <Header as="h2">Generate qomment</Header>
        <Header as="h3">Choose name and gender to proceed</Header>
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              label="Name"
              name="Name"
              value={values.Name}
              error={errors.Name}
              onChange={onChange}
              onBlur={onBlur}
            />
            <Form.Select
              options={genderOptions}
              label="Gender"
              name="Gender"
              value={values.Gender}
              error={errors.Gender}
              onChange={(_, { value }) =>
                setFieldValue("Gender", value as string)
              }
              onBlur={() => setFieldTouched("Gender")}
            />
          </Form.Group>
        </Form>
      </Segment>

      <DragDropContext onDragEnd={onDropEnd}>
        <Segment>
          <Header as="h3">Decorators</Header>
          <Segment>
            {isDecoratorsLoading && (
              <>
                <Dimmer active inverted>
                  <Loader inverted>Loading Decorators</Loader>
                </Dimmer>

                <Placeholder fluid>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder>
              </>
            )}

            {!isTopicsLoading && decorators.length === 0 ? (
              <div
                className={css`
                  text-align: center;
                `}
              >
                <Header as="h3">No decorators available</Header>
                <p>
                  Go to <Link to="my-space">My Space</Link> to start adding
                  topics
                </p>
              </div>
            ) : (
              <Droppable
                droppableId="availableDecorators"
                direction="horizontal"
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={css`
                      display: flex;
                      flex-wrap: wrap;
                      gap: 12px;
                    `}
                  >
                    {decorators.map((decorator, index) => (
                      <TopicDraggable
                        topic={decorator}
                        key={decorator.id}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </Droppable>
            )}
          </Segment>
        </Segment>

        <Segment>
          <Header as="h3">Topics</Header>
          <Segment>
            {isDecoratorsLoading && (
              <>
                <Dimmer active inverted>
                  <Loader inverted>Loading Topics</Loader>
                </Dimmer>

                <Placeholder fluid>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder>
              </>
            )}

            {!isDecoratorsLoading && topics.length === 0 ? (
              <div
                className={css`
                  text-align: center;
                `}
              >
                <Header as="h3">No topics available</Header>
                <p>
                  Go to <Link to="my-space">My Space</Link> to start adding
                  topics
                </p>
              </div>
            ) : (
              <Droppable droppableId="availableTopics" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={css`
                      display: flex;
                      flex-wrap: wrap;
                      gap: 12px;
                    `}
                  >
                    {topics.map((topic, index) => (
                      <TopicDraggable
                        topic={topic}
                        key={topic.id}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </Droppable>
            )}
          </Segment>
        </Segment>

        <Segment>
          <Segment>
            <Droppable droppableId="droppedTopics">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={css`
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    border-radius: 6px;
                    background-color: ${snapshot.isDraggingOver
                      ? "#ffeaa7"
                      : "#fff"};
                    transition: background-color 0.2s;
                  `}
                >
                  {droppedTopics.map((droppedTopic, index) => {
                    const isDroppedTopic = isTopic(droppedTopic);

                    if (isDroppedTopic) {
                      return null;
                    } else {
                      return (
                        <DroppedDecorator
                          key={droppedTopic.id}
                          decorator={droppedTopic}
                          index={index}
                          name={values.Name}
                        />
                      );
                    }
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Segment>
        </Segment>
      </DragDropContext>
    </Container>
  );
};

export default Generator;
