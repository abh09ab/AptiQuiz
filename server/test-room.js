
const { io } = require("socket.io-client");
const questions = require("./Data/question.json");

const SERVER_URL = "http://localhost:3000";

const host = io(SERVER_URL);
let player2;

let timeout;
let finished = false;
let revealCount = 0;

function finish(exitCode = 0) {
  if (finished) return;

  finished = true;
  clearTimeout(timeout);

  host.disconnect();
  player2?.disconnect();

  process.exitCode = exitCode;
}

timeout = setTimeout(() => {
  console.log("Test timed out.");
  finish(1);
}, 10000);

host.on("connect_error", (err) => {
  console.log("Host connection error:", err.message);
  finish(1);
});

host.on("connect", () => {
  console.log("Host connected");

  host.emit("room:create", { name: "Abhay" }, (createRes) => {
    if (createRes?.error || !createRes?.room?.code) {
      console.log("Room creation failed:", createRes);
      finish(1);
      return;
    }

    const code = createRes.room.code;
    console.log("Room created:", code);

    // Connect the second player after room creation.
    player2 = io(SERVER_URL, { autoConnect: false });

    player2.on("connect_error", (err) => {
      console.log("Player 2 connection error:", err.message);
      finish(1);
    });

    player2.on("connect", () => {
      console.log("Player 2 connected");

      player2.emit(
        "room:join",
        { code, name: "Player 2" },
        (joinRes) => {
          if (joinRes?.error || !joinRes?.room) {
            console.log("Join failed:", joinRes?.error || joinRes);
            finish(1);
            return;
          }

          console.log("Player 2 joined!");

          // Listen before starting the game.
          function handleReveal(result) {
            revealCount++;
            console.log("Game reveal:", result);

            if (revealCount === 2) {
              console.log("Both players received the reveal.");
              finish(0);
            }
          }

          host.on("game:reveal", handleReveal);
          player2.on("game:reveal", handleReveal);

          player2.once("game:question", (question) => {
            console.log("Question received:", question.text);

            // Look up the answer in the local question bank.
            const bankQuestion = questions.find(
              (item) => item.id === question.questionId
            );

            if (!bankQuestion) {
              console.log("Question not found in question.json.");
              finish(1);
              return;
            }

            const correctOption = question.options.find(
              (option) => option.id === bankQuestion.correctOptionId
            );

            const wrongOption = question.options.find(
              (option) => option.id !== bankQuestion.correctOptionId
            );

            if (!correctOption || !wrongOption) {
              console.log("Valid answer options not found.");
              finish(1);
              return;
            }

            // Player 2 submits the correct answer.
            player2.emit(
              "answer:submit",
              {
                code,
                questionId: question.questionId,
                optionId: correctOption.id
              },
              (answerRes) => {
                console.log("Player 2 answer result:", answerRes);

                if (answerRes?.error || !answerRes?.success) {
                  finish(1);
                  return;
                }

                // Host submits the wrong answer.
                host.emit(
                  "answer:submit",
                  {
                    code,
                    questionId: question.questionId,
                    optionId: wrongOption.id
                  },
                  (hostRes) => {
                    console.log("Host answer result:", hostRes);

                    if (hostRes?.error || !hostRes?.success) {
                      finish(1);
                    }
                  }
                );
              }
            );
          });

          // Start the game.
          host.emit("room:start", { code }, (startRes) => {
            if (startRes?.error || !startRes?.success) {
              console.log("Start failed:", startRes);
              finish(1);
              return;
            }

            console.log("Game started successfully!");
          });
        }
      );
    });

    player2.connect();
  });
});
