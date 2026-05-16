export type Direction = "banya" | "relax" | "trainings";

export const DIRECTION_LABELS: Record<Direction, string> = {
  banya: "Баня",
  relax: "Релаксология",
  trainings: "Тренировки",
};

export type DirectionDetail = {
  description: string;
  specializations: string[];
};

export type MasterGalleryItem = {
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
};

export type Master = {
  slug: string;
  name: string;
  role: string;
  directions: Direction[];
  bio: string;
  tagline: string;
  bioFull: string;
  directionDetails: {
    banya?: DirectionDetail;
    relax?: DirectionDetail;
    trainings?: DirectionDetail;
  };
  formatsDetails: {
    travel?: boolean;
    travelNote?: string;
    ownLocation?: string;
    partnerLocations?: string[];
  };
  gallery?: MasterGalleryItem[];
};

const PLACEHOLDER_DIRECTION: DirectionDetail = {
  description:
    "[Placeholder — описание подхода мастера в этом направлении, 2-3 предложения. Заменим после интервью.]",
  specializations: [
    "[Специализация — placeholder]",
    "[Специализация — placeholder]",
    "[Специализация — placeholder]",
  ],
};

const PLACEHOLDER_BIO_FULL =
  "[Placeholder — полное описание мастера от первого лица, 5-10 предложений. Расскажет о пути в практике, о подходе, о том как пришёл к каждому из направлений в которых работает. Текст заменим после интервью с мастером. Сохраняем ровно тот же объём, чтобы вёрстка ложилась одинаково для всех. Спокойная интонация, без обещаний, без маркетинговых формулировок. Тон проекта.]";

const PLACEHOLDER_TAGLINE =
  "[Placeholder — короткая визитка из 1-2 предложений в тоне проекта.]";

const PLACEHOLDER_TRAVEL_NOTE =
  "[Placeholder — особенности выезда: район, набор оборудования, ограничения.]";

export const MASTERS: Master[] = [
  {
    slug: "dmitry",
    name: "Дмитрий",
    role: "Ведущий мастер",
    directions: ["banya", "relax", "trainings"],
    bio: "[placeholder · 2–3 фразы о Дмитрии: что ведёт, как работает, какая интонация.]",
    tagline:
      "Веду все три направления. Парю в банях по Оренбургу, делаю работу с телом после пара, преподаю кунгфу. Основа практики в проекте.",
    bioFull:
      "Дмитрий — основатель проекта «Бодрость и Сила» и ведущий мастер по всем трём направлениям. Работает с телом и движением уже не первый десяток лет. Сначала пришёл в баню — учился у разных пар-мастеров, постепенно сформировал свой подход к парению. Параллельно работал с телом руками — то что сейчас называем релаксологией. К кунгфу пришёл позже, как к практике, объединяющей всё остальное: тело, дыхание, внимание. Сейчас обучает остальных мастеров команды, ведёт первый набор группы кунгфу, продолжает работать в бане и с телом. [плейсхолдер — заменим на реальную историю]",
    directionDetails: {
      banya: {
        description:
          "Парю медленно, по ощущениям. У каждого гостя своя глубина — нет смысла гнать. Работаю с тем что в теле сейчас, не по протоколу.",
        specializations: [
          "Полное парение",
          "Работа в четыре руки",
          "Программа «Не торопиться»",
          "Работа с группами до 15 человек",
        ],
      },
      relax: {
        description:
          "Работа с телом после пара — то, что у меня получается лучше всего. Тактильно, медленно, в тишине. От часа и больше.",
        specializations: [
          "Работа после пара",
          "Тактильное восстановление",
          "Сеанс от часа до двух",
          "Без таймера",
        ],
      },
      trainings: {
        description:
          "Кунгфу для меня — основа всей практики. Преподаю медленно, от стоек и дыхания. Первый набор группы — скоро.",
        specializations: [
          "Кунгфу индивидуально",
          "Группа (готовится)",
          "Базовые формы",
          "Работа со стойками и дыханием",
        ],
      },
    },
    formatsDetails: {
      travel: true,
      travelNote:
        "Выезжаю по Оренбургу и области со своим — веничный набор, масла, валики.",
      ownLocation: "samoletnaya-59",
      partnerLocations: ["lukomorie", "kitusya", "oazis-otdyha"],
    },
    gallery: [
      {
        type: "video",
        src: "/placeholder/dima-banya.mp4",
        alt: "Дмитрий в парной",
        caption: "В работе с веником",
      },
      {
        type: "image",
        src: "/placeholder/dima-relax.jpg",
        alt: "Дмитрий — работа с телом",
        caption: "Работа с телом после пара",
      },
      {
        type: "image",
        src: "/placeholder/dima-kungfu.jpg",
        alt: "Дмитрий на тренировке",
        caption: "Кунгфу",
      },
    ],
  },
  {
    slug: "aleksandr",
    name: "Александр",
    role: "Мастер",
    directions: ["banya", "relax"],
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
    tagline: PLACEHOLDER_TAGLINE,
    bioFull: PLACEHOLDER_BIO_FULL,
    directionDetails: {
      banya: PLACEHOLDER_DIRECTION,
      relax: PLACEHOLDER_DIRECTION,
    },
    formatsDetails: {
      travel: true,
      travelNote: PLACEHOLDER_TRAVEL_NOTE,
      partnerLocations: ["lukomorie", "kitusya"],
    },
    gallery: [
      {
        type: "image",
        src: "/placeholder/aleksandr-1.jpg",
        alt: "[Placeholder — фото Александра]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "image",
        src: "/placeholder/aleksandr-2.jpg",
        alt: "[Placeholder — фото Александра]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "video",
        src: "/placeholder/aleksandr-3.mp4",
        alt: "[Placeholder — видео Александра]",
        caption: "[Placeholder — подпись]",
      },
    ],
  },
  {
    slug: "vadim",
    name: "Вадим",
    role: "Мастер",
    directions: ["banya", "relax", "trainings"],
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
    tagline: PLACEHOLDER_TAGLINE,
    bioFull: PLACEHOLDER_BIO_FULL,
    directionDetails: {
      banya: PLACEHOLDER_DIRECTION,
      relax: PLACEHOLDER_DIRECTION,
      trainings: PLACEHOLDER_DIRECTION,
    },
    formatsDetails: {
      travel: true,
      travelNote: PLACEHOLDER_TRAVEL_NOTE,
      partnerLocations: ["lukomorie", "oazis-otdyha"],
    },
    gallery: [
      {
        type: "image",
        src: "/placeholder/vadim-1.jpg",
        alt: "[Placeholder — фото Вадима]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "video",
        src: "/placeholder/vadim-2.mp4",
        alt: "[Placeholder — видео Вадима]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "image",
        src: "/placeholder/vadim-3.jpg",
        alt: "[Placeholder — фото Вадима]",
        caption: "[Placeholder — подпись]",
      },
    ],
  },
  {
    slug: "nikita",
    name: "Никита",
    role: "Мастер",
    directions: ["banya", "relax"],
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
    tagline: PLACEHOLDER_TAGLINE,
    bioFull: PLACEHOLDER_BIO_FULL,
    directionDetails: {
      banya: PLACEHOLDER_DIRECTION,
      relax: PLACEHOLDER_DIRECTION,
    },
    formatsDetails: {
      travel: true,
      travelNote: PLACEHOLDER_TRAVEL_NOTE,
      partnerLocations: ["lukomorie"],
    },
    gallery: [
      {
        type: "image",
        src: "/placeholder/nikita-1.jpg",
        alt: "[Placeholder — фото Никиты]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "video",
        src: "/placeholder/nikita-2.mp4",
        alt: "[Placeholder — видео Никиты]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "image",
        src: "/placeholder/nikita-3.jpg",
        alt: "[Placeholder — фото Никиты]",
        caption: "[Placeholder — подпись]",
      },
    ],
  },
  {
    slug: "anna",
    name: "Анна",
    role: "Мастер",
    directions: ["relax"],
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
    tagline: PLACEHOLDER_TAGLINE,
    bioFull: PLACEHOLDER_BIO_FULL,
    directionDetails: {
      relax: PLACEHOLDER_DIRECTION,
    },
    formatsDetails: {
      travel: true,
      travelNote: PLACEHOLDER_TRAVEL_NOTE,
    },
    gallery: [
      {
        type: "image",
        src: "/placeholder/anna-1.jpg",
        alt: "[Placeholder — фото Анны]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "image",
        src: "/placeholder/anna-2.jpg",
        alt: "[Placeholder — фото Анны]",
        caption: "[Placeholder — подпись]",
      },
    ],
  },
  {
    slug: "mariya",
    name: "Мария",
    role: "Мастер",
    directions: ["banya", "relax"],
    bio: "[placeholder · короткая визитка, 2–3 фразы.]",
    tagline: PLACEHOLDER_TAGLINE,
    bioFull: PLACEHOLDER_BIO_FULL,
    directionDetails: {
      banya: PLACEHOLDER_DIRECTION,
      relax: PLACEHOLDER_DIRECTION,
    },
    formatsDetails: {
      travel: true,
      travelNote: PLACEHOLDER_TRAVEL_NOTE,
      partnerLocations: ["kitusya"],
    },
    gallery: [
      {
        type: "image",
        src: "/placeholder/mariya-1.jpg",
        alt: "[Placeholder — фото Марии]",
        caption: "[Placeholder — подпись]",
      },
      {
        type: "video",
        src: "/placeholder/mariya-2.mp4",
        alt: "[Placeholder — видео Марии]",
        caption: "[Placeholder — подпись]",
      },
    ],
  },
];

export function getMasterBySlug(slug: string): Master | undefined {
  return MASTERS.find((m) => m.slug === slug);
}
