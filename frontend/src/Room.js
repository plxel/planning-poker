import React from "react";
import _ from "lodash";
import { Query } from "react-apollo";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { gql } from "apollo-boost";
import Tasks from "./Tasks";
import WithMe from "./Me";
import Estimation from "./Estimation";

class MembersList extends React.Component {
  componentDidMount() {
    this.props.subscribeToMoreUsers();
  }

  render() {
    const { users, currentTask } = this.props;
    return (
      <ListGroup>
        <ListGroup.Item variant="primary">Список участников</ListGroup.Item>
        {users.map(user => (
          <ListGroup.Item key={user.id}>
            {_.find(_.get(currentTask, "estimations", []), {
              user: { id: user.id }
            })
              ? "+"
              : ""}{" "}
            {user.username}
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }
}

const ROOM_USERS_SUBSCRIPTION = gql`
  subscription userEnteredRoom($roomId: String!) {
    userEnteredRoom(roomId: $roomId) {
      user {
        id
        username
      }
    }
  }
`;

const ROOM_TASKS_SUBSCRIPTION = gql`
  subscription roomTasksUpdated($roomId: String!) {
    roomTasksUpdated(roomId: $roomId) {
      tasks {
        id
        title
        inProgress
        completed
        estimations {
          user {
            id
            username
          }
          estimate
        }
      }
    }
  }
`;

export const ROOM_QUERY = gql`
  query($roomId: String!) {
    rooms {
      byId(roomId: $roomId) {
        id
        name
        users {
          id
          username
        }
        creator {
          id
        }
        tasks {
          id
          title
          inProgress
          completed
          estimations {
            estimate
            user {
              id
              username
            }
          }
        }
      }
    }
  }
`;

class Room extends React.Component {
  get roomId() {
    const {
      match: {
        params: { roomId }
      }
    } = this.props;

    return roomId;
  }
  render() {
    return (
      <WithMe>
        {me => (
          <Query query={ROOM_QUERY} variables={{ roomId: this.roomId }}>
            {({ subscribeToMore, loading, error, data }) => {
              if (loading) {
                return <p>Loading...</p>;
              }
              if (error) return <p>Error :(</p>;

              if (!_.get(data, "rooms.byId")) {
                return <Redirect to="/" />;
              }

              const room = _.get(data, "rooms.byId") || {};

              const currentTask = room.tasks.find(t => !t.completed);

              return (
                <Container>
                  <Row>
                    <h1>{room.name}</h1>
                  </Row>
                  <Row>
                    <Col xs={9}>
                      <Estimation room={room} me={me} />
                      <Tasks
                        room={room}
                        tasks={room.tasks}
                        me={me}
                        subscribeToMoreTasks={() => {
                          subscribeToMore({
                            document: ROOM_TASKS_SUBSCRIPTION,
                            variables: { roomId: this.roomId },
                            updateQuery: (prev, { subscriptionData }) => {
                              if (!subscriptionData.data) {
                                return prev;
                              }

                              if (!prev) {
                                return;
                              }

                              const tasks =
                                subscriptionData.data.roomTasksUpdated.tasks;

                              return {
                                rooms: {
                                  byId: {
                                    ...prev.rooms.byId,
                                    tasks,
                                    __typename: "Room"
                                  },
                                  __typename: "RoomsQuery"
                                }
                              };
                            }
                          });
                        }}
                      />
                    </Col>
                    <Col>
                      <MembersList
                        users={_.get(data, "rooms.byId.users") || []}
                        currentTask={currentTask}
                        subscribeToMoreUsers={() =>
                          subscribeToMore({
                            document: ROOM_USERS_SUBSCRIPTION,
                            variables: { roomId: this.roomId },
                            updateQuery: (prev, { subscriptionData }) => {
                              if (!subscriptionData.data) {
                                return prev;
                              }
                              const prevUsers = prev.rooms.byId.users;
                              const newUser =
                                subscriptionData.data.userEnteredRoom.user;

                              if (prevUsers.some(u => u.id === newUser.id)) {
                                return prev;
                              }

                              return {
                                rooms: {
                                  byId: {
                                    ...prev.rooms.byId,
                                    users: [...prevUsers, newUser],
                                    __typename: "Room"
                                  },
                                  __typename: "RoomsQuery"
                                }
                              };
                            }
                          })
                        }
                      />
                    </Col>
                  </Row>
                </Container>
              );
            }}
          </Query>
        )}
      </WithMe>
    );
  }
}

export default Room;
