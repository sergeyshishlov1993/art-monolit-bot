const express = require("express");
const { Telegraf } = require("telegraf");
const admin = require("firebase-admin");

const app = express();

// Инициализация приложения Firebase с использованием вашего ключа сервисного аккаунта
admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "art-monolit-8898c",
    private_key_id: "daba4003b775ff5f3f5b9c101df5d620095dd060",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCz+OHtKKZPrQiR\ncDeIAa4D6k6mlLM7jKjh58UMk4wzsAkJyWZazfv+sKMUAkDh9jTniVLz9beGcDI2\nreJQAr8HBXeSS9mLVkz2VqnqDwbJoKlAsqY+cPWRGENDvPbTQR9sGvK5w27tzPE4\noJ/WcJ5gOyqnes0BZQ5T2rvqO9MhPZoEcZShoO1M/fCfmtW8Ca8UU1qPv6jKNabo\n8OuY+vjCgdzoydj9pYJndVVJbvfXOOOZO8ZdulBwW5ldOuhdYLhRcghwAqnczEGz\nvLuKb9z6SFd/tc9RSTK9lOA9VNA3L2kEw0cNCFpNUCVcDbRtHn4gCigBSc0svxfi\nSnjnapHZAgMBAAECgf9MtyqXDVzXWcrtNAh30T98K8Sa/YfpOmxC36j/U2XQIpm3\nskIPMv7X8jORs+Q0bd7fU4oos/UnOWwuIrD1qjYDqDDwC6UP4BmuaALF4uHh0LpU\n+dIji8MhtlX16fbM1lWun04YIVaHx3SLzuxTXG4mVxI3kgERNyKEXBj+H8I/yGk6\nRvnzuMyLW7ftMZQLeb2QAdSrc5U2uuxB30RJhaIjkf4InMrQoqaWjIge6o7lbhLu\nvz71DDZwhuSg19KONUCqNC6FxYDY8JximpkPWx1C6KbEkrDu9UZL+wZx4NOMQvAV\nymWgE9Ze0wi+ooGDsia5Svsk8R2aMtKvGdobCYECgYEA+0BZbyK4KE8+GpfiKl51\nnQ5WTVSwAacd2KRtHhYSQiwdwZXb6B7ycW3VYQOOnhiS9vmUs8uAGxuCeLV1s2hS\npKmgjQ8Qv8p73gorFZVZglykHU13oA11IcEhPWJS/mk636dKgkxj3b9oQ8E+TyIH\nncQzkuOTB3J6abkntLJ/fVkCgYEAt1+oPGrMB4TbqfZVP8XYmyvSfSCYARFZwfsZ\nTLKd1GntVEMkTkp9MLUf0dvYTnR8Wp5QJb07RqmelB8m+MmVawvqeWGkJQcCxzA/\n36KAZE+VxRJW6cBmMv2c0HujDYGBnouPrvTmQp1chah9SWDm+4Z9P+4YsRjVt4bb\nt7L6qIECgYB84z+RPnDLmJgGH/kLlmhf6QB879uM9sSfKxwSGGZ6/fLMhvEIMFnS\niAXIczww2YYzvVttA3pp/wKbfZdD1lc+AhMMCrEIpF1twSApWlNjuSjaZ+dOZ2IR\npS4glP8r9qKNCVq/6bi6QKpTA3s1WnTuttfr67LpwL2YT7Cs4Qz+AQKBgQCZudKS\n28ExqHpyULUE4nqFE0bBaTqk4oPJsBR0jOTtduPkGOltzNqIo78KMnByzQqW+VMd\nYDc6NOZhLICCXpQpinLF0UpHVEpK7DMP6u4RqfpXnNlJ2uaSZrQ4vv1hTCl63WrV\n9C64t60hy69Efb0GLagAmT0P8k7wLVky9hNWgQKBgQCo6LsxR+e5leiU4FguYrZQ\nvAeRR6E8Aaydn3HdFZiO8napW8VpGX5OXroRfqDGg3B8GZ/pDgF+qjgtm85d5jEj\nMSWBLR2v7KyMytBYpkfsgKpwRFr60uSYKjEq+pOXUiN19Vd3nK/s0kV0QYvuURew\naQeTDsDzD0Nu+Jk+ebU/Jg==\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-w0154@art-monolit-8898c.iam.gserviceaccount.com",
    client_id: "105779064019433941272",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-w0154%40art-monolit-8898c.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  }),
  databaseURL: "https://art-monolit-8898c.firebaseio.com", // Замените на URL вашей базы данных Firebase
});

const TELEGRAM_BOT_TOKEN = "7151615540:AAGh1Rxwj6fDSkygeCwbj4mJahiQ2ejjEj8";
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

const sendNotification = (message) => {
  bot.telegram.sendMessage("215524805", message); // Замените на ваш Telegram ID
};

// Получение реального времени обновлений из Firebase
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

        📱 Номер телефона : ${newData.phone},

        🧑  Имя:    ${newData.name},

         📅 Дата:  ${newData.date},

         ${statusEmoji} Статус: ${newData.status}

        -------------------------------------------
         `;

        sendNotification(message);
      }
    });
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
