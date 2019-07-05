import React from "react";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Button, Form, Col } from "react-bootstrap";
import _ from "lodash";

function EnterRoom(props) {
  let input;

  return (
    <Mutation
      mutation={gql`
        mutation($roomId: String!) {
          rooms {
            join(roomId: $roomId)
          }
        }
      `}
    >
      {(joinRoom, { data }) => (
        <Form
          onSubmit={async e => {
            e.preventDefault();
            const response = await joinRoom({
              variables: { roomId: input.value }
            });

            if (_.get(response, "data.rooms.join")) {
              props.history.push(`/rooms/${input.value}`);
              return;
            }
            input.value = "";
          }}
        >
          <Form.Row>
            <Col>
              <Form.Control
                type="string"
                placeholder="ID комнаты"
                ref={node => {
                  input = node;
                }}
              />
            </Col>
            <Col>
              <Button
                variant="primary"
                type="submit"
                disabled={input && !input.value}
              >
                Войти в комнату
              </Button>
            </Col>
          </Form.Row>
        </Form>
      )}
    </Mutation>
  );
}

export default withRouter(EnterRoom);
