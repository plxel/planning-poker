import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

const ME_QUERY = gql`
  query {
    users {
      me {
        id
        username
      }
    }
  }
`;

const WithMe = ({ children }) => (
  <Query query={ME_QUERY}>
    {({ loading, error, data }) => {
      if (!loading && !error && data.users.me) {
        return children(data.users.me);
      }
      return children();
    }}
  </Query>
);

export default WithMe;
