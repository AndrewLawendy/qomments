import { useState, useEffect } from "react";
import { Container, Message } from "semantic-ui-react";
import { css } from "@emotion/css";

import { useAuthContext } from "~contexts/AuthContext";
import { useTopicsCollection } from "~/resources/useTopicsCollection";
import { Topic as TopicType } from "~types";

import Aside from "./Aside";
import ActiveBlock from "./ActiveBlock";

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
      <Aside
        userName={authData.displayName}
        activeBlock={activeBlock}
        setActiveBlock={setActiveBlock}
        setMountBlocks={setMountBlocks}
        mountBlocks={mountBlocks}
        isTopicsLoading={isTopicsLoading}
        topics={topics}
      />
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
          <ActiveBlock
            activeBlock={activeBlock}
            mountBlocks={mountBlocks}
            topics={topics}
          />

          <Message
            info
            icon="info circle"
            header="Hint"
            content="You can always refer to the person's name using this character
              (*)"
          />
        </Container>
      </article>
    </>
  );
};

export default MySpace;
