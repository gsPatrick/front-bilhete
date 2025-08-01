import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>© {new Date().getFullYear()} - Todos os direitos reservados.</p>
        <p>Este site não possui vínculo com o Facebook ou qualquer uma de suas entidades. Os resultados podem variar e não são garantidos.</p>
      </div>
    </footer>
  );
};
export default Footer;