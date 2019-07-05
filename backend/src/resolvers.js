import { PubSub, withFilter } from "apollo-server";
import { User, Room, Task } from "./db";
const pubsub = new PubSub();

const USER_ENTERED_ROOM = "USER_ENTERED_ROOM";
const ROOM_TASKS_UPDATED = "ROOM_TASKS_UPDATED";

export default {
  Subscription: {
    userEnteredRoom: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([USER_ENTERED_ROOM]),
        (payload, variables) => {
          return payload.userEnteredRoom.room.id === variables.roomId;
        }
      )
    },
    roomTasksUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([ROOM_TASKS_UPDATED]),
        (payload, variables) => {
          return payload.roomTasksUpdated.room.id === variables.roomId;
        }
      )
    }
  },
  Query: {
    users: () => ({}),
    rooms: () => ({})
  },
  Mutation: {
    users: () => ({}),
    rooms: () => ({})
  },
  UsersQuery: {
    async me(parent, args, ctx) {
      if (ctx.user) {
        return ctx.user;
      }
      return null;
    }
  },
  UsersMutation: {
    async create(parent, args, context, info) {
      const { username } = args;
      const user = await User.create(username);

      if (!user) {
        return {
          errors: [{ message: "User with that username already exists!" }]
        };
      }

      return { recordId: user.id, record: user, token: user.token, errors: [] };
    }
  },
  RoomsQuery: {
    async byId(parent, args, ctx) {
      if (!ctx.user) {
        return null;
      }
      const room = await Room.find(args.roomId);
      if (room) {
        await Room.addUser(room.id, ctx.user);
        pubsub.publish(USER_ENTERED_ROOM, {
          userEnteredRoom: { user: ctx.user, room }
        });
      }
      return room;
    },
  },
  RoomsMutation: {
    async create(parent, args, ctx, info) {
      if (!ctx.user) {
        return { errors: [{ message: "Sign in required" }] };
      }

      const room = await Room.create(args.room.name, ctx.user);

      return { recordId: room.id, record: room, errors: [] };
    },
    async join(parent, args, ctx) {
      if (!ctx.user) {
        return false;
      }

      pubsub.publish(USER_ENTERED_ROOM, {
        userEnteredRoom: { user: ctx.user, room: await Room.find(args.roomId) }
      });

      return Room.addUser(args.roomId, ctx.user);
    },
    async createTask(parent, args, ctx) {
      if (!ctx.user) {
        return {
          errors: [{ message: "Sign in required" }]
        };
      }

      const task = await Task.create(args.task);

      const room = await Room.find(args.task.roomId);
      pubsub.publish(ROOM_TASKS_UPDATED, {
        roomTasksUpdated: { tasks: await Task.getAllForRoom(room.id), room }
      });

      return { recordId: task.id, record: task, errors: [] };
    },
    async estimateTask(parent, args, ctx) {
      if (!ctx.user) {
        return false;
      }

      const res = await Task.estimate(args.estimate, ctx.user);

      const task = await Task.find(args.estimate.taskId);
      const room = await Room.find(task.roomId);

      pubsub.publish(ROOM_TASKS_UPDATED, {
        roomTasksUpdated: { tasks: await Task.getAllForRoom(room.id), room }
      });

      return res;
    },
    async startEstimateTask(parent, args, ctx) {
      if (!ctx.user) {
        return false;
      }

      const res = await Task.startEstimation(args.taskId);

      const task = await Task.find(args.taskId);
      const room = await Room.find(task.roomId);

      pubsub.publish(ROOM_TASKS_UPDATED, {
        roomTasksUpdated: { tasks: await Task.getAllForRoom(room.id), room }
      });

      return res;
    },
    async finishEstimateTask(parent, args, ctx) {
      if (!ctx.user) {
        return false;
      }

      const res = await Task.finishEstimation(args.taskId);

      const task = await Task.find(args.taskId);
      const room = await Room.find(task.roomId);

      pubsub.publish(ROOM_TASKS_UPDATED, {
        roomTasksUpdated: { tasks: await Task.getAllForRoom(room.id), room }
      });

      return res;
    }
  },
  Room: {
    async creator(parent) {
      const room = await Room.find(parent.id);
      return User.find(room.authorId);
    },
    users(parent) {
      return Room.getUsers(parent.id);
    },
    tasks(parent) {
      return Task.getAllForRoom(parent.id);
    }
  },
  Task: {
    async room(parent) {
      const task = await Task.find(parent.id);
      return Room.find(task.roomId);
    }
  },
  Estimation: {
    async user(parent) {
      console.log("HERTR SLLLL");
      return User.find(parent.userId);
    }
  }
};
