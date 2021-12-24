import { useRoute, useLocation } from "wouter";
import { Header, Button, Loader, Segment } from "semantic-ui-react";
import { css } from "@emotion/css";

import AddTopic from "./AddTopic";

import { Topic } from "~/types";

type AsideProps = {
  userName: string | null;
  mountBlocks: {
    [key: string]: boolean;
  };
  isTopicsLoading: boolean;
  topics: Topic[];
};

const Aside = ({ userName, isTopicsLoading, topics }: AsideProps) => {
  const [, params] = useRoute("/:activeBlock");
  const [, setLocation] = useLocation();

  return (
    <aside
      className={css`
        position: sticky;
        top: 56px;
        width: 250px;
        height: calc(100vh - 56px);
      `}
    >
      <Segment
        raised
        className={css`
          height: 100%;
        `}
      >
        <Header as="h2">Welcome {userName}</Header>

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
            color={params?.activeBlock === "introduction" ? "orange" : "yellow"}
            onClick={() => {
              setLocation("/introduction");
            }}
          />
          <Button
            fluid
            content="Closing"
            icon="bookmark"
            labelPosition="left"
            color={params?.activeBlock === "closing" ? "orange" : "yellow"}
            onClick={() => {
              setLocation("/closing");
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
              color={params?.activeBlock === topic.id ? "orange" : "yellow"}
              onClick={() => {
                setLocation(`/${topic.id}`);
              }}
            />
          ))}
        </div>
      </Segment>
    </aside>
  );
};

export default Aside;
