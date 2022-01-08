import { Route } from "wouter";
import { css, injectGlobal } from "@emotion/css";

import NestedRouter from "~components/NestedRouter";
import Header from "~/components/Header";
import Generator from "~/pages/Generator";
import MySpace from "./MySpace";

injectGlobal`
  @keyframes bounce {
    from, 20%, 53%, 80%, to {
      transform: translate3d(0,0,0);
    }

    40%, 43% {
      transform: translate3d(0, -10px, 0);
    }

    70% {
      transform: translate3d(0, -7px, 0);
    }

    90% {
      transform: translate3d(0,-4px,0);
    }
  }
`;

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
