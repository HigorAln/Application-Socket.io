import { ObjectId } from "mongoose";
import { injectable } from "tsyringe";
import { ChatRoom } from "../shemas/ChatRoom";

@injectable()
class GetChatRoomByUserService{
  async execute(idUsers: ObjectId[]) {

    const room = await ChatRoom.findOne({
      idUsers: {
        $all: idUsers
      }
    }).exec()

    return room;
  }
}


export { GetChatRoomByUserService }