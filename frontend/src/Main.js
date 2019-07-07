import React from "react";
import { Link } from "react-router-dom";
import { Query, Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Jumbotron, Button, Form, Row, Image, Col } from "react-bootstrap";
import EnterRoom from "./EnterRoom";
import { CenteredLayout } from "./styled";

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

function Main() {
  let input;

  return (
    <Query query={ME_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;

        if (data.users.me) {
          return (
            <Jumbotron>
              <h1>Привет, {data.users.me.username}!</h1>

              <div>
                <Button as={Link} to="/create-room/" variant="dark">
                  Создать новую комнату
                </Button>
                <div>или</div>
                <EnterRoom />
              </div>
            </Jumbotron>
          );
        }

        return (
          <Mutation
            mutation={gql`
              mutation($username: String!) {
                users {
                  create(username: $username) {
                    recordId
                    token
                    record {
                      id
                      username
                    }
                    errors {
                      message
                    }
                  }
                }
              }
            `}
            update={(
              cache,
              {
                data: {
                  users: { create }
                }
              }
            ) => {
              if (create.recordId) {
                localStorage.setItem("token", create.token);
                cache.writeQuery({
                  query: ME_QUERY,
                  data: {
                    users: { me: create.record, __typename: "User" }
                  }
                });
              }
            }}
          >
            {(createUser, { data }) => (
              <CenteredLayout>
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    createUser({ variables: { username: input.value } });
                    input.value = "";
                  }}
                >
                  <Row className="justify-content-md-center">
                    <Col md="auto">
                      <Image
                        roundedCircle
                        src="/img/logo.png"
                        width="200"
                        alt="logo"
                        className="main-logo"
                      />
                    </Col>
                  </Row>
                  <Form.Row>
                    <Col>
                      <Form.Control
                        type="string"
                        placeholder="username"
                        ref={node => {
                          input = node;
                        }}
                      />
                    </Col>
                    <Col>
                      <Button
                        variant="dark"
                        type="submit"
                        disabled={input && !input.value}
                      >
                        Создать аккаунт
                      </Button>
                    </Col>
                  </Form.Row>
                </Form>
              </CenteredLayout>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
}

export default Main;
