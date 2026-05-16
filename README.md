# Бодрость и Сила

Сайт проекта «Бодрость и Сила» — пространство трёх независимых направлений: баня, релаксология, тренировки. Домен: bodrost-sila.ru.

## Стек

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + кастомные стили в globals.css
- Шрифты: Lora (serif), Inter (sans), JetBrains Mono
- Хостинг: VPS (Selectel/Timeweb), Docker, Caddy с автоматическим SSL
- Деплой: GitHub Actions при push в main

## Структура

```
app/
├── _components/       # переиспользуемые компоненты по разделам
│   ├── banya/         # компоненты страницы бани
│   ├── relax/         # компоненты страницы релаксологии
│   ├── locations/     # компоненты страниц локаций (хаб + детальная)
│   ├── Masters.tsx    # компонент со списком мастеров (используется на нескольких страницах)
│   ├── Header.tsx     # sticky-header с навигацией
│   └── Footer.tsx
├── _lib/data/         # данные сайта в TypeScript
│   ├── masters.ts     # список мастеров
│   └── locations.ts   # список локаций (с картами и соцссылками)
├── banya/             # /banya
├── relax/             # /relax
├── locations/         # /locations
│   └── [slug]/        # /locations/[slug] — динамические страницы локаций
└── globals.css        # все стили (Tailwind base + кастомные классы)
```

## Запуск локально

Требования: Node.js 22+ (LTS), npm.

```bash
npm install
npm run dev
```

Сервер поднимется на http://localhost:3000

## Команды

- `npm run dev` — dev-сервер с hot reload
- `npm run build` — production-сборка
- `npm run start` — запуск production-сборки
- `npm run lint` — линтер

## Документация

- `docs/concept.md` — концепция проекта (что делаем и для кого)
- `docs/site-structure.md` — структура сайта и страниц
- `docs/content-draft.md` — тексты, тона, ТЗ на видео-материалы
- `CLAUDE.md` — инструкции для Claude Code (если работаешь с ним в этом репозитории)

## Issues

Все открытые задачи живут в GitHub Issues этого репозитория.

## Что в работе

- [x] Главная (/)
- [x] Баня (/banya) с конфигуратором
- [x] Релаксология (/relax)
- [x] Локации (/locations + /locations/[slug])
- [x] Тренировки (/trainings)
- [ ] Хаб мастеров (/masters)
- [ ] Бэкенд формы заявки
- [ ] Замена placeholder-данных на реальные
- [ ] Деплой на боевой домен
