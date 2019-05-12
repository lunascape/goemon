import { UserInputError, ApolloError } from 'apollo-server-express';
import { Task } from 'models/task';
import { ITask } from '../types/todo';

export default {
  Query: {
    listTasks: listTasks
  },

  Mutation: {
    addTask: addTask,
    updateTask: updateTask,
    removeTask: removeTask
  }
};

async function listTasks() {
  let tasks = await Task.find({}).exec();
  return tasks;
}

async function addTask(obj: any, args: ITask, context: any, info: any) {
  if (!args.caption) {
    throw new UserInputError('Caption is required.');
  }

  let task = new Task({
    caption: args.caption,
    isChecked: false
  });
  await task.save();

  return {
    id: task._id,
    caption: task.caption,
    isChecked: task.isChecked
  };
}

async function updateTask(obj: any, args: ITask, context: any, info: any) {
  if (!obj.id) {
    throw new UserInputError('Task ID is required.');
  } else if (!obj.caption) {
    throw new UserInputError('Caption is required.');
  }

  let task = await Task.findOne({ _id: args.id }).exec();
  if (task != null) {
    task.caption = obj.caption;
    task.isChecked = obj.icChecked;
  }
}

async function removeTask(obj: any, args: ITask, context: any, info: any) {
  if (!args.id) {
    throw new UserInputError('Caption is required.');
  }
}
