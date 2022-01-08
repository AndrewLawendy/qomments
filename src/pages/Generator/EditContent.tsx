import { useState, useEffect } from "react";
import copy from "copy-to-clipboard";
import readingTime from "reading-time";
import { toast } from "react-toastify";
import { css } from "@emotion/css";
import { Button, Modal, Form, Icon } from "semantic-ui-react";

type EditContentProps = {
  content: string;
  maxCharacters: number;
  handleActionButtonClick: (onFormValid: () => void) => void;
};

const EditContent = ({
  content,
  maxCharacters,
  handleActionButtonClick,
}: EditContentProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editableContent, setEditableContent] = useState(content);
  const contentReadingTime = readingTime(editableContent);

  useEffect(() => {
    setEditableContent(content);
  }, [content]);

  function copyContent() {
    copy(editableContent);
    toast.success("qomment is copied successfully");
    setModalOpen(false);
    setEditableContent(content);
  }

  return (
    <>
      <Button
        icon="pencil alternate"
        content="Edit before copy"
        color="blue"
        onClick={() => handleActionButtonClick(() => setModalOpen(true))}
      />

      <Modal
        dimmer="blurring"
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditableContent(content);
        }}
        size="tiny"
      >
        <Modal.Header>Add new topic</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.TextArea
              label="Content"
              value={editableContent}
              onChange={({ target: { value } }) => setEditableContent(value)}
            />
          </Form>
          <div
            className={css`
              color: #757575;
              margin: 14px 0;
            `}
          >
            <Icon name="clock outline" />
            <span>{contentReadingTime.text}</span>{" "}
            <Icon name="file word outline" />
            <span>{contentReadingTime.words} word(s)</span>{" "}
            <span
              className={css({
                display: "inline-block",
                color:
                  editableContent.length > maxCharacters
                    ? "#db2828"
                    : "inherit",
                animation:
                  editableContent.length > maxCharacters
                    ? "bounce 1s ease"
                    : undefined,

                transition: "all .3s",
              })}
            >
              <Icon name="i cursor" />
              <span>{editableContent.length} characters</span>
            </span>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={() => {
              setModalOpen(false);
              setEditableContent(content);
            }}
          >
            Cancel
          </Button>
          <Button
            icon="copy outline"
            color="yellow"
            content="Copy qomment"
            onClick={copyContent}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default EditContent;
