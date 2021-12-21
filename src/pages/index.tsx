import { Route } from "wouter";
import { css } from "@emotion/css";

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
        `}
      >
        <Route path="/" component={Generator} />
        <Route path="/my-space" component={MySpace} />
      </main>
    </div>
  );
};

export default Main;
