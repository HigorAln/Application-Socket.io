import { container } from "tsyringe";
import { io } from "../http";
import { CreateChatRoomServices } from "../services/CreateChatRoomServices";
import { CreateMessageServices } from "../services/CreateMessageServices";

import { CreateUserService } from "../services/CreateUserService";
import { GetAllUsersServices } from "../services/GetAllUsersServices";
import { GetChatRoomByIdService } from "../services/GetChatRoomByIdService";
import { GetChatRoomByUserService } from "../services/GetChatRoomByUserService";
import { GetMessageByChatRoomServices } from "../services/GetMessageByChatRoomServices";
import { GetUserBySocketIdServices } from "../services/GetUserBySocketIdServices";

io.on("connect", socket => {
  
  socket.on("start", async (data) =>{
    const {email, avatar, name} = data;
    const createUserService = container.resolve(CreateUserService)

    const user = await createUserService.execute({
      email,
      avatar,
      name,
      socket_id: socket.id
    })
    
    socket.broadcast.emit("new_users", user)
  })

  socket.on("get_users", async (callback)=> {
    const getAllUsersServices = container.resolve(GetAllUsersServices)
    const users = await getAllUsersServices.execute();

    callback(users);
  })

  socket.on("start_chat", async (data, callback)=>{
    const createCharRoomService = container.resolve(CreateChatRoomServices);
    const getChatRoomByUsersService = container.resolve(GetChatRoomByUserService);
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdServices);
    const getMessageByChatRoomService = container.resolve(GetMessageByChatRoomServices);
    
    const userLoged = await getUserBySocketIdService.execute(socket.id);

    let room = await getChatRoomByUsersService.execute([data.idUser, userLoged._id])

    if(!room){
      room = await createCharRoomService.execute([data.idUser, userLoged._id])
    }

    socket.join(room.idChatRoom)  // ATENTION

    // Buscar MEssagens da sala
    const messages = await getMessageByChatRoomService.execute(room.idChatRoom)

    callback({ room, messages })
  });

  socket.on("message", async (data) => {
    // Buscar as informacoes do usuario (socket.id)
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdServices);
    const createMessageServices = container.resolve(CreateMessageServices);
    const getChatRoomById = container.resolve(GetChatRoomByIdService);
    const user = await getUserBySocketIdService.execute(socket.id);
    // salvar a mensagem no banco de dados

    const message = await createMessageServices.execute({
      to: user._id,
      text: data.message,
      roomId: data.idChatRoom
    })

    io.to(data.idChatRoom).emit("message", {
      message,
      user
    })

    // Enviar notificação para usuario correto
    const room = await getChatRoomById.execute(data.idChatRoom);

    const userFrom = room.idUsers.find(response => String(response._id) !== String(user._id));

    io.to(userFrom.socket_id).emit("notification", {
      newMessage: true,
      roomId: data.idChatRoom,
      from: user
    })
  })
})