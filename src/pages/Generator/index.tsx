import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Container,
  Segment,
  Header,
  Form,
  Label,
  Dimmer,
  Loader,
  Placeholder,
} from "semantic-ui-react";
import { css } from "@emotion/css";

import useRequiredForm from "~hooks/useRequiredForm";
import { useTopicsCollection } from "~/resources/useTopicsCollection";
import { useDecoratorsCollection } from "~/resources/useDecoratorsCollection";

import { Topic, Decorator } from "~/types";

const genderOptions = [
  {
    text: "Male",
    value: "maleContent",
  },
  {
    text: "Female",
    value: "femaleContent",
  },
];

const Generator = () => {
  const { values, errors, onChange, onBlur, setFieldValue, setFieldTouched } =
    useRequiredForm({
      Name: "",
      Gender: "",
    });
  const [decoratorsRef, isDecoratorsLoading] = useDecoratorsCollection();
  const [decorators, setDecorators] = useState<Decorator[]>([]);

  const [topicsRef, isTopicsLoading] = useTopicsCollection();
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const decorators: Decorator[] = [];
    decoratorsRef?.forEach((document) =>
      decorators.push({
        id: document.id,
        ...document.data(),
      } as Decorator)
    );

    setDecorators(decorators);
  }, [decoratorsRef]);

  useEffect(() => {
    const topicsValues: Topic[] = [];
    const topicsPaths: string[] = [];
    topicsRef?.forEach((topic) => {
      topicsValues.push({
        id: topic.id,
        ...topic.data(),
      } as Topic);
      topicsPaths.push(topic.id);
    });

    setTopics(topicsValues);
  }, [topicsRef]);

  return (
    <Container
      className={css`
        padding: 24px;
      `}
    >
      <Segment>
        <Header as="h2">Generate qomment</Header>
        <Header as="h3">Choose name and gender to proceed</Header>
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              label="Name"
              name="Name"
              value={values.Name}
              error={errors.Name}
              onChange={onChange}
              onBlur={onBlur}
            />
            <Form.Select
              options={genderOptions}
              label="Gender"
              name="Gender"
              value={values.Gender}
              error={errors.Gender}
              onChange={(_, { value }) =>
                setFieldValue("Gender", value as string)
              }
              onBlur={() => setFieldTouched("Gender")}
            />
          </Form.Group>
        </Form>
      </Segment>

      <Segment>
        <Header as="h3">Topics</Header>
        <Segment>
          {(isDecoratorsLoading || isTopicsLoading) && (
            <>
              <Dimmer active inverted>
                <Loader inverted>Loading topics</Loader>
              </Dimmer>

              <Placeholder fluid>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder>
            </>
          )}

          {!isDecoratorsLoading &&
            !isTopicsLoading &&
            (decorators.length === 0 && topics.length === 0 ? (
              <div
                className={css`
                  text-align: center;
                `}
              >
                <Header as="h3">No topics available</Header>
                <p>
                  Go to <Link to="my-space">My Space</Link> to start adding
                  topics
                </p>
              </div>
            ) : (
              <>
                {decorators.map((decorator) => (
                  <Label key={decorator.id}>{decorator.type}</Label>
                ))}
                {topics.map((topic) => (
                  <Label key={topic.id}>{topic.name}</Label>
                ))}
              </>
            ))}
        </Segment>
      </Segment>
    </Container>
  );
};

export default Generator;
