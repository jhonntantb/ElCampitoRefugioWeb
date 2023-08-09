import React from 'react';
import BarraDeNavegacion from '../BarraDeNavegacion/BarraDeNavegacion';
import Form from '../../Forms/Contacto/Contacto';
import Footer from '../Footer/Footer';
import styles from './Contactanos.module.css';

const Contactanos = () => {
  return (
    <div className={styles.mainContactanos}>
      <BarraDeNavegacion />
      <h2 className={styles.h2Contactanos}>CONTACTANOS</h2>
      <section className={styles.mainContainer}>
        <Form />
      </section>
      <section className={styles.sectionContactanos}>
        <p className={styles.pContactanos}>
          <span className={styles.spanContactanos}></span>
        </p>
        <button className={styles.buttonContactanos}>
          Tambien puedes contactarnos por nuestras redes sociales ⬇
        </button>
      </section>
      <Footer />
    </div>
  );
};

export default Contactanos;
