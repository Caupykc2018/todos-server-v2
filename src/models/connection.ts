import { createConnections } from 'typeorm';

export const connection = async () => {
  await createConnections();
};
