import amqp from 'amqplib/callback_api';

const connAmqp = async () => {
  amqp.connect('amqp://guest:password@localhost:5672', async function (error, connection) {
    if (error) {
      throw error;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var queue = 'get-connections';

      channel.assertQueue(queue, {
        durable: false,
      });

      channel.consume(
        'get-connections',
        function (msg) {
          console.log(' [x] Received %s', msg.content.toString());
        },
        {
          noAck: true,
        },
      );
    });
  });
};

export default connAmqp;
