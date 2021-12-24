import { Dispatch } from "react";
import { Header, Button, Loader } from "semantic-ui-react";
import { css } from "@emotion/css";

import AddTopic from "./AddTopic";

import { Topic } from "~/types";

type AsideProps = {
  userName: string | null;
  activeBlock: string;
  setActiveBlock: Dispatch<React.SetStateAction<string>>;
  setMountBlocks: Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
  mountBlocks: {
    [key: string]: boolean;
  };
  isTopicsLoading: boolean;
  topics: Topic[];
};

const Aside = ({
  userName,
  activeBlock,
  setActiveBlock,
  setMountBlocks,
  mountBlocks,
  isTopicsLoading,
  topics,
}: AsideProps) => {
  return (
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
  );
};

export default Aside;
