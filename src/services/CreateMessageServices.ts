import { injectable } from "tsyringe";
import { Message } from "../shemas/Message";

interface CreateMessageDTO {
 to: string;
 text: string;
 roomId: string;
}

@injectable()
class CreateMessageServices {
  async execute({roomId, text, to}: CreateMessageDTO ){  
    const message = await Message.create({
      to,
      text,
      roomId
    })

    return message
  }
}

export { CreateMessageServices }