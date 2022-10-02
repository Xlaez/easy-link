import { cloudinaryService } from '@/libs';
import ChatRoomService from '@/services/chatRoom';
import getResourceType from '@/utils/getFileType';
import { NextFunction, Request, Response } from 'express';
import { File } from 'winston/lib/winston/transports';

class ChatRoomController {
  constructor() {}
  private service = new ChatRoomService();

  public createNew = async (req: Request, res: Response, next: NextFunction) => {
    const { body, file } = req;

    let data;

    const { type, name, members, userId } = body;

    try {
      if (!file) {
        data = { members, type, name, initiator: userId };
      } else if (file) {
        const imageArr = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!imageArr.includes(file.mimetype)) return res.status(400).json({ status: 'fail', data: 'image type is invalid' });

        const { url } = await cloudinaryService.uploadSingle(file.path);

        data = {
          members,
          type,
          name,
          initiator: userId,
          brand: url,
        };
      }

      const newRoom = await this.service.createChatRoom(data);
      if (!newRoom || newRoom === 'chat room exists')
        return res.status(500).json({ status: 'fail', data: 'cannot create chat room or chat room name exists' });

      res.status(201).json({ status: 'success', data: 'room created' });
    } catch (e) {
      next(e);
    }
  };

  public createMsg = async (req: Request, res: Response, next: NextFunction) => {
    const { files } = req;
    const { chatRoomId, message, userId } = req.body;

    let payload = {};

    try {
      const room = await this.service.getRoomById(chatRoomId, userId);
      if (!room) return res.status(404).json({ status: 'fail', data: 'room not found' });

      if (req.body && files?.length) {
        //@ts-expect-error
        const filePaths = files.map((file: any) => file.path);
        const fileType = await getResourceType(files[0]);

        const fileData = await cloudinaryService.uploadMultiple(filePaths);
        const fileUrls = fileData.map((file: any) => ({ url: file.url }));

        payload = Object.assign({ message }, fileUrls);
      } else if (req.body) {
        payload = { message };
      } else if (files?.length) {
        // @ts-expect-error
        const filePaths = files.map((file: any) => file.path);
        const fileType = await getResourceType(files[0]);

        const fileData = await cloudinaryService.uploadMultiple(filePaths);
        const fileUrls = fileData.map((file: any) => ({ url: file.url }));

        payload = Object.assign(fileUrls);
      } else {
        return res.status(400).json({ status: 'fail', data: 'neither file nor text' });
      }

      const msg = await this.service.saveMessage(chatRoomId, payload, userId);

      if (!msg) return res.status(500).json({ status: 'fail', data: 'cannot send message' });

      // send to sockets here
      res.status(201).json({ status: 'success' });
    } catch (e) {
      next(e);
    }
  };

  public findRoomByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rooms = await this.service.searchRoomsByName(req);

      if (!rooms) return res.status(404).json({ status: 'fail', data: 'room not found' });

      res.status(200).json({ status: 'success', data: rooms });
    } catch (e) {
      next(e);
    }
  };

  public addMembers = async (req: Request, res: Response, next: NextFunction) => {
    const { members, roomId } = req.body;
    try {
      const membersExtist = await this.service.membersExistInRoom(roomId, members);

      if (membersExtist) return res.status(400).json({ status: 'fail', data: 'one or more members already exist' });
      await this.service.addMembers(members, roomId);
      res.status(200).json({ status: 'success' });
    } catch (e) {
      next(e);
    }
  };

  public removeMembers = async (req: Request, res: Response, next: NextFunction) => {
    const { members, roomId, userId } = req.body;
    try {
      const r = this.service.removeMember(roomId, userId, members);
      if (!r) return res.status(500).json({ status: 'fail' });

      res.status(200).json({ status: 'success' });
    } catch (e) {
      next(e);
    }
  };

  public getRoomRecentConversation = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query;
    try {
      const rooms = await this.service.getRoomsById(userId);

      if (!rooms.length) return res.status(404).json({ status: 'fail', data: "rooms can't be found" });
      const allRooms = rooms.map((room: any) => room.id);

      const recentRoom = await this.service.getRoomRecentConversation(allRooms, userId);

      const r = recentRoom.map((conversation: any) => {
        const readBy = coversation.readByRecipients.flat();

        return {
          id: conversation._id,
          msgId: conversation.messageId,
          roomId: conversation.chatRoomId,
          message: conversation.message,
          sendBy: conversation.sendBy,
          unreadMsgs: conversation.unreadMessages,
          readBy,
        };
      });
      res.status(200).json({ status: 'success', data: r });
    } catch (e) {
      next(e);
    }
  };

  public markMsgRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomId, userId } = req.body;
      const room = await this.service.getRoomById(roomId, userId);

      if (!room) return res.status(404).json({ status: 'fail', data: 'room not found' });

      await this.service.markMessageAsRead(roomId, userId);
      res.status(200).json({ status: 'success' });
    } catch (e) {
      next(e);
    }
  };

  public updateRoomDetails = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params;
    const { name, userId } = req.body;
    const { file } = req;
    try {
      let data: any;

      if (name && file) {
        const { url } = await cloudinaryService.uploadSingle(file.path);

        data = { name, brand: url };
      } else if (name) {
        data = { name };
      } else if (file) {
        const { url } = await cloudinaryService.uploadSingle(file.path);
        data = { brand: url };
      } else {
        res.status(400).json({ status: 'fail', data: 'provide a photo or name to update' });
      }

      const r = await this.service.updateRoom(roomId, data);

      if (!r) return res.status(500).json({ status: 'fail' });

      res.status(200).json({ status: 'success', data: r });
    } catch (e) {
      next(e);
    }
  };

  public leaveRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, roomId } = req.params;
    try {
      await this.service.leaveRoom(roomId, userId);
      res.status(200).json({ status: 'success' });
    } catch (e) {
      next(e);
    }
  };

  // remember to delete message, check services that are not working and update aggregate
}

export default ChatRoomController;