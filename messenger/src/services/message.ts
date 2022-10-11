import message from '@/schema/message';
import privateConv from '@/schema/privateConv';

class MsgService {
  constructor() {}

  public createMsg = async (body: any): Promise<boolean> => {
    let msg = new message({
      ...body,
      readByRecipients: { readByUserId: body.sender },
    });
    // if the conv field is not passed to the body then a new conversation is established between both users
    // else it means that they have had previous conversations so the message is just saved
    if (!body.conv) {
      let conv: any;
      conv = await privateConv.create({
        members: body.users,
      });
      msg.conv = conv._id;
    }

    msg = await msg.save();
    return true;
  };

  public getmsgs = async (from: string, conv: string, pageId: number = 1, pageSize: number = 15): Promise<any> => {
    const messages = await message
      .find({
        conv: conv,
      })
      .skip((pageId - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: 1 })
      .lean();

    const total = await message
      .find({
        conv: conv,
      })
      .countDocuments();
    const con = await privateConv.findById(conv).lean();
    const msgs = messages.map(msg => {
      return {
        from: msg.sender === from,
        body: msg.msg,
        // user1: msg.users[0], pointless as at current
        // user2: msg.users[1], pointless as at current
        reaction: msg.reaction ? msg.reaction : false,
        isDeleted: msg.isDeleted,
        seenBy: msg.readByRecipients.map(el => el.readByUserId),
        seenAt: msg.createdAt,
        id: msg._id,
        file: msg.file,
        createdAt: msg.createdAt,
      };
    });
    return { msgs, total, conversation: con };
  };

  public setMsgAsSeen = async (convId: string, userId: string): Promise<boolean> => {
    // await message.findByIdAndUpdate(msgId, { seen: true });
    // return true;
    await message.updateMany(
      { convId, 'readByRecipients.readByUserId': { $ne: userId } },
      { $addToSet: { readByRecipients: { readByUserId: userId } } },
      { multi: true },
    );
    return true;
  };

  public maskMsg = async (msgId: string): Promise<boolean> => {
    await message.findByIdAndUpdate(msgId, { isDeleted: true });
    return true;
  };

  public addReaction = async (msgId: string, reaction: string): Promise<boolean> => {
    const reactionArr = ['wow', 'love', 'smile'];

    if (!reactionArr.includes(reaction)) {
      return false;
    }

    await message.findByIdAndUpdate(msgId, { reaction });
    return true;
  };

  public getConvByUserId = async (userId: string) => {
    const conv = await privateConv.find({ members: userId });
    return conv;
  };

  /**
   * @$match checks for messages that belong to the conversation ids in @param conv
   * @$project selects the fields needed from the query with a [1] and [0] if not needed
   * @$group gets the last value of each of the fields below and groups them into an array  */
  public getAllUserRecentMsgsFromConversations = async (conv: any, userId: any) => {
    // using mongoose aggregate
    const recentConv = message.aggregate([
      {
        $match: { conv: { $in: conv } },
      },
      {
        $project: {
          unSeen: {
            // returns a [0] if the message is read and a [1] if un read
            $cond: [{ $in: [userId, '$readByRecipients.readByUserId'] }, 0, 1],
          },
          conv: 1,
          msg: 1,
          sender: 1,
          readByRecipients: 1,
          createdAt: 1,
          file: 1,
          reaction: 1,
          isDeleted: 1,
        },
      },

      {
        $group: {
          _id: '$conv',
          messageId: { $last: '$_id' },
          convId: { $last: '$conv' },
          message: { $last: '$msg' },
          sender: { $last: '$sender' },
          file: { $last: '$file' },
          createdAt: { $last: '$createdAt' },
          readByRecipients: { $last: '$readByRecipients' },
          reaction: { $last: '$reaction' },
          isDeleted: { $last: '$isDeleted' },
          // returns number of unread messages
          unSeen: { $sum: '$unSeen' },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    // for await (const doc of recentConv) {
    //   console.log(doc);
    // }
    return recentConv;
  };

  public blockConversation = async (conv: string, userId: string): Promise<boolean> => {
    const con = await privateConv.findByIdAndUpdate(conv, { blocked: { is: true, by: userId } }, { new: true });
    if (!con.blocked.is) return false;
    return true;
  };

  public unBlockConversation = async (conv: string, userId: string): Promise<boolean> => {
    const con = await privateConv.findByIdAndUpdate(conv, { blocked: { is: false, by: '' } }, { new: true });
    if (con.blocked.is) return false;
    return true;
  };
}

export default MsgService;
