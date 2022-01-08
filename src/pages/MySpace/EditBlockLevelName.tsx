import { useState } from "react";
import { toast } from "react-toastify";
import { Popup, Button, Modal, Form } from "semantic-ui-react";

import { useUpdateDocument } from "~/hooks/useCrud";
import useRequiredForm, { Values } from "~hooks/useRequiredForm";

import { Block } from "~types";
import { TemporaryBlock } from "./types";

type EditBlockNameProps = {
  block: Block | TemporaryBlock;
  level: string;
  setLevel: React.Dispatch<React.SetStateAction<string>>;
};

const EditBlockLevelName = ({ block, level, setLevel }: EditBlockNameProps) => {
  const [openPopup, setOpenPopup] = useState(false);
  const {
    values,
    errors,
    onChange,
    onBlur,
    handleSubmit,
    destroyForm,
    reInitializeForm,
  } = useRequiredForm({
    "Level Name": level,
  });

  const [updateBlock, isUpdateBlockLoading] =
    useUpdateDocument<Block>("blocks");

  function updateBlockLevel({ "Level Name": level }: Values) {
    setOpenPopup(false);
    reInitializeForm({ "Level Name": level });

    if (block.id) {
      updateBlock(block.id, { level }).then(() => {
        toast.success(`Level Name is updated successfully to ${level}`);
      });
    } else {
      setLevel(level);
    }
  }

  return (
    <>
      <Popup
        content="Edit Block Level Name"
        trigger={
          <Button
            circular
            color="yellow"
            icon="edit"
            onClick={() => setOpenPopup(true)}
            disabled={isUpdateBlockLoading}
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
        <Modal.Header>Choose block level</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label="Level Name"
              name="Level Name"
              value={values["Level Name"]}
              error={errors["Level Name"]}
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

          <Button positive onClick={() => handleSubmit(updateBlockLevel)}>
            Submit
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default EditBlockLevelName;
