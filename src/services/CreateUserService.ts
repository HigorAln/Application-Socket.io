import { injectable } from 'tsyringe';
import { User } from '../shemas/Users'

interface CreateUserDTO {
  email: string;
  socket_id: string;
  avatar: string;
  name: string;
}

@injectable()
class CreateUserService {
  async execute({ avatar, email, name, socket_id }: CreateUserDTO){
    const useAlreadyExists = await User.findOne({
      email
    }).exec();

    if(useAlreadyExists){
      const user = await User.findOneAndUpdate(
        {
        _id: useAlreadyExists._id
        },
        {
          $set: { socket_id, avatar, name },
        }
      )
      return user;
    }else{
      const user = await User.create({
        email,
        socket_id,
        avatar,
        name
      })
      return user;
    }
  }
}

export { CreateUserService }