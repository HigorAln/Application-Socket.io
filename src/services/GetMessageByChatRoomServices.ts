import { injectable } from "tsyringe";
import { Message } from "../shemas/Message";


@injectable()
class GetMessageByChatRoomServices {
  async execute(roomId: string){
    const messages = await Message.find({
      roomId
    }).populate("to").exec();
    
    return messages
  }
}

export { GetMessageByChatRoomServices }