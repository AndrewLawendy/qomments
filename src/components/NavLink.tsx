import { FC } from "react";
import { useRoute } from "wouter";
import { css } from "@emotion/css";
import { Link } from "wouter";
import { Header } from "semantic-ui-react";

type Props = {
  href: string;
};

const NavLink: FC<Props> = ({ href, children }) => {
  const [active] = useRoute(`${href}/:param?`);

  return (
    <li
      className={css`
        margin-right: 20px;
        position: relative;
        overflow: hidden;

        &::after {
          content: "";
          width: 100%;
          height: 4px;
          background-color: #fab139;
          position: absolute;
          bottom: ${active ? 0 : "-4px"};
          left: 0;
          transition: bottom 0.2s;
        }

        &:hover::after {
          bottom: 0;
        }

        a {
          color: inherit;
          display: block;
          padding: 20px 0 !important;
        }
      `}
    >
      <Link href={href}>
        <Header size="small">{children}</Header>
      </Link>
    </li>
  );
};

export default NavLink;
