import { css } from "@emotion/css";
import { Header } from "semantic-ui-react";

import NotFound from "/src/assets/images/not-found.jpg";

const TopicNotFound = () => {
  return (
    <div
      className={css`
        text-align: center;
      `}
    >
      <img src={NotFound} alt="Not Found" />
      <Header as="h2">This path is either written by hand or deleted</Header>
      <Header
        size="medium"
        className={css`
          margin-top: 0 !important;
        `}
      >
        Please refer yourself to one of the links on the left
      </Header>
      <a href="https://www.freepik.com/vectors/website">
        Website vector created by stories - www.freepik.com
      </a>
    </div>
  );
};

export default TopicNotFound;
