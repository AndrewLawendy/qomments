import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { css } from "@emotion/css";
import { where } from "firebase/firestore";
import {
  Header,
  Popup,
  Button,
  Segment,
  Placeholder,
  Grid,
  Message,
  Icon,
  Confirm,
} from "semantic-ui-react";

import { useDeleteDocument } from "~/hooks/useCrud";
import { useBlocksCollection } from "~resources/useBlocksCollection";

import Block from "./Block";

import { Topic, Block as BlockType } from "~/types";

type TopicProps = {
  topic: Topic;
};

const Topic = ({ topic }: TopicProps) => {
  const [, setLocation] = useLocation();
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [blocksRef, isBlocksLoading] = useBlocksCollection(
    where("topic", "==", topic.id)
  );
  const [blocks, setBlocks] = useState<Array<BlockType | null>>([]);
  const [deleteTopic, isDeleteTopicLoading] = useDeleteDocument("topics");
  const [deleteBlock] = useDeleteDocument("blocks");
  const [isAddTopicValidated, setAddTopicValidated] = useState(false);

  useEffect(() => {
    const blocksValues: BlockType[] = [];
    blocksRef?.forEach((document) =>
      blocksValues.push({
        id: document.id,
        ...document.data(),
      } as BlockType)
    );

    setBlocks(blocksValues);
    setAddTopicValidated(false);
  }, [blocksRef]);

  function addNewBlock() {
    setAddTopicValidated(true);
    const canAdd = isLastBlockConfirmed();
    if (canAdd) {
      setBlocks([...blocks, null]);
      setAddTopicValidated(false);
    }
  }

  function deleteLastBlock() {
    const verifiedBlocks = blocks.slice(0, blocks.length - 1);
    setBlocks(verifiedBlocks);
  }

  function isLastBlockConfirmed() {
    const lastBlock = blocks[blocks.length - 1];
    return lastBlock !== null;
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
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={isBlocksLoading || isDeleteTopicLoading}
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

      {isAddTopicValidated && !isLastBlockConfirmed() && (
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
          Can not add new topic while the last one is not confirmed yet
        </Message>
      )}

      <div
        className={css`
          margin-top: 12px;
          text-align: center;
        `}
      >
        <Button color="yellow" onClick={addNewBlock}>
          Add Topic Block
        </Button>
      </div>

      <Confirm
        dimmer="blurring"
        open={isDeleteConfirmOpen}
        content={`Are you sure you want to delete ${topic.name} with all its blocks?`}
        cancelButton={
          <Button color="red" onClick={() => setDeleteConfirmOpen(false)}>
            No
          </Button>
        }
        confirmButton={
          <Button
            color="green"
            onClick={() => {
              if (topic?.id) {
                setDeleteConfirmOpen(false);
                deleteTopic(topic.id);
                blocks.forEach((block) => block && deleteBlock(block.id));
                setLocation("/introduction");
              }
            }}
          >
            Yes
          </Button>
        }
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </>
  );
};

export default Topic;
