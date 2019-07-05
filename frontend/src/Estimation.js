import React from "react";
import { Button, Card, CardDeck } from "react-bootstrap";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { EstimateWrapper } from "./styled";

const START_ESTIMATE_MUTATION = gql`
  mutation($taskId: String!) {
    rooms {
      startEstimateTask(taskId: $taskId)
    }
  }
`;

const FINISH_ESTIMATE_MUTATION = gql`
  mutation($taskId: String!) {
    rooms {
      finishEstimateTask(taskId: $taskId)
    }
  }
`;

const ESTIMATE_TASK_MUTATION = gql`
  mutation($estimate: EstimateTaskInput!) {
    rooms {
      estimateTask(estimate: $estimate)
    }
  }
`;


const Estimation = ({ room, me }) => {
  const taskToEstimate = room.tasks.find(t => !t.completed);

  if (!taskToEstimate) {
    return (
      <div>
        <h3>Добавьте задачи для оценки</h3>
      </div>
    );
  }

  const isAuthor = me.id === room.creator.id;

  return (
    <EstimateWrapper>
      <div className="heading">
        <h3>Оценка задачи: {taskToEstimate.title}</h3>
        {taskToEstimate.inProgress && (
          <div>Оценили: {taskToEstimate.estimations.length}</div>
        )}
      </div>
      {isAuthor && (
        <div>
          {!taskToEstimate.inProgress && (
            <Mutation mutation={START_ESTIMATE_MUTATION}>
              {start => (
                <Button
                  onClick={() =>
                    start({ variables: { taskId: taskToEstimate.id } })
                  }
                >
                  Начать оценку
                </Button>
              )}
            </Mutation>
          )}
          {taskToEstimate.inProgress && (
            <Mutation mutation={FINISH_ESTIMATE_MUTATION}>
              {finish => (
                <Button
                  onClick={() =>
                    finish({ variables: { taskId: taskToEstimate.id } })
                  }
                >
                  Закончить оценку
                </Button>
              )}
            </Mutation>
          )}
        </div>
      )}
      {!isAuthor && !taskToEstimate.inProgress && (
        <div>Ожидаем начала оценки</div>
      )}
      {taskToEstimate.inProgress && <Cards me={me} task={taskToEstimate} />}
    </EstimateWrapper>
  );
};

const POSSIBLE_ESTIMATES = [0.3, 0.5, 1, 2, 3, 5];

const Cards = ({ me, task }) => {
  const myEstimate = task.estimations.find(e => e.user && e.user.id === me.id);
  return (
    <CardDeck className="cards">
      {POSSIBLE_ESTIMATES.map(e => (
        <Mutation mutation={ESTIMATE_TASK_MUTATION}>
          {estimate => (
            <Card
              bg={
                myEstimate && myEstimate.estimate === e ? "primary" : undefined
              }
              className="text-center p-3"
              onClick={() =>
                !myEstimate &&
                estimate({
                  variables: { estimate: { taskId: task.id, estimate: e } }
                })
              }
            >
              <Card.Title>{e}</Card.Title>
            </Card>
          )}
        </Mutation>
      ))}
    </CardDeck>
  );
};

export default Estimation;
