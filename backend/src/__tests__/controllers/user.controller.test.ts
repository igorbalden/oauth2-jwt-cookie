import supertest from "supertest";
import User, { IUser } from "../../models/user";
import {createApp} from '../../app';
import mongoose from "mongoose";

const app = createApp();

describe('User controller tests.', ()=> {

  beforeAll(async ()=> {
  });

  afterAll(async ()=> {
    await User.deleteMany({});
    mongoose.connection.close();
  });

  const signupInput = {
    "email": "uemail",
    "password": "123456",
  }

  describe('SignUp new user with proper input', ()=> {
    it("Must return 201, and user data", async ()=> {
      const { statusCode, body } = await supertest(app)
        .post("/signup")
        .set('Content-type', 'application/json')
        .send(signupInput);

      expect(statusCode).toBe(201);

      expect(body.email).toBe(signupInput.email);
    });
  });

});