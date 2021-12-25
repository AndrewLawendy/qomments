import { css } from "@emotion/css";
import { Header as SemanticHeader, Image } from "semantic-ui-react";

import Logo from "~/assets/logo.png";

import NavLink from "./NavLink";
import User from "./User";

const Header = () => {
  return (
    <header
      className={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 1;
        height: 56px;
        background-color: #fff;
        box-shadow: 0 0 1px 1px rgb(0 0 0 / 14%), 0 0 2px 2px rgb(0 0 0 / 10%),
          0 0 5px 1px rgb(0 0 0 / 8%);
        padding: 0 25px;
      `}
    >
      <SemanticHeader
        as="h1"
        className={css`
          margin: 0 !important;
        `}
      >
        <Image src={Logo} avatar size="mini" />
        qomments
      </SemanticHeader>

      <div
        className={css`
          display: flex;
          align-items: center;
        `}
      >
        <ul
          className={css`
            display: flex;
            margin: 0;
            padding: 0;
            list-style-type: none;
            height: 100%;
          `}
        >
          <NavLink href="/">Generator</NavLink>
          <NavLink href="/my-space">My Space</NavLink>
        </ul>

        <User />
      </div>
    </header>
  );
};

export default Header;
