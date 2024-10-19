const express = require("express");
const { Telegraf } = require("telegraf");
const { admin, doc, updateDoc } = require("./module/firebaseConfig");

const telegramConfig = require("./module/telegramConfig");

const app = express();
const bot = new Telegraf(telegramConfig.TELEGRAM_BOT_TOKEN);

app.use(express.json());
app.use(bot.webhookCallback("/api/bot"));

// Встановлюємо правильний URL вебхука
const webhookURL = `https://your-koyeb-app-name.koyeb.app/api/bot`; // Замініть на ваш фактичний URL
bot.telegram.setWebhook(webhookURL);

function convertTimestampToReadable(timestamp) {
  const seconds = timestamp._seconds;
  const nanoseconds = timestamp._nanoseconds;

  const date = new Date(seconds * 1000 + nanoseconds / 1000000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const secondsFormatted = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${secondsFormatted}`;
}

const sendNotification = (message) => {
  bot.telegram.sendMessage(telegramConfig.TELEGRAM_ID, message);
};

// Отримання даних у реальному часі з Firebase
function databaseSubscription() {
  const db = admin.firestore();
  const feedbackRef = db.collection("feedbacks");

  feedbackRef
    .orderBy("timestamp", "desc")
    .limit(1)
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const newData = change.doc.data();
          const readableTimestamp = convertTimestampToReadable(
            newData.timestamp
          );
          console.log(newData);
          const message = `
            Добавлена новая запись 😊:
    
            📱 Номер телефона :
            
            ${newData.phone},
    
            🧑  Имя: ${newData.firstName},
    
             📅 Дата: ${readableTimestamp},
    
            -------------------------------------------
          `;
          sendNotification(message);
        }
      });
    });
}

databaseSubscription();

bot.command("status", (ctx) => {
  ctx.reply("Выберите статус для получения заявок:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Новый контакт", callback_data: "Новый контакт" }],
        [{ text: "В процессе", callback_data: "В процессе" }],
        [{ text: "Выполнено", callback_data: "Выполнено" }],
      ],
    },
  });
});

bot.action(async (ctx) => {
  const status = ctx.callbackQuery.data;

  const db = admin.firestore();
  const feedbackRef = db.collection("feedbacks");

  feedbackRef
    .where("status", "==", status)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        ctx.reply(`Заявок со статусом "${status}" не найдено.`);
        return;
      }

      querySnapshot.forEach((doc) => {
        const feedback = doc.data();
        const readableTimestamp = convertTimestampToReadable(
          feedback.timestamp
        );

        const message = `
          Заявка со статусом ${status}:
          📱 Номер телефона: ${feedback.phone},
          🧑 Имя: ${feedback.firstName},
          📅 Дата: ${readableTimestamp},
          -------------------------------------------
        `;

        ctx.reply(message, {
          reply_markup: {
            inline_keyboard: [[{ text: "ВЫПОЛНИТЬ", callback_data: doc.id }]],
          },
        });
      });
    })
    .catch((error) => {
      console.error("Ошибка при получении заявок:", error);
      ctx.reply("Произошла ошибка при получении заявок.");
    });
});

// Обробник помилок
bot.catch((err, ctx) => {
  console.error(`Ooops, ошибка: ${err}`, ctx);
});

// Запуск сервера Express.js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер Express.js запущен на порту ${PORT}`);
});
