import chatRoom, { IChatroom } from '@/schema/chatRoom';
import chatRoomMsgs, { IChatmsg } from '@/schema/chatRoomMsgs';
import { Request } from 'express';

class ChatRoomService {
  constructor() {}

  private room = chatRoom;
  private roomMsg = chatRoomMsgs;

  /**
   * checks chat rooms for a temporary chat room with same name
   * @param name is the intended name for the chatroom
   * @param type is the intended type for the chatroom
   * @returns typeof string ["room is available"] if intended type is not temporary
   * and ["chat room exists"] if type is temporary and chatroom with type temporary already exists
   */
  public checkChatRoom = async (name: string, type: string): Promise<string> => {
    if (type === 'organization' || type === 'permanent') return 'room is available';

    const availableChatRooms = await this.room.findOne({ $and: [{ name }, { type: 'temporary' }] });

    if (availableChatRooms) {
      if (availableChatRooms.type === 'temporary' && type !== 'temporary') return 'room is available';
      return 'chat room exists';
    }
    return 'room is available';
  };

  public createChatRoom = async (data: any): Promise<string | IChatroom> => {
    const isChatRoomAvailable = await this.checkChatRoom(data.name, data.type);

    if (isChatRoomAvailable === 'chat room exists') return 'chat room exists';

    const newChatRoom = await this.room.create(data);
    await this.room.findByIdAndUpdate(newChatRoom._id, { $addToSet: { members: data.initiator } });
    return newChatRoom;
  };

  public getRoomsById = async (members: any): Promise<any> => {
    const chatRooms = await this.room.find({ members });
    return chatRooms;
  };

  public getRoomRecentConversation = async (roomIds: any, userId: any) => {
    const recentRooms = await this.roomMsg.aggregate([
      { $match: { chatRoomId: { $in: roomIds } } },

      {
        $project: {
          isUnread: {
            $cond: [{ $in: [userId, '$readByRecipients.readByUserId'] }, 0, 1],
          },
          chatRoomId: 1,
          message: 1,
          sendBy: 1,
          readByRecipients: 1,
          isDeleted: 1,
          createdAt: 1,
        },
      },

      {
        $group: {
          _id: '$chatRoomId',
          messageId: { $last: '$_id' },
          chatRoomId: { $last: '$chatRoomId' },
          message: { $last: '$message' },
          sendBy: { $last: '$sendBy' },
          createdAt: { $last: '$createdAt' },
          readByRecipients: { $last: '$readByRecipients' },
          unreadMessages: { $sum: '$isUnread' },
        },
      },
      { $sort: { createdAt: -1 } },

      //   {
      // $lookup: {
      //   from: 'ChatRoom',
      //   localField: 'chatRoomId',
      //   foreignField: '_id',
      //   as: 'chat_roomInfo',
      // },
      //   },
      //   { $unwind: '$chat_roomInfo' },
      //   { $sort: { createdAt: -1 } },
    ]);
    return recentRooms;
  };

  public searchRoomsByName = async (req: Request) => {
    // get groups user is not part of
    const keyword = String(req.query.keyword);
    const query = {
      $or: [
        {
          type: 'temporary',
          name: { $regex: keyword, $options: '$i' },
          members: { $nin: [req.query.userId] },
        },
        {
          type: 'permanent',
          name: { $regex: keyword, $options: '$i' },
          members: { $nin: [req.query.userId] },
        },
        {
          type: 'organization',
          name: { $regex: keyword, $options: '$i' },
          members: { $nin: [req.query.userId] },
        },
      ],
    };

    // get rooms user is part of
    const query1 = {
      name: { $regex: keyword, $options: '$i' },
      members: { $in: [req.query.userId] },
    };

    // query2 is  a primitve way for solving same issue with query1
    const nameFilter = new RegExp(String(req.query.keyword), 'ig');
    const query2 = {
      name: nameFilter,
      members: { $in: [req.query.userId] },
    };

    const toJoinChatRooms = await this.room.find(query);
    const joinedChatRooms = await this.room.find(query1);
    const chatRoomIds = joinedChatRooms.map(joinedRoom => joinedRoom._id);

    const joinedRoomsInfo = await this.getRoomRecentConversation(chatRoomIds, req.query.userId);

    const result =
      toJoinChatRooms.length && joinedChatRooms.length
        ? { toJoinChatRooms, joinedRoomsInfo }
        : toJoinChatRooms.length
        ? { toJoinChatRooms }
        : { joinedRoomsInfo };
    // return { joinedRoomsInfo, joinedChatRooms, toJoinChatRooms };
    return result;
  };

  public addMembers = async (members: any, roomId: string) => {
    const newRoom = await this.room.findByIdAndUpdate(roomId, { $addToSet: { members: { $each: members } } });
    return newRoom;
  };

  public removeMember = async (roomId: string, members: any): Promise<any> => {
    try {
      await this.room.findByIdAndUpdate(roomId, { $pull: { members: { $in: members } } });
      return true;
    } catch (e) {
      return e;
    }
  };

  public getRoomById = async (chatRoomId: string, userId: string): Promise<IChatroom> => {
    const room = await this.room.findOne({ _id: chatRoomId, members: { $in: userId } });
    return room;
  };

  public getMessagesByRoomId = async (chatRoomId: string): Promise<any> => {
    const messages = this.roomMsg.find({ chatRoomId });
    return messages;
  };

  public saveMessage = async (chatRoomId: string, message: any, sendBy: string): Promise<boolean> => {
    await this.roomMsg.create({
      chatRoomId,
      message,
      sendBy,
      readByRecipients: { readByUserId: sendBy },
    });
    return true;
  };

  public markMessageAsRead = async (chatRoomId: string, userId: string): Promise<any> => {
    try {
      await this.roomMsg.updateMany(
        {
          chatRoomId,
          'readByRecipients.readByUserId': { $ne: userId },
        },
        {
          $addToSet: {
            readByRecipients: { readByUserId: userId },
          },
        },
        {
          multi: true,
        },
      );
    } catch (e) {
      return e;
    }
  };
  public muteRoom = async (chatRoomId: string, currentUserId: string): Promise<any> => {
    const result = await this.room.updateOne({ _id: chatRoomId, members: { $in: [currentUserId] } }, { $addToSet: { muteBy: currentUserId } });

    return result;
  };

  public unmuteRoom = async (chatRoomId: string, currentUserId: string): Promise<boolean> => {
    await this.room.findByIdAndUpdate(chatRoomId, {
      $pull: { muteBy: currentUserId },
    });

    return true;
  };

  public updateRoom = async (chatRoomId: string, data: any): Promise<any> => {
    const result = await this.room.findByIdAndUpdate(chatRoomId, data);
    return result;
  };

  public leaveRoom = async (chatRoomId: string, userId: string): Promise<any> => {
    const result = await this.room.findByIdAndUpdate(chatRoomId, { $pull: { members: { $in: userId } } }, { new: true });

    return result;
  };

  public getMessageById = async (messageId: string) => {
    const result = await this.roomMsg.findById(messageId);
    return result;
  };

  public deleteMessage = async (messageId: string) => {
    const result = await this.roomMsg.findByIdAndUpdate(messageId, { isDeleted: true });
    return result;
  };

  public membersExistInRoom = async (roomId: string, members: any): Promise<any> => {
    const rooms = await this.room.findOne({ _id: roomId, members: { $in: members } });
    return rooms;
  };

  public activateSafeWords = async (roomId: string): Promise<any> => {
    const room = await this.room.updateOne({ _id: roomId }, { noFoulWords: true }, { new: true });
    return room;
  };

  public deactivateSafeWords = async (roomId: string): Promise<any> => {
    const room = await this.room.updateOne({ _id: roomId }, { noFoulWords: false }, { new: true });
    return room;
  };
}

export default ChatRoomService;
