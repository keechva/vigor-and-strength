import type { Direction } from "./masters";

export type LocationType = "own" | "partner";
export type LocationStatus = "active" | "development";

export type Location = {
  slug: string;
  name: string;
  type: LocationType;
  status: LocationStatus;
  shortDescription: string;
  fullDescription: string;
  address: string;
  district?: string;
  capacity?: string;
  priceHint?: string;
  workingHours?: string;
  directions: Direction[];
  masters: string[];
  amenities: string[];
};

export const LOCATIONS: Location[] = [
  {
    slug: "samoletnaya-59",
    name: "Самолётная 59",
    type: "own",
    status: "development",
    address: "ул. Самолётная, 59 [уточнить — placeholder]",
    shortDescription: "Своя локация в разработке. Откроемся скоро.",
    fullDescription:
      "Готовим к открытию пространство, в котором будут жить все наши направления. Дровяная парная, комната отдыха с большим столом, отдельная зона для работы с телом и тренировочный зал. Анонсируем дату открытия, когда всё будет готово.",
    directions: ["banya", "relax", "training"],
    masters: [],
    amenities: [],
  },
  {
    slug: "lukomorie",
    name: "Усадьба Лукоморье",
    type: "partner",
    status: "active",
    address: "ул. Базовая, 23к1",
    district: "Дзержинский район",
    capacity: "до 10 человек",
    priceHint: "аренда от 1500 ₽/час",
    workingHours: "круглосуточно",
    shortDescription:
      "Двухэтажная баня на дровах с купелью и бассейном на большой огороженной территории.",
    fullDescription:
      "Партнёрская локация, в которой мы регулярно работаем. Двухэтажный дом 130 м², дровяная парная, гриль-домик, тёплый бассейн с гидромассажем и водопадом, инфракрасная сауна на втором этаже. На улице — родниковая купель (4°) и молодильный чан на огне. Огороженная территория, парковка под видеонаблюдением. Запись возможна напрямую к нашему пар-мастеру через нас.",
    directions: ["banya"],
    masters: ["Дмитрий", "Александр", "Вадим", "Никита"],
    amenities: [
      "Дровяная парная",
      "Тёплый бассейн с гидромассажем",
      "Родниковая купель",
      "Молодильный чан на огне",
      "Инфракрасная сауна",
      "Гриль-домик с мангалом",
      "Комната отдыха",
      "Караоке",
      "Чай",
    ],
  },
  {
    slug: "kitusya",
    name: "Китуся",
    type: "partner",
    status: "active",
    address: "ул. Ваана-Теряна, 38",
    capacity: "до 6 человек",
    priceHint: "аренда от 600 ₽/час",
    workingHours: "круглосуточно",
    shortDescription:
      "Камерная баня и площадка для работы с телом. Подходит для пары и небольшой компании.",
    fullDescription:
      "Партнёрское пространство для небольших групп. Парная и зона для работы с телом после пара. Бассейн, чайная, комната отдыха. Удобно для тех, кто хочет совместить баню и работу с телом за один визит, без большой компании.",
    directions: ["banya", "relax"],
    masters: ["Дмитрий", "Александр", "Мария"],
    amenities: [
      "Парная",
      "Бассейн",
      "Чайная комната",
      "Комната отдыха",
      "Зона для работы с телом",
    ],
  },
  {
    slug: "oazis-otdyha",
    name: "Оазис отдыха",
    type: "partner",
    status: "active",
    address: "ул. Полевая (имени Куйбышева), 23/1",
    capacity: "большая компания",
    priceHint: "аренда коттеджа от 30 000 ₽ / сутки, в будни скидка 10%",
    shortDescription:
      "Загородный клуб с баней на дровах. Для большой компании, дня рождения, корпоратива или сборов на сутки.",
    fullDescription:
      "Партнёрский загородный клуб с баней на дровах. Формат — аренда коттеджа на сутки, для большой компании. Здесь работаем по программе «Компанией»: парение, веник, программы под группу. Подходит для дней рождения, мальчишников, корпоративов, выпускных и сборов после походов.",
    directions: ["banya"],
    masters: ["Дмитрий", "Вадим"],
    amenities: [
      "Баня на дровах",
      "Коттедж с проживанием на сутки",
      "Большая территория",
      "Зона для компаний",
      "Мангал",
    ],
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}

export function getLocationsByDirection(dir: Direction): Location[] {
  return LOCATIONS.filter((l) => l.directions.includes(dir));
}

export function getLocationsByMaster(masterName: string): Location[] {
  return LOCATIONS.filter((l) => l.masters.includes(masterName));
}
