import { Link, NavLink, useSearchParams } from "react-router-dom";
import styles from "./styles.module.css";
import { Kinopoisk } from '../../../public/Kinopoisk';

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Получаем текущие значения фильтров из URL
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const rating = searchParams.get("rating") || "";

  const handleFilterChange = (type: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(type, value);
    } else {
      newParams.delete(type);
    }
    setSearchParams(newParams);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link to="/" className={styles.logo}>
          <Kinopoisk className={styles.logoIcon} />
          <span>КИНОПОИСК</span>
        </Link>
      </div>

      <div className={styles.navLinks}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Главная
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Мое кино
        </NavLink>
      </div>

      <div className={styles.filterSection}>
        <select
          className={styles.filterSelect}
          value={genre}
          onChange={(e) => handleFilterChange("genre", e.target.value)}
        >
          <option value="">Все жанры</option>
          <option value="драма">Драма</option>
          <option value="комедия">Комедия</option>
          <option value="боевик">Боевик</option>
          <option value="фантастика">Фантастика</option>
        </select>

        <select
          className={styles.filterSelect}
          value={year}
          onChange={(e) => handleFilterChange("year", e.target.value)}
        >
          <option value="">Все годы</option>
          <option value="2020">2020-2023</option>
          <option value="2010">2010-2019</option>
          <option value="2000">2000-2009</option>
          <option value="1990">1990-1999</option>
        </select>

        <select
          className={styles.filterSelect}
          value={rating}
          onChange={(e) => handleFilterChange("rating", e.target.value)}
        >
          <option value="">Рейтинг</option>
          <option value="9">9+</option>
          <option value="8">8+</option>
          <option value="7">7+</option>
          <option value="6">6+</option>
        </select>

        <button
          className={styles.resetButton}
          onClick={() => setSearchParams({})}
        >
          Сбросить
        </button>
      </div>
    </nav>
  );
}
