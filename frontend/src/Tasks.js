import React, { useEffect } from "react";
import { Query, Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Tabs, Tab, Table } from "react-bootstrap";
import CreateTask from "./CreateTask";

const TaskList = ({ tasks, onlyTitle }) => (
  <Table
    striped
    bordered
    hover
    size="sm"
    variant="dark"
    style={{ marginTop: 20 }}
  >
    <thead>
      <tr>
        <th>Название</th>
        {!onlyTitle && [<th>Среднее</th>, <th>Мин.</th>, <th>Макс.</th>]}
      </tr>
    </thead>
    <tbody>
      {tasks.map(t => {
        const ests = t.estimations.map(e => e.estimate);
        return (
          <tr>
            <td>{t.title}</td>
            {!onlyTitle && [
              <td>
                {Math.round(
                  (ests.reduce((acc, e) => acc + e, 0) / ests.length) * 100
                ) / 100}
              </td>,
              <td>{Math.min(...ests)}</td>,
              <td>{Math.max(...ests)}</td>
            ]}
          </tr>
        );
      })}
    </tbody>
  </Table>
);

const Tasks = ({ room, me, tasks, subscribeToMoreTasks }) => {
  const active = tasks.filter(task => !task.completed);
  const completed = tasks.filter(task => task.completed);
  const all = tasks;

  useEffect(() => {
    subscribeToMoreTasks();
  }, []);

  return (
    <Tabs defaultActiveKey="active" id="uncontrolled-tab-example">
      <Tab eventKey="active" title="Активные">
        <TaskList tasks={active} onlyTitle />
        {room.creator.id === me.id && (
          <div>
            <CreateTask roomId={room.id} />
          </div>
        )}
      </Tab>
      <Tab eventKey="completed" title="Завершенные">
        <TaskList tasks={completed} />
      </Tab>
      <Tab eventKey="all" title="Все">
        <TaskList tasks={all} />
      </Tab>
    </Tabs>
  );
};

export default Tasks;
