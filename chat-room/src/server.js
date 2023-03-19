const server = require("http").createServer();
const io = require("socket.io")(server, {
  transports: ["websocket", "polling"]
});

const users = {};
const user = ""


io.on("connection", client => {
  client.on("username", username => {
    const user = {
      score: 0,
      name: username,
      id: client.id
    };
    users[client.id] = user;
    io.emit("connected", user);
    io.emit("users", Object.values(users));
  });


  //send event
  client.on("send", message => {
    io.emit("message", {
      text: message,
      date: new Date().toISOString(),
      user: users[client.id]
    });
  });

  client.on("player", () => {
    const player = client.id
    io.emit("player", player)////
  })


  //disconnect event - every one running app will remove that user from the users state
  client.on("disconnect", () => {
    const username = users[client.id];
    delete users[client.id];
    io.emit("disconnected", client.id);
  });
});
server.listen(3000);
