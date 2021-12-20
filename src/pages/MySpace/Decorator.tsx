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
  type: "Introduction" | "Closing";
  isLoading: boolean;
  value?: Decorator;
};

const Decorator = ({
  type,
  isLoading,
  value,
}: DecoratorsProps): JSX.Element => {
  const [body, setBody] = useState<string>("");
  const addDocument = useAddDocument("decorators");
  const updateDocument = useUpdateDocument("decorators");
  const deleteDocument = useDeleteDocument("decorators");

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
          {type}
        </Header>
        <div>
          {!isLoading && (
            <Popup
              content={value?.id ? `Update ${type}` : `Add ${type}`}
              trigger={
                value?.id ? (
                  <Button
                    icon="sync"
                    onClick={() =>
                      updateDocument(value?.id || "", {
                        body,
                      })
                    }
                  />
                ) : (
                  <Button
                    icon="plus"
                    onClick={() => addDocument({ body, type })}
                  />
                )
              }
            />
          )}
          {value?.id && (
            <Popup
              content={`Delete ${type}`}
              trigger={
                <Button icon="trash" onClick={() => deleteDocument(value.id)} />
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
          placeholder={`Fill ${type}...`}
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
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )}
    </Segment>
  );
};

export default Decorator;
