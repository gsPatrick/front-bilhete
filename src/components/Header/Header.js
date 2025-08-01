import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <span className={styles.icon}>18+</span> JOGUE COM RESPONSABILIDADE
      </div>
    </header>
  );
};
export default Header;