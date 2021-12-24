import { useState, useEffect } from "react";
import { css } from "@emotion/css";
import { where } from "firebase/firestore";
import {
  Header,
  Popup,
  Button,
  Segment,
  Placeholder,
  Grid,
} from "semantic-ui-react";

import { useDeleteDocument } from "~/hooks/useCrud";
import { useBlocksCollection } from "~resources/useBlocksCollection";

import Block from "./Block";

import { Topic, Block as BlockType } from "~/types";

type TopicProps = {
  topic: Topic;
};

const Topic = ({ topic }: TopicProps) => {
  const [blocksRef, isBlocksLoading] = useBlocksCollection(
    where("topic", "==", topic.id)
  );
  const [blocks, setBlocks] = useState<Array<BlockType | null>>([]);
  const [deleteTopic, isDeleteTopicLoading] = useDeleteDocument("topics");

  useEffect(() => {
    const blocksValues: BlockType[] = [];
    blocksRef?.forEach((document) =>
      blocksValues.push({
        id: document.id,
        ...document.data(),
      } as BlockType)
    );

    setBlocks(blocksValues);
  }, [blocksRef]);

  function addNewBlock() {
    setBlocks([...blocks, null]);
  }

  function deleteLastBlock() {
    const verifiedBlocks = blocks.slice(0, blocks.length - 1);
    setBlocks(verifiedBlocks);
  }

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

      {blocks.length == 0 && (
        <>
          <Segment loading={isBlocksLoading}>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Placeholder fluid>
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder>
                </Grid.Column>
                <Grid.Column>
                  <Placeholder fluid>
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>

          {!isBlocksLoading && (
            <div
              className={css`
                text-align: center;
              `}
            >
              <Header size="tiny">No blocks attributed to this topic</Header>
              <Button color="yellow" onClick={addNewBlock}>
                Add Topic Block
              </Button>
            </div>
          )}
        </>
      )}

      {blocks.map((block, index) => (
        <Block
          key={`${block?.id}-${index}`}
          block={block}
          topicId={topic.id}
          index={index}
          isLast={blocks.length - 1 == index}
          deleteLastBlock={deleteLastBlock}
        />
      ))}
    </>
  );
};

export default Topic;
