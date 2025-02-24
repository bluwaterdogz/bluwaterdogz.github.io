import styles from "./styles.module.scss";
export const Home = () => {
  return (
    <div>
      <section className="bg-white dark:bg-gray-900">
        <div
          style={{
            backgroundImage: "url(./dog.jpg)",
          }}
          className={styles.hero}
        >
          <div className={styles.content}>
            <h1>Brian Velasquez</h1>
          </div>
        </div>
      </section>
      <section className={styles.textSection}>
        <div className={styles.content}>
          <h2>Section 2</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A nisi
            repellendus qui error iste. Possimus voluptatem iste quibusdam nulla
            animi blanditiis deleniti unde fuga, odio fugit modi. Natus, sint
            nesciunt. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Ad sed at quis eveniet aliquid dicta dignissimos impedit saepe,
            magnam ut praesentium rem quas corporis, atque modi. Facere non enim
            veritatis. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Eum nostrum iusto provident doloribus placeat impedit veniam
            cupiditate necessitatibus atque modi, aliquam praesentium dolorum
            sapiente obcaecati ea officiis. Earum, autem nisi.
          </p>
        </div>
      </section>
      <section className={styles.imageSection}>
        <div
          style={{
            backgroundImage: "url(./dog.jpg)",
          }}
          className={styles.hero}
        >
          <div className={styles.content}>
            <h1>Brian Velasquez</h1>
          </div>
        </div>
      </section>
      <section className={`${styles.textSection} ${styles.right}`}>
        <div className={styles.content}>
          <h2>Section 2</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A nisi
            repellendus qui error iste. Possimus voluptatem iste quibusdam nulla
            animi blanditiis deleniti unde fuga, odio fugit modi. Natus, sint
            nesciunt. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Ad sed at quis eveniet aliquid dicta dignissimos impedit saepe,
            magnam ut praesentium rem quas corporis, atque modi. Facere non enim
            veritatis. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Eum nostrum iusto provident doloribus placeat impedit veniam
            cupiditate necessitatibus atque modi, aliquam praesentium dolorum
            sapiente obcaecati ea officiis. Earum, autem nisi.
          </p>
        </div>
      </section>
    </div>
  );
};
