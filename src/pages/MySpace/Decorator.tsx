import { useState, useEffect } from "react";
import { css } from "@emotion/css";
import { where } from "firebase/firestore";
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
import { useDecoratorsCollection } from "~/resources/useDecoratorsCollection";

type DecoratorsProps = {
  title: "Introduction" | "Closing";
  type: "introduction" | "closing";
};

const Decorator = ({ title, type }: DecoratorsProps) => {
  const [body, setBody] = useState<string>("");
  const [decoratorsRef, isDecoratorsLoading] = useDecoratorsCollection(
    where("type", "==", type)
  );
  const [decorator, setDecorator] = useState<Decorator | null>();

  const [addDocument, isAddDocumentLoading] =
    useAddDocument<Decorator>("decorators");
  const [updateDocument, isUpdateDocumentLoading] =
    useUpdateDocument<Omit<Decorator, "type">>("decorators");
  const [deleteDocument, isDeleteDocumentLoading] =
    useDeleteDocument("decorators");

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
    setBody(decorator?.body || "");
  }, [decoratorsRef]);

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
                      updateDocument(decorator.id, {
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
                        type,
                      })
                    }
                    disabled={isAddDocumentLoading}
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
                  onClick={() => deleteDocument(decorator.id)}
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
  );
};

export default Decorator;
