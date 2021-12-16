import { injectable } from "tsyringe";
import { ChatRoom } from "../shemas/ChatRoom";


@injectable()
class CreateChatRoomServices {
  async execute(idUsers: string[]){
    const room = await ChatRoom.create({
      idUsers
    })

    return room;
  }
}

export { CreateChatRoomServices }