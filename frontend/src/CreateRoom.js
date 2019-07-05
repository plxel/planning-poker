import React from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import { Button, Form, Col } from "react-bootstrap";
import { CenteredLayout } from "./styled";

function CreateRoom(props) {
  let input;

  return (
    <Mutation
      mutation={gql`
        mutation($room: CreateRoomInput!) {
          rooms {
            create(room: $room) {
              recordId
              record {
                id
              }
              errors {
                message
              }
            }
          }
        }
      `}
    >
      {(createRoom, { data }) => (
        <CenteredLayout>
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const response = await createRoom({
                variables: { room: { name: input.value } }
              });

              const roomId = _.get(response, "data.rooms.create.recordId");

              if (roomId) {
                props.history.push(`/rooms/${roomId}`);
                return;
              }
              input.value = "";
            }}
          >
            <Form.Row>
              <Col>
                <Form.Control
                  type="string"
                  placeholder="Название комнаты"
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
                  Создать команту
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </CenteredLayout>
      )}
    </Mutation>
  );
}

export default withRouter(CreateRoom);
