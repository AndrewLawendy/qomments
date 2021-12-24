import { useState, useEffect } from "react";
import { Container, Header, Button, Loader } from "semantic-ui-react";
import { css } from "@emotion/css";

import { useAuthContext } from "~contexts/AuthContext";
import { useTopicsCollection } from "~/resources/useTopicsCollection";
import { Topic as TopicType } from "~types";

import Decorator from "./Decorator";
import Topic from "./Topic";
import AddTopic from "./AddTopic";

const MySpace = () => {
  const { authData } = useAuthContext();
  const [activeBlock, setActiveBlock] = useState("Introduction");
  const [mountBlocks, setMountBlocks] = useState<{ [key: string]: boolean }>({
    Introduction: true,
  });
  const [topicsRef, isTopicsLoading] = useTopicsCollection();
  const [topics, setTopics] = useState<TopicType[]>([]);

  useEffect(() => {
    const topicsValues: TopicType[] = [];
    topicsRef?.forEach((topic) =>
      topicsValues.push({
        id: topic.id,
        ...topic.data(),
      } as TopicType)
    );

    setTopics(topicsValues);
  }, [topicsRef]);

  if (authData === null) return null;

  return (
    <>
      <aside
        className={css`
          position: sticky;
          top: 56px;
          width: 250px;
          height: calc(100vh - 56px);
          padding: 48px 16px;
          background-color: #ffeaa7;
          border-right: 2px solid #fab139;
        `}
      >
        <Header as="h2">Welcome {authData.displayName}</Header>

        <Header as="h4">Decorators</Header>
        <div
          className={css`
            button:nth-of-type(1n + 2) {
              margin-top: 16px;
            }
          `}
        >
          <Button
            fluid
            content="Introduction"
            icon="bookmark"
            labelPosition="left"
            color={activeBlock === "Introduction" ? "orange" : "yellow"}
            onClick={() => {
              setActiveBlock("Introduction");
              setMountBlocks({ ...mountBlocks, Introduction: true });
            }}
          />
          <Button
            fluid
            content="Closing"
            icon="bookmark"
            labelPosition="left"
            color={activeBlock === "Closing" ? "orange" : "yellow"}
            onClick={() => {
              setActiveBlock("Closing");
              setMountBlocks({ ...mountBlocks, Closing: true });
            }}
          />
        </div>

        <div
          className={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 32px;
            margin-bottom: 14px;
          `}
        >
          <Header
            as="h4"
            className={css`
              margin-bottom: 0 !important;
            `}
          >
            Topics
          </Header>
          <AddTopic />
        </div>

        {isTopicsLoading && (
          <Loader active inline="centered">
            Loading Topics
          </Loader>
        )}
        <div
          className={css`
            button:nth-of-type(1n + 2) {
              margin-top: 16px;
            }
          `}
        >
          {topics.map((topic) => (
            <Button
              key={topic.id}
              fluid
              content={topic.name}
              icon="bookmark"
              labelPosition="left"
              color={activeBlock === topic.id ? "orange" : "yellow"}
              onClick={() => {
                setActiveBlock(topic.id);
                setMountBlocks({ ...mountBlocks, [topic.id]: true });
              }}
            />
          ))}
        </div>
      </aside>
      <article
        className={css`
          flex-grow: 1;
        `}
      >
        <Container
          className={css`
            padding: 48px 24px;
          `}
        >
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
        </Container>
      </article>
    </>
  );
};

export default MySpace;
