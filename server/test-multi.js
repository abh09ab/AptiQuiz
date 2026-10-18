const { io } = require("socket.io-client");
const SERVER_URL = "http://localhost:3000";

const socket = io(SERVER_URL);
let currentCode = "";

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);

  socket.emit("room:create", { name: "HostPlayer" }, (res) => {
    if (res?.error) {
      console.error("Create room error:", res.error);
      process.exit(1);
    }
    currentCode = res.room.code;
    console.log("Room created:", currentCode);

    socket.emit("room:start", { code: currentCode, totalQuestions: 3 }, (startRes) => {
      console.log("Start game response:", startRes);
    });
  });
});

socket.on("game:question", (q) => {
  console.log(`\n--- RECEIVED QUESTION ${q.currentQuestionIndex}/${q.totalQuestions} ---`);
  console.log("Text:", q.text);
  console.log("Submitting answer in 1 sec...");
  setTimeout(() => {
    socket.emit("answer:submit", {
      code: currentCode,
      questionId: q.questionId,
      optionId: q.options[0].id
    }, (ansRes) => {
      console.log("Answer response:", ansRes);
    });
  }, 1000);
});

socket.on("game:reveal", (rev) => {
  console.log(`\n=== REVEAL RECEIVED for Q ${rev.currentQuestionIndex}/${rev.totalQuestions} ===`);
  console.log("Is last question?", rev.isLastQuestion);
  console.log("Next countdown:", rev.nextCountdown);
  if (rev.isLastQuestion) {
    console.log("MATCH FINISHED SUCCESS!");
    setTimeout(() => process.exit(0), 1000);
  }
});

socket.on("room:updated", (r) => {
  console.log(`[ROOM STATUS]: ${r.status}, QIndex: ${r.currentQuestionIndex}`);
});
