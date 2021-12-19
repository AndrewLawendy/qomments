import { signOut } from "firebase/auth";
import { css } from "@emotion/css";
import { Dropdown, Image, Header } from "semantic-ui-react";

import useAuth from "~/hooks/useAuth";
import { auth } from "~/utils/firebase";

const User = () => {
  const [user] = useAuth();

  return (
    <Dropdown
      as={({ children, ...props }) => {
        return (
          <div {...props} title={user?.displayName}>
            <Image src={user?.photoURL} avatar alt="User Photo" />

            {children}
          </div>
        );
      }}
      pointing="top right"
    >
      <Dropdown.Menu>
        <Dropdown.Item>
          <div
            className={css`
              text-align: center;
            `}
          >
            <Image
              src={user?.photoURL}
              avatar
              alt={user?.displayName}
              size="tiny"
            />
            <Header
              size="small"
              className={css`
                margin-top: 1rem !important;
                margin-bottom: 0.3rem !important;
              `}
            >
              {user?.displayName}
            </Header>
            <p>{user?.email}</p>
          </div>
        </Dropdown.Item>
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
