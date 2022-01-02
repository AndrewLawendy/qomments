import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "react-toastify";
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
import { css } from "@emotion/css";

import { useDeleteDocument } from "~/hooks/useCrud";
import { useBlocksCollection } from "~resources/useBlocksCollection";

import EditTopicName from "./EditTopicName";
import Block from "./Block";

import { Topic, Block as BlockType } from "~/types";
import { TemporaryBlock } from "./types";

type TopicProps = {
  topic: Topic;
};

const Topic = ({ topic }: TopicProps) => {
  const [, setLocation] = useLocation();
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [blocksRef, isBlocksLoading] = useBlocksCollection(
    where("topic", "==", topic.id)
  );
  const [blocks, setBlocks] = useState<Array<BlockType | TemporaryBlock>>([]);
  const [deleteTopic, isDeleteTopicLoading] = useDeleteDocument("topics");
  const [deleteBlock] = useDeleteDocument("blocks");
  const [isAddTopicValidated, setAddTopicValidated] = useState(false);
  const isTopicEmpty = blocks.length === 0;

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
    const canAdd = isTopicEmpty || isLastBlockConfirmed();
    if (canAdd) {
      setBlocks([...blocks, {}]);
      setAddTopicValidated(false);
    }
  }

  function deleteLastBlock() {
    const verifiedBlocks = blocks.slice(0, blocks.length - 1);
    setBlocks(verifiedBlocks);
  }

  function isLastBlockConfirmed() {
    const lastBlock = blocks[blocks.length - 1];
    return Boolean(lastBlock.id);
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
        <div>
          <EditTopicName topic={topic} />
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

      {isAddTopicValidated && !isTopicEmpty && !isLastBlockConfirmed() && (
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
                deleteTopic(topic.id).then(() =>
                  toast.success(`Topic ${topic.name} is updated successfully`)
                );
                blocks.forEach((block) => block.id && deleteBlock(block.id));
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
