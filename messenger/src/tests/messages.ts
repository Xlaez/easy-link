import request from 'supertest';
import messageRouter from '../routes/message';
import App from '../app';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Messages', () => {
  describe('[GET] /', () => {
    it('response getMsgs ', async () => {
      const msgRoute = new messageRouter();

      const msgs = msgRoute.msgController.msgService.message;
      msgs.findMany = jest.fn().mockReturnValue([
        {
          id: 1,
          msg: 'A new message',
        },
        {
          id: 2,
          msg: 'A new message 2',
        },
        {
          id: 3,
          msg: 'A new message 3',
        },
      ]);

      const app = new App([msgRoute]);
      return request(app.getServer()).get(`${msgRoute.path}`).expect(200);
    });
  });
});
