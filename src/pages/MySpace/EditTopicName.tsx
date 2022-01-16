import { useState } from "react";
import { toast } from "react-toastify";
import { Popup, Button, Modal, Form } from "semantic-ui-react";

import { Topic } from "/src/types";

import { useUpdateDocument } from "/src/hooks/useCrud";
import useRequiredForm, { Values } from "/src/hooks/useRequiredForm";

type EditTopicNameProps = {
  topic: Topic;
};

const EditTopicName = ({ topic }: EditTopicNameProps) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [updateTopic, isUpdateTopicLoading] =
    useUpdateDocument<Topic>("topics");
  const { values, errors, onChange, onBlur, destroyForm, handleSubmit } =
    useRequiredForm({
      "Topic Name": topic.name,
    });

  function submitTopicName({ "Topic Name": topicName }: Values) {
    updateTopic(topic.id, { name: topicName }).then(() =>
      toast.success(
        `Topic ${topic.name} is updated successfully to ${topicName}`
      )
    );
    setOpenPopup(false);
  }

  return (
    <>
      <Popup
        content={`Edit Topic Name`}
        trigger={
          <Button
            circular
            color="yellow"
            icon="edit"
            onClick={() => setOpenPopup(true)}
            disabled={isUpdateTopicLoading}
          />
        }
      />

      <Modal
        dimmer="blurring"
        open={openPopup}
        onClose={() => {
          setOpenPopup(false);
          destroyForm();
        }}
        size="tiny"
      >
        <Modal.Header>Edit Topic Name</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label="Topic Name"
              name="Topic Name"
              value={values["Topic Name"]}
              error={errors["Topic Name"]}
              onChange={onChange}
              onBlur={onBlur}
              autoFocus={true}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={() => {
              setOpenPopup(false);
              destroyForm();
            }}
          >
            Cancel
          </Button>

          <Button positive onClick={() => handleSubmit(submitTopicName)}>
            Submit
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default EditTopicName;
