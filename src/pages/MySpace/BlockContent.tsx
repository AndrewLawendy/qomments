import { useState, useEffect, ChangeEvent, FocusEvent } from "react";
import writeGood, { Problem } from "write-good";
import readingTime from "reading-time";
import { Form, Icon, Message, List } from "semantic-ui-react";
import { css } from "@emotion/css";

import useDebounce from "~hooks/useDebounce";

import { Values, Errors } from "~hooks/useRequiredForm";

type BlockContentProps = {
  values: Values;
  errors: Errors;
  onChange: ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: ({ target: { name } }: FocusEvent<HTMLInputElement>) => void;
  label: string;
};

const BlockContent = ({
  values,
  errors,
  onChange,
  onBlur,
  label,
}: BlockContentProps) => {
  const readingStats = readingTime(values[label].trim());
  const debouncedValue = useDebounce(values[label]);
  const [suggestions, setSuggestions] = useState<Problem[]>([]);

  useEffect(() => {
    const writeGoodSuggestions = writeGood(debouncedValue);

    setSuggestions(writeGoodSuggestions);
  }, [debouncedValue]);

  return (
    <>
      <Form.TextArea
        className={css`
          textarea {
            resize: none !important;
          }
        `}
        label={label}
        name={label}
        value={values[label]}
        error={errors[label]}
        onChange={onChange}
        onBlur={onBlur}
      />

      <div
        className={css`
          color: #757575;
        `}
      >
        <Icon name="clock outline" />
        <span>{readingStats.text}</span> <Icon name="file word outline" />
        <span>{readingStats.words} word(s)</span> <Icon name="i cursor" />
        <span>{values[label].trim().length} characters</span>
      </div>

      {suggestions.length > 0 && (
        <Message
          warning
          icon
          className={css`
            display: flex !important;
          `}
        >
          <Icon name="lightbulb outline" />

          <Message.Content>
            <Message.Header>Suggestions</Message.Header>

            <List>
              {suggestions.map(({ reason, index, offset }) => (
                <List.Item
                  key={`${index}-${offset}`}
                  icon="caret right"
                  content={`${reason} at column ${index} through ${offset} character(s)`}
                />
              ))}
            </List>
          </Message.Content>
        </Message>
      )}
    </>
  );
};

export default BlockContent;
