import { useState, useEffect } from "react";
import { Route, Redirect, useRoute } from "wouter";
import { Container, Message } from "semantic-ui-react";
import { css } from "@emotion/css";

import { useAuthContext } from "~contexts/AuthContext";
import { useTopicsCollection } from "~/resources/useTopicsCollection";
import { Topic as TopicType } from "~types";

import Aside from "./Aside";
import ActiveBlock from "./ActiveBlock";

const MySpace = () => {
  const { authData } = useAuthContext();
  const [, params] = useRoute("/:activeBlock");
  const [mountBlocks, setMountBlocks] = useState<{ [key: string]: boolean }>({
    [params?.activeBlock || "introduction"]: true,
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

  useEffect(() => {
    if (params?.activeBlock) {
      if (!mountBlocks[params.activeBlock]) {
        setMountBlocks({ ...mountBlocks, [params.activeBlock]: true });
      }
    }
  }, [params]);

  if (authData === null) return null;

  return (
    <>
      {!params && <Redirect to="/introduction" />}
      <Aside
        userName={authData.displayName}
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
          <Route path="/:activeBlock">
            {({ activeBlock }) => (
              <ActiveBlock
                activeBlock={activeBlock}
                mountBlocks={mountBlocks}
                topics={topics}
              />
            )}
          </Route>

          {!isTopicsLoading && (
            <Message
              info
              icon="info circle"
              header="Hint"
              content="You can always refer to the person's name using this character
              (*)"
            />
          )}
        </Container>
      </article>
    </>
  );
};

export default MySpace;
