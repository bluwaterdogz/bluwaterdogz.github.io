import { useMemo } from "react";
import styles from "./styles.module.scss";

export const Footer = () => {
  const year = useMemo(() => {
    return new Date().getFullYear();
  }, []);
  return (
    <section className={styles.footer}>
      <div className={styles.linkList}>
        <div className={styles.footerLink}>
          <a href="https://github.com/bluwaterdogz" target={"_blank"}>
            <i className="devicon-github-original"></i> Github
          </a>
        </div>
        <div className={styles.footerLink}>
          <a
            href="https://linkedin.com/in/brian-velasquez-developer"
            target={"_blank"}
          >
            <i className="devicon-linkedin-plain"></i> LinkedIn
          </a>
        </div>
        <div className={styles.footerLink}>
          <a href="mailto:bveedy@gmail.com">
            <i className="fa fa-envelope"></i> Email
          </a>
        </div>
        {/* <div>
          <a href="">Link3</a>
        </div> */}
      </div>
      <div className={styles.content}></div>
      <div className={styles.trademark}>© {year}</div>
    </section>
  );
};
