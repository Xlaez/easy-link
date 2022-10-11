import { cloudinaryService } from '@/libs';
import MsgService from '@/services/message';
import { Request, Response, NextFunction } from 'express';

class MsgController {
  constructor() {}
  // message service
  public msg = new MsgService();

  public sendMsg = async (req: Request, res: Response, next: NextFunction) => {
    const { body, file } = req;
    try {
      let data = { msg: body.msg, sender: body.from, users: [body.from, body.to], conv: body.convId };

      if (file) {
        const audioArr = ['audio/mpeg', 'audio/mp3', 'audio/m4a'];
        let filetype = 'photo';
        if (audioArr.includes(file.mimetype)) {
          filetype = 'audio';
        }

        const { url } = await cloudinaryService.uploadSingle(file.path);

        const fileData = {
          fileUrl: url,
          fileType: filetype,
        };

        const d = Object.assign(fileData, data);
        data = d;
      }

      const r = await this.msg.createMsg(data);

      if (!r) return res.status(500).json({ status: 'fail', data: 'can not send message' });

      res.status(201).json({ status: 'success', data: 'sent' });
    } catch (e) {
      next(e);
    }
  };

  /**
   * @method getMsg is a typo: should be [getMsgs or getMessages]
   * the method get's all messages in a chatroom upon click
   * @const [from] is the userId of the client
   * @returns messages of a particular chat
   */

  public getMsg = async (req: Request, res: Response, next: NextFunction) => {
    const { from, convId: conv, pageNo: pageId, pageSize } = req.query;

    try {
      const msgs = await this.msg.getmsgs(from.toString(), conv.toString(), +pageId, +pageSize);

      if (!msgs) return res.status(404).json({ status: 'fail', data: 'resource not found' });

      res.status(200).json({ status: 'success', data: msgs });
    } catch (e) {
      next(e);
    }
  };

  /**@const id is the conversation id */
  public setMsgAsSeen = async (req: Request, res: Response, next: NextFunction) => {
    const { id, userId } = req.params;

    try {
      const r = await this.msg.setMsgAsSeen(id.toString(), userId.toString());

      if (!r) return res.status(404).json({ status: 'fail', data: 'resource not found' });
      res.status(200).json({ status: 'success', data: r });
    } catch (e) {
      next(e);
    }
  };

  /**
   *
   * @method setMsgsAsDeleted sets the deleted field of a message to true.
   * On the client-side messages with deleted set to true are masked
   * @id is the message id
   */
  public setMsgAsDeleted = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const r = await this.msg.maskMsg(id.toString());

      if (!r) return res.status(404).json({ status: 'fail', data: 'resource not found' });
      res.status(200).json({ status: 'success', data: r });
    } catch (e) {
      next(e);
    }
  };

  /**
   *
   * @const id is the messages id
   */
  public addReaction = async (req: Request, res: Response, next: NextFunction) => {
    const { id, reaction } = req.body;

    try {
      const r = await this.msg.addReaction(id.toString(), reaction.toString());

      if (!r) return res.status(404).json({ status: 'fail', data: 'provide valid reaction' });
      res.status(200).json({ status: 'success', data: r });
    } catch (e) {
      next(e);
    }
  };

  /**
   *
   * @blockConversation uses the convId to update a conersations blocked field to true and set it's by
   *  property to  the user's id
   */
  public blockConversation = async (req: Request, res: Response, next: NextFunction) => {
    const { convId, userId } = req.params;

    try {
      const con = await this.msg.blockConversation(convId.toString(), userId.toString());

      if (!con) return res.status(500).json({ status: 'fail', data: 'cannot block conversation' });

      res.status(200).json({ status: 'success' });
    } catch (e) {
      next(e);
    }
  };

  /**
   *
   * @method unblockConversation does the exact opposite of [@method] blockConversation
   */

  public unblockConversation = async (req: Request, res: Response, next: NextFunction) => {
    const { convId, userId } = req.params;

    try {
      const con = await this.msg.unBlockConversation(convId.toString(), userId.toString());

      if (!con) return res.status(500).json({ status: 'fail', data: 'cannot unblock conversation' });

      res.status(200).json({ status: 'success' });
    } catch (e) {
      next(e);
    }
  };

  /**
   *
   * @const [conversations] uses the userId query parameter to get all user's conversations and maps
   * them into an array
   * @const [convIds] maps these conversations and returns the [_id]s of the conversations
   * @returns all last messages across all conversations of a user including the number of unread messages
   */
  public getAllUserRecentMessages = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query;

    try {
      const conversations = await this.msg.getConvByUserId(userId.toString());

      if (!conversations) return res.status(404).json({ status: 'fail', data: 'user has no conversations' });

      const convIds = conversations.map(conv => conv._id);

      const conv = await this.msg.getAllUserRecentMsgsFromConversations(convIds, userId);

      if (!conv) return res.status(404).json({ status: 'fail', data: 'user has no conversation' });

      const flatenedConv = conv.map((conv: any) => {
        const readBy = conv.readByRecipients.flat();

        return {
          id: conv._id,
          msgId: conv.messageId,
          convId: conv.convId,
          message: conv.message,
          sender: conv.sender,
          sentAt: conv.createdAt,
          unSeenMsgs: conv.unSeen,
          isDeleted: conv.isDeleted,
          reaction: conv.reaction,
          readBy,
          file: conv.file,
        };
      });

      res.status(200).json({ status: 'success', data: flatenedConv });
    } catch (e) {
      next(e);
    }
  };
}
export default MsgController;
