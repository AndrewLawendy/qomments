import { signOut } from "firebase/auth";
import { css } from "@emotion/css";
import { Dropdown, Image, Header } from "semantic-ui-react";

import { useAuthContext } from "~contexts/AuthContext";
import { auth } from "~/utils/firebase";

const User = () => {
  const { authData } = useAuthContext();

  if (authData === null) return null;

  return (
    <Dropdown
      floating
      trigger={
        <Image
          src={authData.photoURL}
          title={authData.displayName}
          alt="User Photo"
          avatar
        />
      }
      direction="left"
    >
      <Dropdown.Menu>
        <Dropdown.Header>
          <div
            className={css`
              text-align: center;
            `}
          >
            <Image
              src={authData.photoURL}
              alt={authData.displayName}
              avatar
              size="tiny"
            />
            <Header
              size="small"
              className={css`
                margin-top: 1rem !important;
                margin-bottom: 0.3rem !important;
              `}
            >
              {authData.displayName}
            </Header>
            <Header
              size="tiny"
              className={css`
                margin-top: 0 !important;
              `}
            >
              {authData.email}
            </Header>
          </div>
        </Dropdown.Header>
        <Dropdown.Divider />
        <Dropdown.Item
          className={css`
            text-align: center !important;
          `}
          onClick={() => signOut(auth)}
        >
          Sign Out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default User;
