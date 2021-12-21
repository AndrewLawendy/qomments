import { useState, useEffect } from "react";
import { Container, Header, Button } from "semantic-ui-react";
import { css } from "@emotion/css";

import { useAuthContext } from "~contexts/AuthContext";

import { useDecoratorsCollection } from "~/resources/useDecoratorsCollection";
import { useTopicsCollection } from "~/resources/useTopicsCollection";

import Decorator from "./Decorator";
import AddTopic from "./AddTopic";

const MySpace = () => {
  const { authData } = useAuthContext();
  const [activeBlock, setActiveBlock] = useState("Introduction");
  const [decoratorsRef, isDecoratorsLoading] = useDecoratorsCollection();
  const [decorators, setDecorators] = useState([]);
  const introductionDecorator = decorators.find(
    ({ type }) => type === "Introduction"
  );
  const closingDecorator = decorators.find(({ type }) => type === "Closing");

  const [topicsRef] = useTopicsCollection();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const decoratorsValues = [];
    decoratorsRef?.forEach((document) =>
      decoratorsValues.push({
        id: document.id,
        ...document.data(),
      })
    );

    setDecorators(decoratorsValues);
  }, [decoratorsRef]);

  useEffect(() => {
    const topicsValues = [];
    topicsRef?.forEach((topic) =>
      topicsValues.push({
        id: topic.id,
        ...topic.data(),
      })
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
            onClick={() => setActiveBlock("Introduction")}
          />
          <Button
            fluid
            content="Closing"
            icon="bookmark"
            labelPosition="left"
            color={activeBlock === "Closing" ? "orange" : "yellow"}
            onClick={() => setActiveBlock("Closing")}
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
              onClick={() => setActiveBlock(topic.id)}
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
            padding-top: 48px;
            padding-bottom: 48px;
          `}
        >
          <div
            className={css`
              display: ${activeBlock === "Introduction" ? "block" : "none"};
            `}
          >
            <Decorator
              type="Introduction"
              isLoading={isDecoratorsLoading}
              value={introductionDecorator}
            />
          </div>

          <div
            className={css`
              display: ${activeBlock === "Closing" ? "block" : "none"};
            `}
          >
            <Decorator
              type="Closing"
              isLoading={isDecoratorsLoading}
              value={closingDecorator}
            />
          </div>
        </Container>
      </article>
    </>
  );
};

export default MySpace;
