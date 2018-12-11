import React from "react";
import { withRouter } from "react-router-dom";
import basicAuth from "./basicAuth.js";

const LogoutLink = withRouter(
  ({ history }) => basicAuth.isAuthenticated ? (
    <li role="presentation">
      <a className="nav-item" onClick={() => {
        basicAuth.signout(() => history.push("/login")); }}>
      Sign out
      </a>
    </li>
  ) : (
    <span>"Not logged in"</span>
  )
);

export default LogoutLink;
