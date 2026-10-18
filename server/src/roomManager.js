
const rooms = new Map();

function generateRoomCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code;

  do {
    code = "";

    for (let i = 0; i < 6; i++) {
      code += characters[
        Math.floor(Math.random() * characters.length)
      ];
    }
  } while (rooms.has(code));

  return code;
}

function createRoom(hostId, hostName) {
  const code = generateRoomCode();

    const room = {
      code,
      hostId,
      status: "lobby",
      players: new Map(),
      currentQuestion: null
    };

  room.players.set(hostId, {
    id: hostId,
    name: hostName,
    score: 0
  });

  rooms.set(code, room);

  return room;
}

function getRoom(code) {
  return rooms.get(code);
}

function getPublicRoom(room) {
  return {
    code: room.code,
    status: room.status,
    hostId: room.hostId,
    totalQuestions: room.totalQuestions || 5,
    currentQuestionIndex: (room.currentQuestionIndex !== undefined ? room.currentQuestionIndex : 0) + 1,
    players: Array.from(room.players.values()).map(
      ({ id, name, score }) => ({ id, name, score })
    )
  };
}

function findRoomByPlayer(playerId) {
  for (const room of rooms.values()) {
    if (room.players.has(playerId)) {
      return room;
    }
  }
  return null;
}

function removePlayer(code, playerId) {
  const room = rooms.get(code);
  if (!room) return null;
  room.players.delete(playerId);
  if (room.players.size === 0) {
    rooms.delete(code);
    return null;
  }
  if (room.hostId === playerId) {
    const nextHost = room.players.keys().next().value;
    room.hostId = nextHost;
  }
  return room;
}

module.exports = {
  createRoom,
  getRoom,
  getPublicRoom,
  findRoomByPlayer,
  removePlayer
};
