import { useState, useEffect } from "react";
import { useDecoratorsCollection } from "~/resources/useDecoratorsCollection";
import { useBlocksCollection } from "~/resources/useBlocksCollection";

const MySpace = () => {
  const [decoratorsRef] = useDecoratorsCollection();
  const [decorators, setDecorators] = useState([]);
  const [closingDecorator, introcutionDecorator] = decorators;
  const [blocksRef] = useBlocksCollection();

  useEffect(() => {
    const decoratorsValues = [];
    decoratorsRef?.forEach((document) => {
      decoratorsValues.push(document.data());
    });
    const decoratorsSorted = decoratorsValues.sort(
      ({ type: typeA }, { type: typeB }) => typeA.localeCompare(typeB)
    );

    setDecorators(decoratorsSorted);
  }, [decoratorsRef]);

  return <>My Space</>;
};

export default MySpace;
