import { useState } from "react";
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

type BlockProps = {
  block: Block | null;
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
  const [addBlock, isAddBlockLoading] = useAddDocument<Block>("blocks");
  const [updateBlock, isUpdateBlockLoading] =
    useUpdateDocument<Omit<Block, "topic" | "score">>("blocks");
  const [deleteBlock, isDeleteBlockLoading] = useDeleteDocument("blocks");
  const { values, errors, onChange, onBlur, handleSubmit } = useRequiredForm({
    "Male Content": block?.maleContent || "",
    "Female Content": block?.femaleContent || "",
  });
  const score = block?.score || index + 1;

  function handleDelete() {
    if (block?.id) {
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
            Score {score}
          </Header>

          <div>
            <Popup
              content={block?.id ? `Update ${score}` : `Add ${score}`}
              trigger={
                block?.id ? (
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
                          updateBlock(block.id, {
                            maleContent,
                            femaleContent,
                          })
                      )
                    }
                    disabled={isUpdateBlockLoading}
                  />
                ) : (
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
                            score: index,
                            topic: topicId,
                          })
                      )
                    }
                    disabled={isAddBlockLoading}
                  />
                )
              }
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
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Form.TextArea
                  className={css`
                    textarea {
                      resize: none !important;
                    }
                  `}
                  label="Male Content"
                  name="Male Content"
                  value={values["Male Content"]}
                  error={errors["Male Content"]}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.TextArea
                  className={css`
                    textarea {
                      resize: none !important;
                    }
                  `}
                  label="Female Content"
                  name="Female Content"
                  value={values["Female Content"]}
                  error={errors["Female Content"]}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        {block?.updatedAt && (
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
        open={isDeleteConfirmOpen}
        content={`Are you sure you want to delete Score ${score}`}
        cancelButton={
          <Button color="red" onClick={() => setDeleteConfirmOpen(false)}>
            No
          </Button>
        }
        confirmButton={
          <Button
            color="green"
            onClick={() => block?.id && deleteBlock(block.id)}
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
