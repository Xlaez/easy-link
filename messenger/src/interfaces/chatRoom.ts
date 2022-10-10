interface ICreateNewRoomBody {
  type: string;
  name: string;
  members: Array<any>;
  userId: string;
}
export interface ICreateNewRoom {
  body: ICreateNewRoomBody;
  file?: Express.Multer.File;
}

export interface ISendRoomMsg {
  chatRoomId: string;
  message?: string;
  userId: string;
  safeWords?: boolean;
}

export interface IAddMembersBody {
  members: Array<any>;
  roomId: string;
}

export interface IRemoveMembersBody extends IAddMembersBody {
  userId: string;
}
