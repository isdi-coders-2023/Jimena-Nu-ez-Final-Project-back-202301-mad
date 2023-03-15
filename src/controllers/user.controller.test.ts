import { UserController } from './user.controller';
import { Repo } from '../repositories/repo.interface';
import { User } from '../entities/user';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/error';

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
    describe('When the email or the password are not valid ', () => {
      test('Then expect next to have been called', async () => {
        const reqFail = {
          body: {},
        } as unknown as Request;

        await controller.login(reqFail, resp, next);
        expect(next).toHaveBeenLastCalledWith(
          new HTTPError(401, 'Unauthorized', 'Invalid Email or password')
        );
      });
    });

    describe('When the email and password are valid ', () => {
      test('Then expect the method "search" to be called', async () => {
        const req = {
          body: {
            email: 'test',
            password: 'test',
          },
        } as unknown as Request;
        await controller.login(req, resp, next);
        expect(mockRepo.search).toHaveBeenCalled();
      });
    });

    describe('When no data is found ', () => {
      test('Then expect next to have been called', async () => {
        (mockRepo.search as jest.Mock).mockResolvedValue([]);
        const controller = new UserController(mockRepo);
        const req = {
          body: {
            email: 'test',
            password: 'test',
          },
        } as unknown as Request;
        await controller.login(req, resp, next);
        expect(next).toHaveBeenLastCalledWith(
          new HTTPError(
            401,
            'Incorrect email or password',
            'Email or password not found'
          )
        );
      });
    });

    // FIX THIS CODE
    //   describe('When the login password does not match with the repgistered ', () => {
    //     test('Then  it should throw an error', async () => {
    //       const req = {
    //         body: {
    //           email: 'test',
    //           password: 'test',
    //         },
    //       } as unknown as Request;
    //       (mockRepo.search as jest.Mock).mockResolvedValue([{}]);
    //       Auth.compare = jest.fn().mockResolvedValue(true);
    //       await controller.login(req, resp, next);
    //       expect(next).toHaveBeenCalled();
    //     });
    //   });

    // FIX THIS CODE
    describe('When all body password does not match the data password', () => {
      test('Then resp.json() should have been called', async () => {
        (mockRepo.search as jest.Mock).mockResolvedValue([{ password: '' }]);
        const controller = new UserController(mockRepo);
        const req = {
          body: {
            email: 'test',
            password: 'test',
          },
        } as unknown as Request;

        await controller.login(req, resp, next);
        expect(next).toHaveBeenLastCalledWith(
          new HTTPError(
            401,
            'Incorrect email or password',
            'Email or password not found'
          )
        );
      });
    });

    describe('When all the data is valid', () => {
      test('Then resp.json() should have been called', async () => {
        (mockRepo.search as jest.Mock).mockResolvedValue([
          { password: 'test' },
        ]);
        const controller = new UserController(mockRepo);
        const req = {
          body: {
            email: 'test',
            password: 'test',
          },
        } as unknown as Request;

        await controller.login(req, resp, next);
        expect(resp.json).toHaveBeenCalled();
      });
    });
  });
});
