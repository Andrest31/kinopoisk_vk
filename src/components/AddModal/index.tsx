import type { MouseEvent } from 'react';
import styles from './styles.module.css';

interface ModalProps {
  movieTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AddToFavoritesModal({ 
  movieTitle, 
  onConfirm, 
  onCancel 
}: ModalProps) {
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <h3>Добавить в избранное?</h3>
        <p>Вы действительно хотите добавить фильм "{movieTitle}" в избранное?</p>
        <div className={styles.buttons}>
          <button 
            className={styles.confirmButton}
            onClick={onConfirm}
          >
            Добавить
          </button>
          <button 
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}