import { Route } from "wouter";
import { Loader } from "semantic-ui-react";
import { css } from "@emotion/css";

import useAuth from "~/hooks/useAuth";

import Header from "~/components/Header";
import Generator from "~/pages/Generator";
import MySpace from "./MySpace";

const Main = () => {
  const [, isLoading] = useAuth();
  return (
    <>
      <Header />
      {isLoading ? (
        <div
          className={css`
            padding: 50px;
          `}
        >
          <Loader active inline="centered" size="large">
            Loading user info...
          </Loader>
        </div>
      ) : (
        <>
          <Route path="/" component={Generator} />
          <Route path="/my-space" component={MySpace} />
        </>
      )}
    </>
  );
};

export default Main;
