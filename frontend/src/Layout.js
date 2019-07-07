import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Image } from "react-bootstrap";
import { Logo, Me } from "./styled";
import WithMe from "./Me";

const Layout = ({ children }) => (
  <WithMe>
    {user =>
      !user ? (
        children
      ) : (
        <div>
          <Navbar bg="dark" className="bg-light justify-content-between">
            <Logo>
              <Link to="/">
                <Image src="/img/logo_icon.png" width="50" />
              </Link>
            </Logo>

            <Me>
              {user.username}
              <img
                src="https://api.adorable.io/avatars/40/abott@adorable.png"
                alt="avatar"
              />
            </Me>
          </Navbar>
          <div>{children}</div>
        </div>
      )
    }
  </WithMe>
);

export default Layout;
