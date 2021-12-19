import ReactDOM from "react-dom";
import { Route } from "wouter";
import "semantic-ui-css/semantic.min.css";

import AuthWrapper from "~/components/AuthWrapper";
import Login from "~/pages/Login";
import Main from "~/pages";

const App = () => {
  return (
    <>
      <Route path="/login" component={Login} />{" "}
      <AuthWrapper>
        <Main />
      </AuthWrapper>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
