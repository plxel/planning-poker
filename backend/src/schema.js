import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    users: UsersQuery
    rooms: RoomsQuery
  }

  type Mutation {
    users: UsersMutation
    rooms: RoomsMutation
  }

  type Subscription {
    userEnteredRoom(roomId: String!): UserEnteredRoomPayload
    roomTasksUpdated(roomId: String!): RoomTasksUpdatedPayload
  }

  type RoomTasksUpdatedPayload {
    tasks: [Task!]!
  }

  type UsersQuery {
    me: User
  }

  type RoomsQuery {
    byId(roomId: String!): Room
  }

  type RoomsMutation {
    create(room: CreateRoomInput!): CreateRoomPayload!
    join(roomId: String!): Boolean!
    createTask(task: CreateTaskInput): CreateTaskPayload!
    estimateTask(estimate: EstimateTaskInput!): Boolean!
    startEstimateTask(taskId: String!): Boolean!
    finishEstimateTask(taskId: String!): Boolean!
  }

  type UsersMutation {
    create(username: String!): CreateUserPayload!
  }

  type Error {
    message: String!
  }

  type User {
    id: ID!
    username: String!
  }

  type CreateUserPayload {
    recordId: ID
    token: String
    record: User
    errors: [Error!]!
  }

  type CreateRoomPayload {
    recordId: ID
    record: Room
    errors: [Error!]!
    query: Query
  }

  type CreateTaskPayload {
    recordId: ID
    record: Task
    errors: [Error!]!
    query: Query
  }

  type Room {
    id: ID!
    name: String!
    users: [User!]!
    tasks: [Task!]!
    creator: User!
  }

  input CreateRoomInput {
    name: String!
  }

  type UserEnteredRoomPayload {
    user: User!
    room: Room!
  }

  type Task {
    id: ID!
    title: String!
    room: Room!
    estimations: [Estimation!]!
    completed: Boolean!
    inProgress: Boolean!
  }

  type Estimation {
    estimate: Float!
    user: User!
    test: String!
  }

  input CreateTaskInput {
    roomId: String!
    title: String!
  }

  input EstimateTaskInput {
    taskId: String!
    estimate: Float!
  }
`;

export default typeDefs;
