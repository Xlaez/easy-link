import { Router } from 'express';
import { Routes2 } from '@interfaces/routes';
import { multerSetup } from '@/libs';
import MsgController from '@/controllers/message';
import ChatRoomController from '@/controllers/chatRoom';

class MsgRouter implements Routes2 {
  public path = '/msg';
  public path2 = '/chat-room';
  public router = Router();
  public msgController = new MsgController();
  public chatController = new ChatRoomController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/send`, multerSetup.singleUpload, this.msgController.sendMsg);
    this.router.get(`${this.path}`, this.msgController.getMsg);
    this.router.patch(`${this.path}/seen/:id`, this.msgController.setMsgAsSeen);
    this.router.delete(`${this.path}/delete/:id`, this.msgController.setMsgAsDeleted);
    this.router.put(`${this.path}/reaction`, this.msgController.addReaction);
    this.router.patch(`${this.path}/block/:convId/:userId`, this.msgController.blockConversation);
    this.router.purge(`${this.path}/unblock/:convId/:userId`, this.msgController.unblockConversation);

    this.router.post(`${this.path2}/create-room`, multerSetup.singleUpload, this.chatController.createNew);
    this.router.post(`${this.path2}/send-msg`, multerSetup.singleUpload, this.chatController.createMsg);
    this.router.get(`${this.path2}/search-rooms`, this.chatController.findRoomByName);
    this.router.put(`${this.path2}/members`, this.chatController.addMembers);
    this.router.purge(`${this.path2}/members`, this.chatController.removeMembers);
    this.router.get(`${this.path2}/recent-room`, this.chatController.getRoomRecentConversation);
    this.router.patch(`${this.path2}/read-msg`, this.chatController.markMsgRead);
    this.router.patch(`${this.path2}/update/:roomId`, multerSetup.singleUpload, this.chatController.updateRoomDetails);
    this.router.purge(`${this.path2}/leave/:roomId/:userId`, this.chatController.leaveRoom);
    this.router.delete(`${this.path2}/delete/:msgId`, this.chatController.deleteMsg);
  }
}

export default MsgRouter;
