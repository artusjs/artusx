import React, { Profiler, Suspense } from 'react';
import { faker } from '@faker-js/faker';

const TableList = React.lazy(() => import('../components/TableList'));

const List = () => {
  const columns = ['userId', 'username', 'email', 'avatar', 'password', 'birthdate', 'registeredAt'];

  const data = Array.from({ length: 50000 }, () => ({
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate().toLocaleDateString(),
    registeredAt: faker.date.past().toLocaleDateString(),
  }));

  const onRender = (
    id: string,
    phase: string,
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => {
    // console.log("List render", {
    //   id, phase, actualDuration, baseDuration, startTime, commitTime
    // });
  };

  return (
    <Profiler id="list" onRender={onRender}>
      <div>
        <h1>List</h1>
        <Suspense>
          <TableList data={data} columns={columns} />
        </Suspense>
      </div>
    </Profiler>
  );
};

export default List;
