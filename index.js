const express = require("express");
const { Telegraf } = require("telegraf");
const { admin, doc, updateDoc } = require("./module/firebaseConfig");

const telegramConfig = require("./module/telegramConfig");

const app = express();
const bot = new Telegraf(telegramConfig.TELEGRAM_BOT_TOKEN);

const sendNotification = (message) => {
  bot.telegram.sendMessage(telegramConfig.TELEGRAM_ID, message);
};

// // Получение реального времени обновлений из Firebase
function databaseSubscription() {
  const db = admin.firestore();
  const feedbackRef = db.collection("feedback");

  feedbackRef
    .orderBy("timestamp", "desc")
    .limit(1)
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const newData = change.doc.data();
          const statusEmoji = newData.status === "в обробці" ? "🔴" : "🟢";
          const message = `
            Добавлена новая запись 😊:
    
            📱 Номер телефона :
            
            ${newData.phone},
    
            🧑  Имя:    ${newData.name},
    
             📅 Дата:  ${newData.date},
    
             ${statusEmoji} Статус: ${newData.status}
    
            -------------------------------------------
             `;

          sendNotification(message);
        }
      });
    });
}

databaseSubscription();

bot.start(async (ctx) => {
  await databaseSubscription();
  ctx.reply(
    `Привет! Добро пожаловать ${ctx.chat.first_name} ${ctx.chat.last_name}!`
  );
});

bot.action(async (ctx) => {
  const db = admin.firestore();

  const buttonId = ctx;

  const updateData = {
    status: "виконанно",
  };

  try {
    if (buttonId && typeof buttonId === "string" && buttonId.trim() !== "") {
      const docRef = db.collection("feedback").doc(buttonId);
      await docRef.update(updateData);
      console.log("Статус успешно обновлен");
    } else {
      console.error("Недопустимый идентификатор документа");
    }
  } catch (error) {
    console.error("Ошибка при обновлении документа:", error);
  }
});

bot.command("get", (ctx) => {
  const db = admin.firestore();
  const feedbackRef = db.collection("feedback");

  function getFeedbackInProcess() {
    return new Promise(async (resolve, reject) => {
      await feedbackRef
        .where("status", "==", "в обробці")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.id);
            const statusEmoji = doc.data().status === "в обробці" ? "🔴" : "🟢";

            const message = `

                Необработаные заявки  😊:

                📱 Номер телефона :
                              
                ${doc.data().phone},

                🧑  Имя:    ${doc.data().name},

                📅 Дата:  ${doc.data().date},

                ${statusEmoji} Статус: ${doc.data().status}

                 -------------------------------------------
                          `;

            ctx.reply(message, {
              reply_markup: {
                inline_keyboard: [
                  [{ text: "ВЫПОЛНИТЬ", callback_data: doc.id }],
                ],
              },
            });
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  getFeedbackInProcess();
});

// Обработчик ошибок
bot.catch((err, ctx) => {
  console.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

// Запуск телеграм-бота
bot
  .launch()
  .then(() => console.log("Бот запущен"))
  .catch((err) => console.error("Ошибка запуска бота:", err));

// Запуск сервера Express.js
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Сервер Express.js запущен на порту ${PORT}`);
});
