import { UserController } from './user.controller';
import { UserMongoRepo } from '../repositories/user.repo/users.mongo.repo';
import { Repo } from '../repositories/repo.interface';
import { User } from '../entities/user';
import { NextFunction, Request, Response } from 'express';
import { Auth } from '../services/auth';

jest.mock('../services/auth');

const mockRepo = {
  query: jest.fn(),
  queryId: jest.fn(),
  search: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  erase: jest.fn(),
} as unknown as Repo<User>;

const controller = new UserController(mockRepo);

const resp = {
  status: jest.fn(),
  json: jest.fn(),
} as unknown as Response;

const next = jest.fn() as NextFunction;

describe('Given the class UserController', () => {
  describe('When we instatiate it...', () => {
    test('Then it should appear as intantiated', () => {
      expect(controller).toBeInstanceOf(UserController);
    });
  });

  describe('When we call the "login"  method ', () => {
    const req = {
      body: {
        email: 'test',
        password: 'test',
      },
    } as unknown as Request;

    const reqFail = {
      body: {
        email: 'test',
        password: 'test',
      },
    } as unknown as Request;

    describe('When the email or the password are not valid ', () => {
      test('Then expect next to have been called', async () => {
        await controller.login(reqFail, resp, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('When the email and password are valid ', () => {
      test('Then expect the method "search" to be called', async () => {
        await controller.login(req, resp, next);
        expect(mockRepo.search).toHaveBeenCalled();
      });
    });

    // describe('When no data is found ', () => {
    //   test.only('Then expect next to have been called', async () => {
    //     await controller.login(req, resp, next);
    //     const result = ((await mockRepo.search) as jest.Mock).mockReturnValue(
    //       []
    //     );
    //     expect(next).toHaveBeenCalled();
    //   });
    // });

    describe('When the login password does not match with the registered ', () => {
      test.only('Then  it should throw an error', async () => {
        await controller.login(req, resp, next);
        (mockRepo.search as jest.Mock).mockResolvedValue([{}]);
        Auth.compare = jest.fn().mockResolvedValue(true);

        expect(next).toHaveBeenCalled();
      });
    });

    describe('When all the data is valid', () => {
      test('Then resp.json() should have been called', () => {});
    });
  });
});