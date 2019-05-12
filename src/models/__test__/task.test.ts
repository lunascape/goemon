/**
 * @jest-environment node
 */
import { Task, TaskDocument } from '../task';
import mongoose from 'mongoose';
import * as mongodbMemoryServer from 'mongodb-memory-server';

describe('routes/guest test', () => {

  let mongoServer;
  beforeAll(async () => {
    mongoServer = new mongodbMemoryServer.MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    const mongooseOpts = { // options for mongoose 4.11.3 and above
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
    };

    await mongoose.connect(mongoUri, mongooseOpts, err => {
      if (err) {
        console.log('Mongoose connect to MongoMemory failed!');
        console.error(err);
      }
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('CURD Task', async () => {
    let task = new Task();

    // Craete Task
    task.userId = 'userId';
    task.caption = 'Test caption';
    task.isChecked = false;
    expect(await task.save()).not.toBeNull();
    console.log(task._id);

    // Check
    let task2 = await Task.findById({ _id: task._id }).exec();
    expect(task2!.userId).toEqual('userId');
    expect(task2!.caption).toEqual('Test caption');
    expect(task2!.isChecked).toEqual(false);

    // Update Task
    task2!.caption = 'Test caption2';
    await task2!.save();

    // Check
    let task3 = await Task.findById({ _id: task._id }).exec();
    expect(task3!.userId).toEqual('userId');
    expect(task3!.caption).toEqual('Test caption2');
    expect(task3!.isChecked).toEqual(false);

    expect(await Task.count({}).exec()).toBe(1);

    // Remove Task
    task3!.remove();

    // Check
    let task4 = await Task.findById({ _id: task._id }).exec();
    expect(task4).toBeNull();

    expect(await Task.count({}).exec()).toBe(0);
  });
});
