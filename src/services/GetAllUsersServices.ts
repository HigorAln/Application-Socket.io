import { injectable } from "tsyringe";
import { User } from "../shemas/Users";


@injectable()
class GetAllUsersServices {
  async execute(){
    const users = await User.find();
    return users;
  }
}

export { GetAllUsersServices }