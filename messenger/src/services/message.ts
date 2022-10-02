import message from '@/schema/message';
import privateConv from '@/schema/privateConv';

class MsgService {
  constructor() {}

  public createMsg = async (body: any): Promise<boolean> => {
    let msg = new message({
      ...body,
    });
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

  public getmsgs = async (from: string, to: string, conv: string, pageId: number = 1, pageSize: number = 15): Promise<any> => {
    const messages = await message
      .find({
        // users: {
        //   $all: [from, to],
        // },
        conv: conv,
      })
      .skip((pageId - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: 1 })
      .lean();

    const total = await message
      .find({
        // users: {
        //   $all: [from, to],
        // },
        conv: conv,
      })
      .countDocuments();
    const con = await privateConv.findById(conv).lean();
    const msgs = messages.map(msg => {
      return {
        from: msg.sender === from,
        body: msg.msg,
        user1: msg.users[0],
        user2: msg.users[1],
        seen: msg.seen,
        reaction: msg.reaction ? msg.reaction : false,
        isDeleted: msg.isDeleted,
        id: msg._id,
        file: msg.file,
        createdAt: msg.createdAt,
      };
    });
    return { msgs, total, conversation: con };
  };

  public setMsgAsSeen = async (msgId: string): Promise<boolean> => {
    await message.findByIdAndUpdate(msgId, { seen: true });
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

  public getAllUserRecentMsgsFromConversations = async () => {
    // using mongoose aggregate
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
