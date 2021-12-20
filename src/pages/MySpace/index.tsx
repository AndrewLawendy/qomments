import { useState, useEffect } from "react";
import { Container, Header } from "semantic-ui-react";
import { css } from "@emotion/css";

import { useDecoratorsCollection } from "~/resources/useDecoratorsCollection";
import { useBlocksCollection } from "~/resources/useBlocksCollection";

import useAuth from "~hooks/useAuth";

import Decorator from "./Decorator";

const MySpace = () => {
  const [user] = useAuth();
  const [decoratorsRef, isDecoratorsLoading] = useDecoratorsCollection();
  const [decorators, setDecorators] = useState([]);
  const introductionDecorator = decorators.find(
    ({ type }) => type === "Introduction"
  );
  const closingDecorator = decorators.find(({ type }) => type === "Closing");
  const [blocksRef] = useBlocksCollection();

  useEffect(() => {
    const decoratorsValues = [];
    decoratorsRef?.forEach((document) => {
      decoratorsValues.push({ id: document.id, ...document.data() });
    });

    setDecorators(decoratorsValues);
  }, [decoratorsRef]);

  return (
    <Container
      text
      className={css`
        padding-top: 50px;
        padding-bottom: 50px;
      `}
    >
      <Header as="h2">Welcome {user?.displayName}</Header>

      <Decorator
        type="Introduction"
        isLoading={isDecoratorsLoading}
        value={introductionDecorator}
      />
      <Decorator
        type="Closing"
        isLoading={isDecoratorsLoading}
        value={closingDecorator}
      />
    </Container>
  );
};

export default MySpace;
