import ReactDOM from "react-dom";
import { Route } from "wouter";
import { ToastContainer, Slide } from "react-toastify";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.min.css";

import AuthProvider from "~contexts/AuthContext";
import AuthControlWrapper from "~/components/AuthControlWrapper";
import Login from "~/pages/Login";
import Main from "~/pages";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Route path="/login" component={Login} />{" "}
        <AuthControlWrapper>
          <Main />
        </AuthControlWrapper>
      </AuthProvider>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        transition={Slide}
        theme="colored"
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
