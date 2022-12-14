## Установка

- `npm run dev` — Запуск версии для разработчика,
- `npm run lint` — Запуск проверки оформления стиля кода,
- `npm run test` — Запуск проверки компонентов приложения,
- `npm run build` — Сборка статичных страниц с помощью Webpack,
- `npm run start` — Сборка статичных страниц и Запуск сервера для статичных страниц осуществляется в docker-контейнере на http://localhost:3000.

## Описание

Проект представляет собой один из многих мессенджеров. Использует express, handlebars, webpack для сборки.
Настроена проверка стиля кода eslint и stylelint.
Настроено тестирование основных компоненнтов Mocha/Chai.
Перед выполнением commit и push производится проверка стилей и проверка тестов

## Страницы проекта на Netlify
- [Авторизация](https://elaborate-paprenjak-e0ca12.netlify.app/) — Вход для существующих пользователей
- [Регистрация](https://elaborate-paprenjak-e0ca12.netlify.app/sign-up) — Регистрация новых пользователей
- [Список чатов](https://elaborate-paprenjak-e0ca12.netlify.app/messenger) — Отображается список чатов и в каждом из них список сообщений
- [404 Ошибка](https://elaborate-paprenjak-e0ca12.netlify.app/404) — Ошибка 404
- [5** Ошибка](https://elaborate-paprenjak-e0ca12.netlify.app/500) — Ошибка 5**
- Чтобы выйти из приложения, необходмио нажать на крестик &#8855; около Фото профиля