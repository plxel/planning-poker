import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import { Logo, Me } from "./styled";
import WithMe from "./Me";

const Layout = ({ children }) => (
  <div>
    <Navbar bg="dark" className="bg-light justify-content-between">
      <Logo>
        <Link to="/">Logo</Link>
      </Logo>
      <WithMe>
        {({ username }) => (
          <Me>
            {username}
            <img
              src="https://api.adorable.io/avatars/40/abott@adorable.png"
              alt="avatar"
            />
          </Me>
        )}
      </WithMe>
    </Navbar>
    <div>{children}</div>
  </div>
);

export default Layout;
