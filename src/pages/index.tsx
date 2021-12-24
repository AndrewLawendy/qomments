import { Route } from "wouter";
import { css } from "@emotion/css";

import NestedRouter from "~components/NestedRouter";
import Header from "~/components/Header";
import Generator from "~/pages/Generator";
import MySpace from "./MySpace";

const Main = () => {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      `}
    >
      <Header />
      <main
        className={css`
          flex: 1;
          display: flex;
          background-color: #f5f7fb;
        `}
      >
        <Route path="/" component={Generator} />
        <NestedRouter base="/my-space">
          <MySpace />
        </NestedRouter>
      </main>
    </div>
  );
};

export default Main;
