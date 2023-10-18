import React from "react";
import styles from "./NoAccess.module.css";

const NoAccess = () => {
  function goHome() {
    window.location = process.env.REACT_APP_FRONT || "https://subdominio.elcampitorefugio.org/";
  }
  setTimeout(goHome, process.env.REACT_APP_PORT || 3000);

  return (
    <div className={styles.div}>
      <h2 className={styles.text}>
        Usted no tiene los permisos para ingresar a este Apartado
      </h2>
    </div>
  );
};

export default NoAccess;
