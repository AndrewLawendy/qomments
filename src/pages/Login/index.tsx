import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
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
import LoginImage from "~/assets/images/login.jpg";

import useAuth from "~/hooks/useAuth";
import { auth } from "~/utils/firebase";

const googleAuthProvider = new GoogleAuthProvider();

const Login = () => {
  const [, isLoading] = useAuth();
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
        <Grid.Column mobile={16} tablet={8} computer={8}>
          <Image
            centered
            src={LoginImage}
            className={css`
              width: 100%;
              height: 100%;
              object-fit: cover;
            `}
          />
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
              <Header size="medium">Welcome to qomments!</Header>
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
              >
                <Icon name="facebook" /> Sign in with Facebook
              </Button>

              <Button color="red" fluid disabled={isLoading}>
                <Icon name="mail" /> Sing with email
              </Button>
            </div>
          </Container>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
export default Login;
