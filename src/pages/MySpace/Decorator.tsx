import { useState, useEffect } from "react";
import { css } from "@emotion/css";
import {
  Segment,
  Header,
  Form,
  TextArea,
  Popup,
  Button,
  Dimmer,
  Loader,
  Icon,
} from "semantic-ui-react";

import { Decorator } from "~/types";

import {
  useAddDocument,
  useUpdateDocument,
  useDeleteDocument,
} from "~/hooks/useCrud";

type DecoratorsProps = {
  title: "Introduction" | "Closing";
  isLoading: boolean;
  value?: Decorator;
};

const Decorator = ({ title, isLoading, value }: DecoratorsProps) => {
  const [body, setBody] = useState<string>("");
  const [addDocument, isAddDocumentLoading] =
    useAddDocument<Decorator>("decorators");
  const [updateDocument, isUpdateDocumentLoading] =
    useUpdateDocument<Omit<Decorator, "type">>("decorators");
  const [deleteDocument, isDeleteDocumentLoading] =
    useDeleteDocument("decorators");

  useEffect(() => {
    setBody(value?.body || "");
  }, [value?.body]);

  return (
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
          {!isLoading && (
            <Popup
              content={value?.id ? `Update ${title}` : `Add ${title}`}
              trigger={
                value?.id ? (
                  <Button
                    circular
                    color="blue"
                    icon="sync"
                    onClick={() =>
                      updateDocument(value.id, {
                        body,
                      })
                    }
                    disabled={isUpdateDocumentLoading}
                  />
                ) : (
                  <Button
                    circular
                    color="green"
                    icon="plus"
                    onClick={() =>
                      addDocument({
                        body,
                        type: title.toUpperCase() as "introduction" | "closing",
                      })
                    }
                    disabled={isAddDocumentLoading}
                  />
                )
              }
            />
          )}
          {value?.id && (
            <Popup
              content={`Delete ${title}`}
              trigger={
                <Button
                  circular
                  color="red"
                  icon="trash"
                  onClick={() => deleteDocument(value.id)}
                  disabled={isDeleteDocumentLoading}
                />
              }
            />
          )}
        </div>
      </div>
      <Form>
        <TextArea
          value={body}
          className={css`
            resize: none !important;
          `}
          placeholder={`Fill ${title}...`}
          onChange={(e) => setBody(e.target.value)}
        />
      </Form>
      {value?.updatedAt && (
        <p
          className={css`
            margin-top: 1rem;
          `}
        >
          <Icon name="calendar alternate outline" /> Last updated:{" "}
          {value.updatedAt.toDate().toLocaleString()}
        </p>
      )}

      {isLoading && (
        <Dimmer active inverted>
          <Loader inverted>Loading {title} data</Loader>
        </Dimmer>
      )}
    </Segment>
  );
};

export default Decorator;
