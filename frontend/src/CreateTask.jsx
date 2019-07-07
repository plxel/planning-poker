import React from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Button, Form, Col } from "react-bootstrap";

function CreateTask({ roomId }) {
  let input;

  return (
    <Mutation
      mutation={gql`
        mutation($task: CreateTaskInput!) {
          rooms {
            createTask(task: $task) {
              recordId
              record {
                id
                title
                completed
                inProgress
                estimations {
                  estimate
                }
              }
              errors {
                message
              }
            }
          }
        }
      `}
    >
      {(createTask, { data }) => (
        <Form
          onSubmit={async e => {
            e.preventDefault();
            await createTask({
              variables: {
                task: { roomId: roomId, title: input.value }
              }
            });
          }}
        >
          <Form.Row>
            <Col>
              <Form.Control
                type="string"
                placeholder="Название"
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
                Создать
              </Button>
            </Col>
          </Form.Row>
        </Form>
      )}
    </Mutation>
  );
}

export default CreateTask;
