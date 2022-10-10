import { logger } from '@/utils/logger';

class GettingBroker {
  public channel;
  public msgCreated = false;
  public loadChannel(channel: any) {
    this.channel = channel;
  }

  public createQueue = async (queue: any) => {
    if (!this.msgCreated) {
      // this.channel.assertQueue(queue);
      this.channel.assertQueue('get-connections');
      logger.info('creating queue:', queue);
      this.msgCreated = true;
    }
  };

  public getMessages = async (queue: any) => {
    await this.channel.consume(
      // queue,
      'get-connections',
      (msg: any) => {
        msg.map(ms => {
          logger.info(ms.content.toString());
        });
      },
      {
        noAck: true,
      },
    );
  };
}

export default new GettingBroker();
