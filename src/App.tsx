import ReactDOM from "react-dom";
import { Route } from "wouter";
import "semantic-ui-css/semantic.min.css";

import AuthProvider from "~contexts/AuthContext";
import AuthControlWrapper from "~/components/AuthControlWrapper";
import Login from "~/pages/Login";
import Main from "~/pages";

const App = () => {
  return (
    <AuthProvider>
      <Route path="/login" component={Login} />{" "}
      <AuthControlWrapper>
        <Main />
      </AuthControlWrapper>
    </AuthProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
