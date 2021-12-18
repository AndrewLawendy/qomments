import { Route, Redirect } from "wouter";

import Header from "~components/Header";
import Generator from "~pages/Generator";
import MySpace from "./MySpace";

const Main = () => {
  return (
    <>
      <Header />
      {/* <Route path="/" component={() => <Redirect to="/generator" />} /> */}
      <Route path="/" component={Generator} />
      <Route path="/my-space" component={MySpace} />
    </>
  );
};

export default Main;
