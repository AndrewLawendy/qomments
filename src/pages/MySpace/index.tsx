import { useState, useEffect } from "react";
import { Route, Redirect, useRoute } from "wouter";
import {
  Message,
  Segment,
  Placeholder,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import { css } from "@emotion/css";

import { useAuthContext } from "/src/contexts/AuthContext";
import { useTopicsCollection } from "/src/resources/useTopicsCollection";
import { Topic as TopicType } from "/src/types";

import Aside from "./Aside";
import ActiveBlock from "./ActiveBlock";
import TopicNotFound from "./TopicNotFound";

const MySpace = () => {
  const { authData } = useAuthContext();
  const [, params] = useRoute("/:activeBlock");
  const [paths, setPaths] = useState(["introduction", "closing"]);
  const [mountBlocks, setMountBlocks] = useState<{ [key: string]: boolean }>({
    [params?.activeBlock || "introduction"]: true,
  });
  const [topicsRef, isTopicsLoading] = useTopicsCollection();
  const [topics, setTopics] = useState<TopicType[]>([]);
  const isPathValid = paths.includes(params?.activeBlock || "");

  useEffect(() => {
    const topicsValues: TopicType[] = [];
    const topicsPaths: string[] = [];
    topicsRef?.forEach((topic) => {
      topicsValues.push({
        id: topic.id,
        ...topic.data(),
      } as TopicType);
      topicsPaths.push(topic.id);
    });

    setTopics(topicsValues);
    setPaths(["introduction", "closing", ...topicsPaths]);
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
      {!params && <Redirect to="/introduction" replace />}
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
        <div
          className={css`
            width: 100%;
            max-width: 1127px;
            padding: 24px;
            margin: 0 auto;
          `}
        >
          <Segment raised>
            {isTopicsLoading ? (
              <>
                <Dimmer active inverted>
                  <Loader inverted>Loading topics</Loader>
                </Dimmer>

                <Placeholder fluid>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder>
              </>
            ) : (
              <>
                <Route path="/:activeBlock">
                  {({ activeBlock }) => (
                    <ActiveBlock
                      activeBlock={activeBlock}
                      mountBlocks={mountBlocks}
                      topics={topics}
                    />
                  )}
                </Route>

                {isPathValid ? (
                  <Message
                    info
                    icon="info circle"
                    header="Hint"
                    content="You can always refer to the person's name using this character
            (*)"
                  />
                ) : (
                  <TopicNotFound />
                )}
              </>
            )}
          </Segment>
        </div>
      </article>
    </>
  );
};

export default MySpace;
