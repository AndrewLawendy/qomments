import { ChangeEvent, FocusEvent } from "react";
import readingTime from "reading-time";
import { Form, Icon } from "semantic-ui-react";
import { css } from "@emotion/css";

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
  const readingStats = readingTime(values[label]);

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
        <span>{readingStats.words} word(s)</span>
      </div>
    </>
  );
};

export default BlockContent;
