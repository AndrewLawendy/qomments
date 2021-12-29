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
  Icon,
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
import DroppedTopic from "./DroppedTopic";

import useRequiredForm from "~hooks/useRequiredForm";
import { useTopicsCollection } from "~/resources/useTopicsCollection";
import { useDecoratorsCollection } from "~/resources/useDecoratorsCollection";
import { useBlocksCollection } from "~resources/useBlocksCollection";

import { Block } from "~/types";
import { GeneratorDecorator, GeneratorTopic } from "./types";

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

function isTopic(
  droppedTopic: GeneratorDecorator | GeneratorTopic
): droppedTopic is GeneratorTopic {
  return (droppedTopic as GeneratorTopic).name !== undefined;
}

const Generator = () => {
  const { values, errors, onChange, onBlur, setFieldValue, setFieldTouched } =
    useRequiredForm({
      Name: "",
      Gender: "",
    });
  const [decoratorsRef, isDecoratorsLoading] = useDecoratorsCollection();
  const [decorators, setDecorators] = useState<GeneratorDecorator[]>([]);
  const [hasDecorators, setHasDecorators] = useState(false);

  const [topicsRef, isTopicsLoading] = useTopicsCollection();
  const [topics, setTopics] = useState<GeneratorTopic[]>([]);
  const [hasTopics, setHasTopics] = useState(false);

  const [blocksRef, isBlocksLoading] = useBlocksCollection();
  const [blocks, setBlocks] = useState<{ [id: string]: Block[] }>({});

  const [droppedTopics, setDroppedTopics] = useState<
    Array<GeneratorDecorator | GeneratorTopic>
  >([]);

  useEffect(() => {
    const decorators: GeneratorDecorator[] = [];
    decoratorsRef?.forEach((document) =>
      decorators.push({
        id: document.id,
        ...document.data(),
      } as GeneratorDecorator)
    );

    if (decorators.length > 0) setHasDecorators(true);
    setDecorators(decorators);
  }, [decoratorsRef]);

  useEffect(() => {
    const topics: GeneratorTopic[] = [];
    topicsRef?.forEach((document) => {
      topics.push({
        id: document.id,
        ...document.data(),
      } as GeneratorTopic);
    });

    if (topics.length > 0) setHasTopics(true);
    setTopics(topics);
  }, [topicsRef]);

  useEffect(() => {
    const blocksValues: { [id: string]: Block[] } = {};
    blocksRef?.forEach((document) => {
      const block: Block = {
        id: document.id,
        ...(document.data() as Omit<Block, "id">),
      };

      if (!blocksValues[block.topic]) blocksValues[block.topic] = [];
      blocksValues[block.topic].push(block);
    });

    setBlocks(blocksValues);
  }, [blocksRef]);

  function handleDropped({ source, destination }: DropResult) {
    let droppedItem: GeneratorDecorator | GeneratorTopic;
    if (source.droppableId === (destination as DraggableLocation).droppableId) {
      // Reorder
      [droppedItem] = droppedTopics.splice(source.index, 1);
    } else {
      // Drop

      [droppedItem] =
        source.droppableId === "availableDecorators"
          ? decorators.splice(source.index, 1)
          : topics.splice(source.index, 1);
      droppedItem.sourceIndex = source.index;
    }

    droppedTopics.splice(
      (destination as DraggableLocation).index,
      0,
      droppedItem
    );
    setDroppedTopics([...droppedTopics]);
  }

  function onDropEnd(result: DropResult) {
    const { destination } = result;
    if (!destination) return;

    if (destination.droppableId === "droppedTopics") {
      handleDropped(result);
    }
  }

  function onTopicScoreChange(index: number, score: number) {
    const topic = droppedTopics[index];
    (topic as GeneratorTopic).score = score;

    setDroppedTopics([...droppedTopics]);
  }

  function onDecoratorDelete(index: number) {
    const [decorator] = droppedTopics.splice(index, 1);
    decorators.splice(
      decorator.sourceIndex as number,
      0,
      decorator as GeneratorDecorator
    );

    setDecorators([...decorators]);
  }

  function onTopicDelete(index: number) {
    const [topic] = droppedTopics.splice(index, 1);
    topics.splice(topic.sourceIndex as number, 0, topic as GeneratorTopic);

    setTopics([...topics]);
  }

  return (
    <Container
      className={css`
        padding: 24px;
      `}
    >
      {/* Name and gender */}
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
      {/* End of Name and gender */}

      <DragDropContext onDragEnd={onDropEnd}>
        {/* Decorators Section */}
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

            {!isDecoratorsLoading && decorators.length === 0 ? (
              <div
                className={css`
                  text-align: center;
                `}
              >
                <Header as="h3">No decorators available</Header>
                {hasDecorators ? (
                  <p>All decorators are used</p>
                ) : (
                  <p>
                    Go to <Link to="my-space">My Space</Link> to start adding
                    topics
                  </p>
                )}
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
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </Segment>
        </Segment>
        {/* End of Decorators section */}

        {/* Topics Section */}
        <Segment>
          <Header as="h3">Topics</Header>
          <Segment>
            {isTopicsLoading && isBlocksLoading && (
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

            {!isTopicsLoading && !isBlocksLoading && topics.length === 0 ? (
              <div
                className={css`
                  text-align: center;
                `}
              >
                <Header as="h3">No topics available</Header>
                {hasTopics ? (
                  <p>All topics are used</p>
                ) : (
                  <p>
                    Go to <Link to="my-space">My Space</Link> to start adding
                    topics
                  </p>
                )}
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
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </Segment>
        </Segment>
        {/* End of Topics section */}

        {/* Dropped Items */}
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
                  {droppedTopics.length === 0 && (
                    <div
                      className={css`
                        text-align: center;
                        opacity: ${snapshot.isDraggingOver ? 0 : 1};
                        transition: opacity 0.15s;
                      `}
                    >
                      <Header size="small">
                        Drag Decorator or Topic and drop here to start
                        generating your feedback
                      </Header>
                      <Icon name="inbox" size="huge" />
                    </div>
                  )}

                  {droppedTopics.map((droppedTopic, index) => {
                    const isDroppedTopic = isTopic(droppedTopic);

                    if (isDroppedTopic) {
                      return (
                        <DroppedTopic
                          key={droppedTopic.id}
                          topic={droppedTopic}
                          blocks={blocks[droppedTopic.id] || []}
                          onTopicScoreChange={onTopicScoreChange}
                          onTopicDelete={() => onTopicDelete(index)}
                          index={index}
                          name={values.Name}
                          gender={
                            values.Gender as "maleContent" | "femaleContent"
                          }
                        />
                      );
                    } else {
                      return (
                        <DroppedDecorator
                          key={droppedTopic.id}
                          decorator={droppedTopic}
                          onDecoratorDelete={() => onDecoratorDelete(index)}
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
        {/* End of Dropped Items */}
      </DragDropContext>
    </Container>
  );
};

export default Generator;
