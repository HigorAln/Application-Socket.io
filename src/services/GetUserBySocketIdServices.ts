import { injectable } from "tsyringe";
import { User } from "../shemas/Users";

@injectable()
class GetUserBySocketIdServices {
  async execute(socket_id: string){
    const user = await User.findOne({
      socket_id
    });

    return user
  }
}

export { GetUserBySocketIdServices }