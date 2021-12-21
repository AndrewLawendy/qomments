import { Route } from "wouter";

import Header from "~/components/Header";
import Generator from "~/pages/Generator";
import MySpace from "./MySpace";

const Main = () => {
  return (
    <>
      <Header />
      <Route path="/" component={Generator} />
      <Route path="/my-space" component={MySpace} />
    </>
  );
};

export default Main;
