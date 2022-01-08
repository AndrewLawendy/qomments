import { useState, useEffect } from "react";
import { Link } from "wouter";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import readingTime, { ReadTimeResults } from "reading-time";
import {
  Segment,
  Header,
  Form,
  Dimmer,
  Loader,
  Placeholder,
  Icon,
  Button,
  Message,
  List,
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
import EditContent from "./EditContent";

import useRequiredForm from "~hooks/useRequiredForm";
import { useTopicsCollection } from "~/resources/useTopicsCollection";
import { useDecoratorsCollection } from "~/resources/useDecoratorsCollection";
import { useBlocksCollection } from "~resources/useBlocksCollection";

import { Block } from "~/types";
import { GeneratorDecorator, GeneratorTopic, BlocksValues } from "./types";

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

let isListeningToBeforeUnload = false;

function isTopic(
  droppedTopic: GeneratorDecorator | GeneratorTopic
): droppedTopic is GeneratorTopic {
  return (droppedTopic as GeneratorTopic).name !== undefined;
}

function onBeforeUnload(e: BeforeUnloadEvent) {
  e.preventDefault();
  e.returnValue = "";
}

const Generator = () => {
  const {
    values: formValues,
    errors,
    onChange,
    onBlur,
    setFieldValue,
    setFieldTouched,
    isValid,
    handleSubmit,
  } = useRequiredForm({
    Name: "",
    Gender: "",
    "Max Characters": "1000",
  });
  const [isCopyButtonClick, setCopyButtonClick] = useState(false);
  const [decoratorsRef, isDecoratorsLoading] = useDecoratorsCollection();
  const [decorators, setDecorators] = useState<GeneratorDecorator[]>([]);
  const [hasDecorators, setHasDecorators] = useState(false);

  const [topicsRef, isTopicsLoading] = useTopicsCollection();
  const [topics, setTopics] = useState<GeneratorTopic[]>([]);
  const [hasTopics, setHasTopics] = useState(false);

  const [blocksRef, isBlocksLoading] = useBlocksCollection();
  const [blocks, setBlocks] = useState<BlocksValues>({});

  const [droppedTopics, setDroppedTopics] = useState<
    Array<GeneratorDecorator | GeneratorTopic>
  >([]);
  const hasDroppedTopics = droppedTopics.length > 0;

  const [topicsContent, setTopicsContent] = useState("");
  const hasContent = topicsContent.length > 0;

  const [contentReadingTime, setContentReadingTime] =
    useState<ReadTimeResults>();

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
    const blocksValues: BlocksValues = {};
    blocksRef?.forEach((document) => {
      const block: Block = {
        id: document.id,
        ...(document.data() as Omit<Block, "id">),
      };

      if (!blocksValues[block.topic]) {
        blocksValues[block.topic] = { levels: [], blocks: {}, length: 0 };
      }

      blocksValues[block.topic].levels.push(block.level);
      blocksValues[block.topic].blocks[block.level] = block;
      blocksValues[block.topic].length++;
    });

    setBlocks(blocksValues);
  }, [blocksRef]);

  useEffect(() => {
    const topicContentElements = document.querySelectorAll(".topic-content");
    const topicsContent = [...topicContentElements]
      .map((element: Element) => element.textContent)
      .join(" ");
    const hasTopicContentElements = topicContentElements.length > 0;
    const readingTimeResult = readingTime(topicsContent);

    handleBeforeUnload(hasTopicContentElements);
    setTopicsContent(topicsContent);
    setContentReadingTime(readingTimeResult);
  }, [droppedTopics, formValues]);

  useEffect(
    () => () => window.removeEventListener("beforeunload", onBeforeUnload),
    []
  );

  function handleBeforeUnload(hasTopicContentElements: boolean) {
    if (hasTopicContentElements) {
      if (!isListeningToBeforeUnload) {
        window.addEventListener("beforeunload", onBeforeUnload);
        isListeningToBeforeUnload = true;
      }
    } else {
      if (isListeningToBeforeUnload) {
        window.removeEventListener("beforeunload", onBeforeUnload);
        isListeningToBeforeUnload = false;
      }
    }
  }

  function handleDropped({ source, destination }: DropResult) {
    let droppedItem: GeneratorDecorator | GeneratorTopic;
    if (source.droppableId === (destination as DraggableLocation).droppableId) {
      // Reorder
      [droppedItem] = droppedTopics.splice(source.index, 1);
    } else {
      // Drop

      if (source.droppableId === "availableDecorators") {
        [droppedItem] = decorators.splice(source.index, 1);

        setDecorators([...decorators]);
      } else {
        [droppedItem] = topics.splice(source.index, 1);

        setTopics([...topics]);
      }
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

  function onTopicLevelChange(index: number, level: string) {
    const topic = droppedTopics[index];
    (topic as GeneratorTopic).level = level;

    setDroppedTopics([...droppedTopics]);
  }

  function onDecoratorDelete(index: number) {
    const [decorator] = droppedTopics.splice(index, 1);
    decorators.splice(
      decorator.sourceIndex as number,
      0,
      decorator as GeneratorDecorator
    );

    setDroppedTopics([...droppedTopics]);
    setDecorators([...decorators]);
  }

  function onTopicDelete(index: number) {
    const [topic] = droppedTopics.splice(index, 1);
    topics.splice(topic.sourceIndex as number, 0, topic as GeneratorTopic);

    setDroppedTopics([...droppedTopics]);
    setTopics([...topics]);
  }

  function copyContent() {
    if (!isCopyButtonClick) setCopyButtonClick(true);

    handleSubmit(() => {
      if (!hasDroppedTopics || !hasContent) return;

      copy(topicsContent);
      toast.success("qomment is copied successfully");
    });
  }

  return (
    <div
      className={css`
        width: 100%;
        max-width: 1127px;
        padding: 24px;
        margin: 0 auto;
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
              value={formValues.Name}
              error={errors.Name}
              onChange={onChange}
              onBlur={onBlur}
            />
            <Form.Select
              options={genderOptions}
              label="Gender"
              name="Gender"
              value={formValues.Gender}
              error={errors.Gender}
              onChange={(_, { value }) =>
                setFieldValue("Gender", value as string)
              }
              onBlur={() => setFieldTouched("Gender")}
            />
            <Form.Input
              type="number"
              min="1"
              label="Max Characters"
              name="Max Characters"
              value={formValues["Max Characters"]}
              error={errors["Max Characters"]}
              onChange={onChange}
              onBlur={onBlur}
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
                  {!hasDroppedTopics && (
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
                          blockValues={
                            blocks[droppedTopic.id] || {
                              levels: [],
                              blocks: {},
                              length: 0,
                            }
                          }
                          onTopicLevelChange={onTopicLevelChange}
                          onTopicDelete={() => onTopicDelete(index)}
                          index={index}
                          name={formValues.Name}
                          gender={
                            formValues.Gender as "maleContent" | "femaleContent"
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
                          name={formValues.Name}
                        />
                      );
                    }
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Segment>

          {isCopyButtonClick && (!isValid || !hasDroppedTopics || !hasContent) && (
            <Message
              attached="bottom"
              warning
              icon
              className={css`
                margin-top: -1.2rem !important;
                margin-right: 0 !important;
                margin-left: 0 !important;
              `}
            >
              <Icon name="exclamation" />

              <Message.Content>
                <Message.Header>
                  Can not copy for the following reasons
                </Message.Header>

                <List>
                  {!isValid && (
                    <List.Item
                      icon="angle right"
                      content="No name and gender"
                    />
                  )}
                  {!hasDroppedTopics && (
                    <List.Item icon="angle right" content="No dropped topic" />
                  )}
                  {!hasContent && (
                    <List.Item icon="angle right" content="No content" />
                  )}
                </List>
              </Message.Content>
            </Message>
          )}

          {contentReadingTime && (
            <div
              className={css`
                color: #757575;
                margin-bottom: 14px;
              `}
            >
              <Icon name="clock outline" />
              <span>{contentReadingTime.text}</span>{" "}
              <Icon name="file word outline" />
              <span>{contentReadingTime.words} word(s)</span>{" "}
              <span
                className={css({
                  display: "inline-block",
                  color:
                    topicsContent.length > Number(formValues["Max Characters"])
                      ? "#db2828"
                      : "inherit",
                  animation:
                    topicsContent.length > Number(formValues["Max Characters"])
                      ? "bounce 1s ease"
                      : undefined,

                  transition: "all .3s",
                })}
              >
                <Icon name="i cursor" />
                <span>{topicsContent.length} characters</span>
              </span>
            </div>
          )}
          <div
            className={css`
              text-align: center;
            `}
          >
            <Button color="yellow" onClick={copyContent}>
              <Icon name="copy outline" />
              Copy qomment
            </Button>

            <EditContent
              content={topicsContent}
              maxCharacters={Number(formValues["Max Characters"])}
            />
          </div>
        </Segment>
        {/* End of Dropped Items */}
      </DragDropContext>
    </div>
  );
};

export default Generator;
