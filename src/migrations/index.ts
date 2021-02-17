import {
  Connection,
  createConnections,
  DeepPartial,
  EntityTarget,
  getConnection,
} from 'typeorm';
import { IInitializeTestData } from '../interfaces';
import { testDataForMariaDB, testDataForMongoDB } from './testDatas';

const createAndReturnModels = async <T>(
  model: EntityTarget<T>,
  data: DeepPartial<T>[],
  connection: Connection,
  typeRepository?: string
): Promise<T[]> => {
  const repository = typeRepository === 'mongo'
    ? connection.getMongoRepository(model)
    : connection.getRepository(model);
  const initializedModels: T[] = data.map((dataModel) =>
    repository.create(dataModel));

  await repository.save(initializedModels);

  return initializedModels;
};

const initializeTestData = async (
  mariaConnection: Connection,
  mongoConnection: Connection
): Promise<IInitializeTestData> => {
  const initializedData = {};

  const mariaDBItems = await Promise.all(
    testDataForMariaDB.map((item) =>
      createAndReturnModels(item.model, item.data, mariaConnection))
  );
  testDataForMariaDB.forEach((item, index) => {
    initializedData[item.name] = mariaDBItems[index];
  });

  const mongoDBItems = await Promise.all(
    testDataForMongoDB.map((item) =>
      createAndReturnModels(item.model, item.data, mongoConnection, 'mongo'))
  );
  testDataForMongoDB.forEach((item, index) => {
    initializedData[item.name] = mongoDBItems[index];
  });

  return initializedData;
};

const up = async () => {
  const connections: Connection[] = await createConnections();

  await initializeTestData(getConnection('maria'), getConnection('mongo'));
  await Promise.all(connections.map((connection) => connection.close()));
};

const down = async () => {
  const connections: Connection[] = await createConnections();

  await Promise.all(
    connections.map((connection) => connection.synchronize(true))
  );

  await Promise.all(
    connections.map((connection) => connection.close())
  );
};

export const start = async () => {
  await down();
  await up();
};

(async () => {
  await start();
})();
