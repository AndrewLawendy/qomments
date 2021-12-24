import { useState, useEffect } from "react";
import { css } from "@emotion/css";
import { where } from "firebase/firestore";
import {
  Segment,
  Header,
  Form,
  Popup,
  Button,
  Dimmer,
  Loader,
  Icon,
  Confirm,
} from "semantic-ui-react";

import { Decorator } from "~/types";

import {
  useAddDocument,
  useUpdateDocument,
  useDeleteDocument,
} from "~/hooks/useCrud";
import { useDecoratorsCollection } from "~/resources/useDecoratorsCollection";
import useRequiredForm from "~/hooks/useRequiredForm";

type DecoratorsProps = {
  title: "Introduction" | "Closing";
  type: "introduction" | "closing";
};

const Decorator = ({ title, type }: DecoratorsProps) => {
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [decoratorsRef, isDecoratorsLoading] = useDecoratorsCollection(
    where("type", "==", type)
  );
  const [decorator, setDecorator] = useState<Decorator | null>();

  const [addDecorator, isAddDecoratorLoading] =
    useAddDocument<Decorator>("decorators");
  const [updateDecorator, isUpdateDecoratorLoading] =
    useUpdateDocument<Omit<Decorator, "type">>("decorators");
  const [deleteDecorator, isDeleteDecoratorLoading] =
    useDeleteDocument("decorators");

  const {
    values,
    errors,
    onChange,
    onBlur,
    setFieldValue,
    destroyForm,
    handleSubmit,
  } = useRequiredForm({
    [title]: "",
  });

  useEffect(() => {
    const decoratorsValues: Decorator[] = [];
    decoratorsRef?.forEach((document) =>
      decoratorsValues.push({
        id: document.id,
        ...document.data(),
      } as Decorator)
    );

    const [decorator] = decoratorsValues;
    setDecorator(decorator);
    setFieldValue(title, decorator?.body || "");
  }, [decoratorsRef]);

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
            {title}
          </Header>
          <div>
            {!isDecoratorsLoading && (
              <Popup
                content={decorator?.id ? `Update ${title}` : `Add ${title}`}
                trigger={
                  decorator?.id ? (
                    <Button
                      circular
                      color="blue"
                      icon="sync"
                      onClick={() =>
                        handleSubmit(({ [title]: body }) =>
                          updateDecorator(decorator.id, {
                            body,
                          })
                        )
                      }
                      disabled={isUpdateDecoratorLoading}
                    />
                  ) : (
                    <Button
                      circular
                      color="green"
                      icon="plus"
                      onClick={() =>
                        handleSubmit(({ [title]: body }) =>
                          addDecorator({
                            body,
                            type,
                          })
                        )
                      }
                      disabled={isAddDecoratorLoading}
                    />
                  )
                }
              />
            )}
            {decorator?.id && (
              <Popup
                content={`Delete ${title}`}
                trigger={
                  <Button
                    circular
                    color="red"
                    icon="trash"
                    onClick={() => setDeleteConfirmOpen(true)}
                    disabled={isDeleteDecoratorLoading}
                  />
                }
              />
            )}
          </div>
        </div>
        <Form>
          <Form.TextArea
            name={title}
            placeholder={`Fill ${title}...`}
            value={values[title]}
            error={errors[title]}
            onChange={onChange}
            onBlur={onBlur}
            autoFocus={true}
            className={css`
              resize: none !important;
            `}
          />
        </Form>
        {decorator?.updatedAt && (
          <p
            className={css`
              margin-top: 1rem;
            `}
          >
            <Icon name="calendar alternate outline" /> Last updated:{" "}
            {decorator.updatedAt.toDate().toLocaleString()}
          </p>
        )}

        {isDecoratorsLoading && (
          <Dimmer active inverted>
            <Loader inverted>Loading {title} data</Loader>
          </Dimmer>
        )}
      </Segment>

      <Confirm
        dimmer="blurring"
        open={isDeleteConfirmOpen}
        content={`Are you sure you want to delete ${title}?`}
        cancelButton={
          <Button color="red" onClick={() => setDeleteConfirmOpen(false)}>
            No
          </Button>
        }
        confirmButton={
          <Button
            color="green"
            onClick={() => {
              if (decorator?.id) {
                deleteDecorator(decorator.id);
                setDeleteConfirmOpen(false);
                destroyForm();
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

export default Decorator;
