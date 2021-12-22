import { useState, FormEvent } from "react";
import { css } from "@emotion/css";
import { Icon, Modal, Button, Form, Input } from "semantic-ui-react";

import { Topic } from "~/types";
import { useAddDocument } from "~/hooks/useCrud";

const AddTopic = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [isTouched, setTouched] = useState(false);
  const [addTopic] = useAddDocument<Topic>("topics");
  const isError = isTouched && !topic;

  function submitTopic() {
    if (!topic) {
      setTouched(true);
    } else {
      addTopic({ name: topic });
      setModalOpen(false);
    }
  }

  return (
    <>
      <button
        className={css`
          background-color: transparent;
          outline: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          opacity: 0.5 !important;

          &:hover {
            opacity: 1 !important;
          }

          i {
            margin: 0;
          }
        `}
        onClick={() => setModalOpen(true)}
      >
        <Icon name="plus" />
      </button>

      <Modal
        dimmer="blurring"
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setTopic("");
          setTouched(false);
        }}
        size="tiny"
      >
        <Modal.Header>Add new topic</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field
              id="topic"
              control={Input}
              label="Topic"
              error={
                isError && {
                  content: "Topic is required",
                  pointing: "above",
                }
              }
              onChange={(e: FormEvent<HTMLInputElement>) => {
                setTopic(e.currentTarget.value);
              }}
              onBlur={() => setTouched(true)}
              autoFocus
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button positive onClick={submitTopic}>
            Submit
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default AddTopic;
