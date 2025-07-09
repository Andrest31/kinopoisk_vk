// src/data/movies.ts

export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster: string;
  genres: string[];
  description: string;
}

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Побег из Шоушенка",
    year: 1994,
    rating: 9.1,
    poster: "https://via.placeholder.com/150x225?text=Movie+1",
    genres: ["Драма"],
    description: "История о надежде и выживании в тюрьме.",
  },
  {
    id: 2,
    title: "Крестный отец",
    year: 1972,
    rating: 9.0,
    poster: "https://via.placeholder.com/150x225?text=Movie+2",
    genres: ["Криминал", "Драма"],
    description: "Эпическая сага о семье Корлеоне.",
  },
  {
    id: 3,
    title: "Темный рыцарь",
    year: 2008,
    rating: 8.9,
    poster: "https://via.placeholder.com/150x225?text=Movie+3",
    genres: ["Боевик", "Криминал", "Драма"],
    description: "Бэтмен противостоит Джокеру.",
  },
  {
    id: 4,
    title: "1+1",
    year: 2011,
    rating: 8.8,
    poster: "https://via.placeholder.com/150x225?text=Movie+4",
    genres: ["Биография", "Драма", "Комедия"],
    description: "Невероятная дружба между парализованным аристократом и его помощником.",
  },
  {
    id: 5,
    title: "Властелин колец: Возвращение короля",
    year: 2003,
    rating: 8.9,
    poster: "https://via.placeholder.com/150x225?text=Movie+5",
    genres: ["Приключения", "Фэнтези", "Драма"],
    description: "Заключительная часть трилогии о Фродо Бэггинсе.",
  },
  {
    id: 6,
    title: "Криминальное чтиво",
    year: 1994,
    rating: 8.9,
    poster: "https://via.placeholder.com/150x225?text=Movie+6",
    genres: ["Криминал", "Драма"],
    description: "Несколько историй, переплетающихся в мире преступности Лос-Анджелеса.",
  },
  {
    id: 7,
    title: "Форрест Гамп",
    year: 1994,
    rating: 8.9,
    poster: "https://via.placeholder.com/150x225?text=Movie+7",
    genres: ["Драма", "Комедия", "Мелодрама"],
    description: "История жизни человека с низким IQ, который повлиял на многие исторические события.",
  },
  {
    id: 8,
    title: "Хороший, плохой, злой",
    year: 1966,
    rating: 8.8,
    poster: "https://via.placeholder.com/150x225?text=Movie+8",
    genres: ["Вестерн"],
    description: "Три человека ищут спрятанное золото во время гражданской войны.",
  },
  {
    id: 9,
    title: "Бойцовский клуб",
    year: 1999,
    rating: 8.8,
    poster: "https://via.placeholder.com/150x225?text=Movie+9",
    genres: ["Драма"],
    description: "История о бессоннице и тайном бойцовском клубе.",
  },
  {
    id: 10,
    title: "Начало",
    year: 2010,
    rating: 8.7,
    poster: "https://via.placeholder.com/150x225?text=Movie+10",
    genres: ["Боевик", "Драма", "Научная фантастика"],
    description: "Проникновение в сны для кражи идей.",
  },
  {
    id: 11,
    title: "Матрица",
    year: 1999,
    rating: 8.7,
    poster: "https://via.placeholder.com/150x225?text=Movie+11",
    genres: ["Боевик", "Научная фантастика"],
    description: "Программист узнает, что мир — это симуляция.",
  },
  {
    id: 12,
    title: "Леон",
    year: 1994,
    rating: 8.7,
    poster: "https://via.placeholder.com/150x225?text=Movie+12",
    genres: ["Криминал", "Драма", "Триллер"],
    description: "Профессиональный киллер берет под опеку девочку.",
  },
  {
    id: 13,
    title: "Интерстеллар",
    year: 2014,
    rating: 8.6,
    poster: "https://via.placeholder.com/150x225?text=Movie+13",
    genres: ["Приключения", "Драма", "Научная фантастика"],
    description: "Команда исследователей отправляется в космос, чтобы спасти человечество.",
  },
  {
    id: 14,
    title: "Город Бога",
    year: 2002,
    rating: 8.6,
    poster: "https://via.placeholder.com/150x225?text=Movie+14",
    genres: ["Криминал", "Драма"],
    description: "Два парня из бразильских фавел идут разными путями.",
  },
  {
    id: 15,
    title: "Семь",
    year: 1995,
    rating: 8.6,
    poster: "https://via.placeholder.com/150x225?text=Movie+15",
    genres: ["Криминал", "Драма", "Триллер"],
    description: "Два детектива расследуют серию убийств, связанных с семью смертными грехами.",
  },
];