import { useState, useEffect } from "react";
import { css } from "@emotion/css";
import { where } from "firebase/firestore";
import { Header, Popup, Button } from "semantic-ui-react";

import { useDeleteDocument } from "~/hooks/useCrud";
import { useBlocksCollection } from "~resources/useBlocksCollection";

import { Topic, Block } from "~/types";

type TopicProps = {
  topic: Topic;
};

const Topic = ({ topic }: TopicProps) => {
  const [blocksRef] = useBlocksCollection(where("topic", "==", topic.id));
  const [, setBlocks] = useState<Block[] | null>();
  const [deleteTopic, isDeleteTopicLoading] = useDeleteDocument("topics");

  useEffect(() => {
    const blocksValues: Block[] = [];
    blocksRef?.forEach((document) =>
      blocksValues.push({
        id: document.id,
        ...document.data(),
      } as Block)
    );

    setBlocks(blocksValues);
  }, [blocksRef]);

  return (
    <>
      <div
        className={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <Header size="huge">{topic.name}</Header>
        <Popup
          content={`Delete ${topic.name}`}
          trigger={
            <Button
              circular
              color="red"
              icon="trash"
              onClick={() => deleteTopic(topic.id)}
              disabled={isDeleteTopicLoading}
            />
          }
        />
      </div>
    </>
  );
};

export default Topic;
