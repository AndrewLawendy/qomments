import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "react-toastify";
import { css } from "@emotion/css";
import { Icon, Modal, Button, Form, Input } from "semantic-ui-react";

import { Topic } from "~/types";
import { useAddDocument } from "~/hooks/useCrud";
import useRequiredForm from "~hooks/useRequiredForm";

const AddTopic = () => {
  const [, setLocation] = useLocation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [addTopic] = useAddDocument<Topic>("topics");
  const { values, errors, onChange, onBlur, destroyForm, handleSubmit } =
    useRequiredForm({
      Topic: "",
    });

  function submitTopic() {
    handleSubmit(({ Topic }) => {
      addTopic({ name: Topic }).then(({ id }) => {
        setLocation(`/${id}`);
        toast.success(`Topic ${Topic} is added successfully`);
      });
      setModalOpen(false);
      destroyForm();
    });
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
          destroyForm();
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
              name="Topic"
              value={values.Topic}
              onChange={onChange}
              onBlur={onBlur}
              error={errors.Topic}
              autoFocus
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={() => {
              setModalOpen(false);
              destroyForm();
            }}
          >
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
