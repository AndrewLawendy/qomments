import ReactDOM from "react-dom";
import { Route } from "wouter";
import { ToastContainer, Slide } from "react-toastify";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.min.css";

import AuthProvider from "/src/contexts/AuthContext";
import AuthControlWrapper from "/src/components/AuthControlWrapper";
import Login from "/src/pages/Login";
import Main from "/src/pages";

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
