import { Auth } from './auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PayloadToken } from './auth.js';

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('Given the Auth class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const payloadMock = {
    id: '1',
    email: 'test',
    role: 'test',
  } as unknown as PayloadToken;

  describe('When the createJWT method is called', () => {
    test('Then, if received a payloadMock, it should have been called', () => {
      Auth.createJWT(payloadMock);
      expect(jwt.sign).toHaveBeenCalled();
    });
  });

  describe('When the verifyJWTGettingPayload method is called', () => {
    test('Then, if jwt.verify return a string, it should throw an error', () => {
      (jwt.verify as jest.Mock).mockReturnValue('string');
      expect(() => Auth.verifyJWTGettingPayload('test')).toThrow();
    });

    test('Then, if jwt.verify return a jwt.JwtPayload, jwt.verify should have been called', () => {
      (jwt.verify as jest.Mock).mockReturnValue(payloadMock);
      Auth.verifyJWTGettingPayload('test');
      expect(jwt.verify).toHaveBeenCalled();
    });
  });

  describe('When the hash method is called', () => {
    test('Then, it should return the mock value of bcrypt.hash have been called', () => {
      Auth.hash('test');
      expect(bcrypt.hash).toHaveBeenCalled();
    });
  });

  describe('When the compare method is called', () => {
    test('Then, it should return the mock value of bcrypt.compare and have been called', () => {
      Auth.compare('test', 'testHash');
      expect(bcrypt.compare).toHaveBeenCalled();
    });
  });
});
