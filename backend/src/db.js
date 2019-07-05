import nanoid from "nanoid";
const userId = nanoid();
const db = {
  users: [
    {
      id: userId,
      token: "2bEoV0irRB6WHw9kNP82n",
      username: "test"
    }
  ],
  rooms: [
    {
      id: "djji8DlQRbMKwuPWgJhsP",
      name: "test",
      authorId: userId,
      userIds: [userId]
    }
  ],
  tasks: [
    {
      id: "jJ9Et5IQMO2XIJAdxEpw1",
      roomId: "djji8DlQRbMKwuPWgJhsP",
      completed: false,
      title: "task",
      estimations: [{ estimate: 0.5, userId }]
    }
  ]
};

export const User = {
  async create(username) {
    if (db.users.find(u => username === u.username)) {
      return null;
    }

    const user = {
      id: nanoid(),
      username,
      token: nanoid()
    };

    db.users.push(user);

    return user;
  },
  async getByToken(token) {
    return db.users.find(u => u.token === token);
  },
  async find(id) {
    return db.users.find(u => u.id === id);
  }
};

export const Room = {
  async create(name, user) {
    const room = {
      id: nanoid(),
      name,
      authorId: user.id,
      userIds: [user.id]
    };

    db.rooms.push(room);

    return room;
  },
  async getUsers(roomId) {
    const room = db.rooms.find(room => room.id === roomId);

    return db.users.filter(u => room.userIds.includes(u.id));
  },
  async addUser(roomId, user) {
    const room = db.rooms.find(room => room.id === roomId);
    if (!room) {
      return false;
    }

    if (room.userIds.find(id => id === user.id)) {
      return true;
    }

    room.userIds.push(user.id);
    return true;
  },
  async find(id) {
    const room = await db.rooms.find(room => room.id === id);
    return room;
  }
};

export const Task = {
  async create({ roomId, title }) {
    const task = {
      id: nanoid(),
      title,
      roomId,
      estimations: [],
      completed: false,
      inProgress: false
    };

    db.tasks.push(task);

    return task;
  },
  async estimate({ taskId, estimate }, user) {
    const task = db.tasks.find(t => t.id === taskId);
    if (!task) {
      return false;
    }

    console.log("estimate", user.id);

    task.estimations.push({ estimate, userId: user.id });
    return true;
  },
  async find(taskId) {
    return db.tasks.find(task => task.id === taskId);
  },
  async getAllForRoom(roomId) {
    const tasks = db.tasks.filter(t => t.roomId === roomId);
    return tasks.map(t => ({
      ...t,
      estimations: t.estimations.map(te => ({
        ...te,
        test: "abc",
        user: { ...db.users.find(u => u.id === te.userId) }
      }))
    }));
  },
  async startEstimation(taskId) {
    const task = db.tasks.find(t => t.id === taskId);
    if (!task) {
      return false;
    }
    task.inProgress = true;
    task.completed = false;
    return true;
  },
  async finishEstimation(taskId) {
    const task = db.tasks.find(t => t.id === taskId);
    if (!task) {
      return false;
    }
    task.inProgress = false;
    task.completed = true;
    return true;
  }
};

export default db;
