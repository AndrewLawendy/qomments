import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Segment,
  Header,
  Popup,
  Button,
  Confirm,
  Grid,
  Form,
  Icon,
} from "semantic-ui-react";
import { css } from "@emotion/css";

import {
  useAddDocument,
  useUpdateDocument,
  useDeleteDocument,
} from "~/hooks/useCrud";
import useRequiredForm from "~hooks/useRequiredForm";

import { Block } from "~/types";
import { TemporaryBlock } from "./types";

import EditBlockLevelName from "./EditBlockLevelName";
import BlockContent from "./BlockContent";

type BlockProps = {
  block: Block | TemporaryBlock;
  topicId: string;
  index: number;
  isLast: boolean;
  deleteLastBlock: () => void;
};

const Block = ({
  block,
  topicId,
  index,
  isLast,
  deleteLastBlock,
}: BlockProps) => {
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [level, setLevel] = useState(block.level || `Level ${index + 1}`);
  const [addBlock, isAddBlockLoading] = useAddDocument<Block>("blocks");
  const [updateBlock, isUpdateBlockLoading] =
    useUpdateDocument<Block>("blocks");
  const [deleteBlock, isDeleteBlockLoading] = useDeleteDocument("blocks");
  const { handleSubmit, ...form } = useRequiredForm({
    "Male Content": block.maleContent || "",
    "Female Content": block.femaleContent || "",
  });

  useEffect(() => {
    if (block.level) {
      setLevel(block.level);
    }
  }, [block.level]);

  function handleDelete() {
    if (block.id) {
      setDeleteConfirmOpen(true);
    } else {
      deleteLastBlock();
    }
  }

  return (
    <>
      <Segment>
        <div
          className={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          `}
        >
          <Header
            as="h3"
            className={css`
              margin: 0 !important;
            `}
          >
            {level}
          </Header>

          <div>
            {block.id ? (
              <Popup
                content={`Update ${level}`}
                trigger={
                  <Button
                    circular
                    color="blue"
                    icon="sync"
                    onClick={() =>
                      handleSubmit(
                        ({
                          "Male Content": maleContent,
                          "Female Content": femaleContent,
                        }) =>
                          updateBlock(block.id as string, {
                            maleContent,
                            femaleContent,
                          }).then(() =>
                            toast.success(`${level} is updated successfully`)
                          )
                      )
                    }
                    disabled={isUpdateBlockLoading}
                  />
                }
              />
            ) : (
              <Popup
                content={`Add ${level}`}
                trigger={
                  <Button
                    circular
                    color="green"
                    icon="plus"
                    onClick={() =>
                      handleSubmit(
                        ({
                          "Male Content": maleContent,
                          "Female Content": femaleContent,
                        }) =>
                          addBlock({
                            maleContent,
                            femaleContent,
                            level: level,
                            topic: topicId,
                          }).then(() =>
                            toast.success(`${level} is added successfully`)
                          )
                      )
                    }
                    disabled={isAddBlockLoading}
                  />
                }
              />
            )}
            <EditBlockLevelName
              block={block}
              level={level}
              setLevel={setLevel}
            />
            {isLast && (
              <Popup
                content="Delete Block"
                trigger={
                  <Button
                    circular
                    color="red"
                    icon="trash"
                    onClick={handleDelete}
                    disabled={isDeleteBlockLoading}
                  />
                }
              />
            )}
          </div>
        </div>
        <Form>
          <Grid stackable columns={2}>
            <Grid.Column>
              <BlockContent {...form} label="Male Content" />
            </Grid.Column>
            <Grid.Column>
              <BlockContent {...form} label="Female Content" />
            </Grid.Column>
          </Grid>
        </Form>
        {block.updatedAt && (
          <p
            className={css`
              margin-top: 1rem;
            `}
          >
            <Icon name="calendar alternate outline" /> Last updated:{" "}
            {block.updatedAt.toDate().toLocaleString()}
          </p>
        )}
      </Segment>

      <Confirm
        dimmer="blurring"
        open={isDeleteConfirmOpen}
        content={`Are you sure you want to delete ${level}?`}
        cancelButton={
          <Button color="red" onClick={() => setDeleteConfirmOpen(false)}>
            No
          </Button>
        }
        confirmButton={
          <Button
            color="green"
            onClick={() =>
              block.id &&
              deleteBlock(block.id).then(() =>
                toast.success(`${level} is deleted successfully`)
              )
            }
          >
            Yes
          </Button>
        }
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </>
  );
};

export default Block;
