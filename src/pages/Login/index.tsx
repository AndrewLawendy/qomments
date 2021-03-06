import { useEffect } from "react";
import { useLocation } from "wouter";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { css } from "@emotion/css";
import {
  Grid,
  Image,
  Header,
  Container,
  Button,
  Icon,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import LoginImage from "/src/assets/images/login.jpg";
import Logo from "/src/assets/logo.png";

import { useAuthContext } from "/src/contexts/AuthContext";
import useAuth from "/src/hooks/useAuth";
import { auth } from "/src/utils/firebase";

const googleAuthProvider = new GoogleAuthProvider();
const facebookAuthProvider = new FacebookAuthProvider();

const Login = () => {
  const [, setLocation] = useLocation();
  const { authData } = useAuthContext();
  const [, isLoading] = useAuth();

  useEffect(() => {
    if (authData) {
      setLocation("/");
    }
  }, [authData]);

  return (
    <Grid
      className={css`
        min-height: 100vh;
        margin: 0 !important;
      `}
      stackable
    >
      <Grid.Row
        className={css`
          padding: 0 !important;
        `}
      >
        <Grid.Column
          mobile={16}
          tablet={8}
          computer={8}
          className={css`
            display: flex !important;
            flex-direction: column;
            align-items: center;
            padding-bottom: 25px;
          `}
        >
          <Image
            centered
            src={LoginImage}
            className={css`
              width: 100%;
              height: 100%;
              object-fit: cover;
            `}
          />
          <div>
            Icons made by{" "}
            <a href="https://www.freepik.com" title="Freepik">
              Freepik
            </a>{" "}
            from{" "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={8} computer={8}>
          <Container
            text
            className={css`
              height: 100%;
              display: flex !important;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            `}
          >
            <div
              className={css`
                width: 100%;
                max-width: 400px;
              `}
            >
              {isLoading && (
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              )}

              <img src={Logo} />
              <Header
                size="medium"
                className={css`
                  margin-top: 16px !important;
                  margin-bottom: 48px !important;
                `}
              >
                Welcome to qomments!
              </Header>
              <Header size="huge">Sign In</Header>

              <Button
                basic
                fluid
                className={css`
                  margin-bottom: 1rem !important;
                `}
                onClick={() => signInWithRedirect(auth, googleAuthProvider)}
                disabled={isLoading}
              >
                <Icon name="google" /> Sign in with Google
              </Button>
              <Button
                color="facebook"
                fluid
                className={css`
                  margin-bottom: 1rem !important;
                `}
                disabled={isLoading}
                onClick={() => signInWithRedirect(auth, facebookAuthProvider)}
              >
                <Icon name="facebook" /> Sign in with Facebook
              </Button>
            </div>
          </Container>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
export default Login;
