import { logger } from '@/utils/logger';
import amqp from 'amqplib';

class BrokerFactory {
  amq: any;
  channel: any;
  constructor() {
    this.amq = amqp;
    this.channel = this.configuration();
  }
  public configuration = async () => {
    setTimeout(() => {}, 15000);
    let conn: any;
    let retries = 5;

    while (retries > 0) {
      try {
        conn = await this.amq.connect('amqp://guest:password@localhost:5672');
        logger.info('amqp client connected');
        break;
      } catch (e) {
        retries -= 1;
        logger.debug('retries:', e);
        await new Promise(res => setTimeout(res, 5000));
      }
    }
    const channel = await conn.createChannel();
    return channel;
  };

  public getChannel = async () => {
    return this.channel;
  };
}

export default BrokerFactory;
