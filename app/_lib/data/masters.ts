export type Direction = "banya" | "relax" | "training";

export type Master = {
  name: string;
  role: string;
  directions: Direction[];
  tagsDisplay: string;
  bio: string;
};

export const MASTERS: Master[] = [
  {
    name: "Дмитрий",
    role: "Мастер",
    directions: ["banya", "relax", "training"],
    tagsDisplay: "Баня · Релаксология · Кунгфу",
    bio: "[placeholder · 2–3 фразы о Дмитрии: что ведёт, как работает, какая интонация.]",
  },
  {
    name: "Александр",
    role: "Мастер",
    directions: ["banya", "relax"],
    tagsDisplay: "Баня · Релаксология",
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
  },
  {
    name: "Вадим",
    role: "Мастер",
    directions: ["banya", "relax", "training"],
    tagsDisplay: "Баня · Релаксология · Кунгфу",
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
  },
  {
    name: "Анна",
    role: "Мастер",
    directions: ["relax"],
    tagsDisplay: "Релаксология",
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
  },
];
