import { User } from '../../entities/user.js';
import { Repo } from '../repo.interface.js';
import { UserModel } from './users.mongo.model.js';
import createDebug from 'debug';
const debug = createDebug('CH5:repo:users');

export class UserMongoRepo implements Repo<User> {
  private static instance: UserMongoRepo;

  public static getInstance(): UserMongoRepo {
    if (!UserMongoRepo.instance) {
      UserMongoRepo.instance = new UserMongoRepo();
    }

    return UserMongoRepo.instance;
  }

  private constructor() {
    debug('instantiate');
  }

  async query(): Promise<User[]> {
    const data = await UserModel.find()
      .populate('products', {
        cart: 0,
      })
      .exec();
    return data;
  }

  async queryId(id: string): Promise<User> {
    return {} as User;
  }

  // Voy a quitar el query id :
  // async queryId(id: string): Promise<User> {
  //   const data = await UserModel.findById(id)
  //     .populate('products', {
  //       cart: 0,
  //     })
  //     .exec();

  //   if (!data) throw new Error();
  //   return data;
  // }

  async search(query: { key: string; value: unknown }): Promise<User[]> {
    const data: User[] = await UserModel.find({ [query.key]: query.value })
      .populate('products', {
        cart: 0,
      })
      .exec();
    return data;
  }

  async create(user: Partial<User>): Promise<User> {
    debug('create');
    const data = await UserModel.create(user);
    return data;
  }

  async update(info: Partial<User>): Promise<User> {
    debug('update');
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data) throw new Error();
    return data as User;
  }

  async erase(id: string): Promise<void> {
    debug('erase');
    const data = UserModel.findByIdAndDelete(id);
    if (!data) throw new Error();
  }
}