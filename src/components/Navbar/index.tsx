import { Link, NavLink, useSearchParams } from "react-router-dom";
import styles from "./styles.module.css";
import { Kinopoisk } from '../../../public/Kinopoisk';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState({ min: '', max: '' });
  const [yearRange, setYearRange] = useState({ start: '', end: '' });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Инициализация фильтров из URL при загрузке
  useEffect(() => {
    // Жанры
    const genreParams = searchParams.getAll('genre');
    if (genreParams.length > 0) {
      setSelectedGenres(genreParams);
    }

    // Рейтинг
    const ratingParam = searchParams.get('rating');
    if (ratingParam?.includes('-')) {
      const [min, max] = ratingParam.split('-');
      setRatingRange({ min, max });
    }

    // Годы
    const yearParam = searchParams.get('years');
    if (yearParam?.includes('-')) {
      const [start, end] = yearParam.split('-');
      setYearRange({ start, end });
    }
  }, []);

  // Закрытие dropdown при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Список всех жанров
  const allGenres = [
    "драма", "комедия", "боевик", "фантастика", "триллер",
    "ужасы", "мелодрама", "детектив", "приключения", "фэнтези",
    "мультфильм", "семейный", "биография", "история", "военный",
    "спорт", "документальный", "криминал", "вестерн", "музыка"
  ].sort();

  // Обработчик выбора жанра
  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
  };

  // Обработчик применения фильтров
  const applyFilters = () => {
    const newParams = new URLSearchParams();

    // Добавляем жанры
    selectedGenres.forEach(genre => {
      newParams.append('genre', genre);
    });

    // Добавляем рейтинг, если указан хотя бы один параметр
    if (ratingRange.min || ratingRange.max) {
      const min = ratingRange.min || '0';
      const max = ratingRange.max || '10';
      newParams.set('rating', `${min}-${max}`);
    }

    // Добавляем годы, если указан хотя бы один параметр
    if (yearRange.start || yearRange.end) {
      const start = yearRange.start || '1990';
      const end = yearRange.end || new Date().getFullYear().toString();
      newParams.set('years', `${start}-${end}`);
    }

    setSearchParams(newParams);
    setActiveFilter(null);
  };

  // Сброс всех фильтров
  const resetFilters = () => {
    setSearchParams({});
    setSelectedGenres([]);
    setRatingRange({ min: '', max: '' });
    setYearRange({ start: '', end: '' });
  };

  // Получаем текст для кнопок фильтров
  const getFilterButtonText = (type: string) => {
    switch (type) {
      case 'genre':
        return selectedGenres.length > 0 
          ? `Жанры (${selectedGenres.length})` 
          : 'Все жанры';
      case 'rating':
        return ratingRange.min || ratingRange.max
          ? `Рейтинг ${ratingRange.min || '0'}-${ratingRange.max || '10'}`
          : 'Рейтинг';
      case 'year':
        return yearRange.start || yearRange.end
          ? `Годы ${yearRange.start || '1990'}-${yearRange.end || new Date().getFullYear()}`
          : 'Все годы';
      default:
        return '';
    }
  };

  return (
    <nav className={styles.navbar} ref={dropdownRef}>
      <div className={styles.navbarContent}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}>
            <Kinopoisk className={styles.logoIcon} />
            <span>КИНОПОИСК</span>
          </Link>
        </div>

        <div className={styles.navLinks}>
          <NavLink to="/" className={({ isActive }) => 
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }>
            Главная
          </NavLink>

          <NavLink to="/favorites" className={({ isActive }) => 
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }>
            Мое кино
          </NavLink>
        </div>

        <div className={styles.filterSection}>
          {/* Фильтр по жанрам */}
          <div className={styles.filterDropdown}>
            <button 
              className={styles.filterButton}
              onClick={() => setActiveFilter(activeFilter === 'genre' ? null : 'genre')}
            >
              {getFilterButtonText('genre')}
            </button>
            {activeFilter === 'genre' && (
              <div className={styles.dropdownContent}>
                <div className={styles.genreList}>
                  {allGenres.map(genre => (
                    <label key={genre} className={styles.genreItem}>
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => handleGenreToggle(genre)}
                      />
                      <span>{genre}</span>
                    </label>
                  ))}
                </div>
                <button 
                  className={styles.applyButton}
                  onClick={applyFilters}
                >
                  Применить
                </button>
              </div>
            )}
          </div>

          {/* Фильтр по рейтингу */}
          <div className={styles.filterDropdown}>
            <button 
              className={styles.filterButton}
              onClick={() => setActiveFilter(activeFilter === 'rating' ? null : 'rating')}
            >
              {getFilterButtonText('rating')}
            </button>
            {activeFilter === 'rating' && (
              <div className={styles.dropdownContent}>
                <div className={styles.rangeInputs}>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="От"
                    value={ratingRange.min}
                    onChange={(e) => setRatingRange({...ratingRange, min: e.target.value})}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="До"
                    value={ratingRange.max}
                    onChange={(e) => setRatingRange({...ratingRange, max: e.target.value})}
                  />
                </div>
                <button 
                  className={styles.applyButton}
                  onClick={applyFilters}
                >
                  Применить
                </button>
              </div>
            )}
          </div>

          {/* Фильтр по годам */}
          <div className={styles.filterDropdown}>
            <button 
              className={styles.filterButton}
              onClick={() => setActiveFilter(activeFilter === 'year' ? null : 'year')}
            >
              {getFilterButtonText('year')}
            </button>
            {activeFilter === 'year' && (
              <div className={styles.dropdownContent}>
                <div className={styles.rangeInputs}>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    placeholder="От"
                    value={yearRange.start}
                    onChange={(e) => setYearRange({...yearRange, start: e.target.value})}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    placeholder="До"
                    value={yearRange.end}
                    onChange={(e) => setYearRange({...yearRange, end: e.target.value})}
                  />
                </div>
                <button 
                  className={styles.applyButton}
                  onClick={applyFilters}
                >
                  Применить
                </button>
              </div>
            )}
          </div>

          <button 
            className={styles.resetButton}
            onClick={resetFilters}
          >
            Сбросить
          </button>
        </div>
      </div>
    </nav>
  );
}