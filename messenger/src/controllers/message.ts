import { cloudinaryService } from '@/libs';
import MsgService from '@/services/message';
import { Request, Response, NextFunction } from 'express';

class MsgController {
  constructor() {}
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

  public getMsg = async (req: Request, res: Response, next: NextFunction) => {
    const { from, to, convId: conv } = req.query;

    try {
      const msgs = await this.msg.getmsgs(from.toString(), to.toString(), conv.toString());

      if (!msgs) return res.status(404).json({ status: 'fail', data: 'resource not found' });

      res.status(200).json({ status: 'success', data: msgs });
    } catch (e) {
      next(e);
    }
  };

  public setMsgAsSeen = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const r = await this.msg.setMsgAsSeen(id.toString());

      if (!r) return res.status(404).json({ status: 'fail', data: 'resource not found' });
      res.status(200).json({ status: 'success', data: r });
    } catch (e) {
      next(e);
    }
  };

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
}
export default MsgController;
