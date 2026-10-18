const {
  createRoom,
  getRoom,
  getPublicRoom,
  findRoomByPlayer,
  removePlayer
} = require("./roomManager");

const questions = require("../Data/question.json");

module.exports = (io) => {
  function sendNextQuestion(room) {
    if (!room.usedQuestionIds) {
      room.usedQuestionIds = new Set();
    }
    let available = questions.filter((q) => !room.usedQuestionIds.has(q.id));
    if (available.length === 0) {
      available = questions;
      room.usedQuestionIds.clear();
    }
    const selected = available[Math.floor(Math.random() * available.length)];
    room.usedQuestionIds.add(selected.id);

    const duration = 15000;

    room.currentQuestion = {
      questionId: selected.id,
      text: selected.question,
      options: selected.options,
      correctOptionId: selected.correctOptionId,
      explanation: selected.explanation || "",
      duration,
      deadline: Date.now() + duration,
      answers: new Map()
    };

    room.status = "playing";

    const revealTimer = setTimeout(() => {
      if (room.status === "playing" && room.currentQuestion?.questionId === selected.id) {
        triggerRevealAndNext(room);
      }
    }, duration + 500);

    room.currentQuestion.revealTimer = revealTimer;

    io.to(room.code).emit("room:updated", getPublicRoom(room));

    io.to(room.code).emit("game:question", {
      questionId: room.currentQuestion.questionId,
      text: room.currentQuestion.text,
      options: room.currentQuestion.options,
      duration: room.currentQuestion.duration,
      deadline: room.currentQuestion.deadline,
      currentQuestionIndex: (room.currentQuestionIndex || 0) + 1,
      totalQuestions: room.totalQuestions || 5
    });
  }

  function triggerRevealAndNext(room) {
    if (room.currentQuestion?.revealTimer) {
      clearTimeout(room.currentQuestion.revealTimer);
    }

    const scores = Array.from(room.players.values()).map(
      ({ id, name, score }) => ({ id, name, score })
    );

    const isLastQuestion = (room.currentQuestionIndex || 0) >= (room.totalQuestions || 5) - 1;
    const nextCountdown = 5;

    io.to(room.code).emit("game:reveal", {
      questionId: room.currentQuestion.questionId,
      correctOptionId: room.currentQuestion.correctOptionId,
      explanation: room.currentQuestion.explanation,
      scores,
      currentQuestionIndex: (room.currentQuestionIndex || 0) + 1,
      totalQuestions: room.totalQuestions || 5,
      isLastQuestion,
      nextCountdown: isLastQuestion ? 0 : nextCountdown
    });

    if (isLastQuestion) {
      room.status = "finished";
      io.to(room.code).emit("room:updated", getPublicRoom(room));
    } else {
      room.status = "intermission";
      io.to(room.code).emit("room:updated", getPublicRoom(room));

      room.intermissionTimer = setTimeout(() => {
        if (room.status === "intermission") {
          room.currentQuestionIndex = (room.currentQuestionIndex || 0) + 1;
          sendNextQuestion(room);
        }
      }, nextCountdown * 1000);
    }
  }

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // Host creates a room
    socket.on("room:create", ({ name } = {}, callback) => {
      if (typeof name !== "string" || !name.trim()) {
        return callback?.({
          error: "Valid player name required"
        });
      }

      const room = createRoom(socket.id, name.trim());

      socket.join(room.code);

      callback?.({
        room: getPublicRoom(room)
      });

      io.to(room.code).emit(
        "room:updated",
        getPublicRoom(room)
      );
    });

    // Player joins an existing room
    socket.on("room:join", ({ code, name } = {}, callback) => {
      if (
        typeof code !== "string" ||
        typeof name !== "string" ||
        !name.trim()
      ) {
        return callback?.({
          error: "Room code and valid name required"
        });
      }

      const room = getRoom(code.trim().toUpperCase());

      if (!room) {
        return callback?.({ error: "Room not found" });
      }

      if (room.status !== "lobby") {
        return callback?.({
          error: "Game has already started"
        });
      }

      if (room.players.size >= 50) {
        return callback?.({ error: "Room is full" });
      }

      const player = {
        id: socket.id,
        name: name.trim(),
        score: 0
      };

      room.players.set(socket.id, player);
      socket.join(room.code);

      callback?.({
        room: getPublicRoom(room)
      });

      io.to(room.code).emit(
        "room:updated",
        getPublicRoom(room)
      );
    });

    // Host starts the game
    socket.on("room:start", ({ code, totalQuestions } = {}, callback) => {
      if (typeof code !== "string" || !code.trim()) {
        return callback?.({
          error: "Valid room code required"
        });
      }

      const room = getRoom(code.trim().toUpperCase());

      if (!room) {
        return callback?.({ error: "Room not found" });
      }

      if (room.hostId !== socket.id) {
        return callback?.({
          error: "Only the host can start the game"
        });
      }

      if (room.status !== "lobby" && room.status !== "finished") {
        return callback?.({
          error: "Game has already started"
        });
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        return callback?.({
          error: "Question bank is empty"
        });
      }

      // Reset room match parameters
      room.totalQuestions = parseInt(totalQuestions, 10) || 5;
      room.currentQuestionIndex = 0;
      room.usedQuestionIds = new Set();

      // Reset player scores for a new game session
      for (const player of room.players.values()) {
        player.score = 0;
      }

      callback?.({ success: true });

      // Send first question
      sendNextQuestion(room);
    });

    // Player submits an answer
    socket.on("answer:submit", ({ code, questionId, optionId } = {}, callback) => {
      if (
        typeof code !== "string" ||
        typeof questionId !== "string" ||
        typeof optionId !== "string"
      ) {
        return callback?.({ error: "Invalid answer data" });
      }

      const room = getRoom(code.trim().toUpperCase());

      if (!room || room.status !== "playing") {
        return callback?.({ error: "Game is not active" });
      }

      const question = room.currentQuestion;

      if (!question || question.questionId !== questionId) {
        return callback?.({ error: "Question not found" });
      }

      if (!room.players.has(socket.id)) {
        return callback?.({ error: "You are not in this room" });
      }

      if (Date.now() > question.deadline) {
        return callback?.({ error: "Time is up" });
      }

      if (
        !question.options.some((option) => option.id === optionId)
      ) {
        return callback?.({ error: "Invalid option" });
      }

      if (!question.answers) {
        question.answers = new Map();
      }

      if (question.answers.has(socket.id)) {
        return callback?.({ error: "You already answered" });
      }

      const isCorrect = optionId === question.correctOptionId;

      question.answers.set(socket.id, {
        optionId,
        isCorrect
      });

      const player = room.players.get(socket.id);

      if (isCorrect) {
        player.score += 100;
      }

      callback?.({
        success: true,
        correct: isCorrect,
        score: player.score
      });

      // Reveal and queue next when every player has answered
      if (question.answers.size === room.players.size) {
        triggerRevealAndNext(room);
      }
    });

    // Client disconnected
    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
      const room = findRoomByPlayer(socket.id);
      if (room) {
        const updatedRoom = removePlayer(room.code, socket.id);
        if (updatedRoom) {
          io.to(updatedRoom.code).emit(
            "room:updated",
            getPublicRoom(updatedRoom)
          );
          if (
            updatedRoom.status === "playing" &&
            updatedRoom.currentQuestion?.answers &&
            updatedRoom.currentQuestion.answers.size === updatedRoom.players.size
          ) {
            triggerRevealAndNext(updatedRoom);
          }
        }
      }
    });
  });
};
