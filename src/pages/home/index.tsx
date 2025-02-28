import { useCallback, useEffect } from "react";
import { useServiceContext } from "../../service";
import styles from "./styles.module.scss";
import Nav from "../../components/nav";
export const HomePage = () => {
  const { jobService } = useServiceContext();

  const getData = useCallback(async () => {
    const data = await jobService.list();
  }, [jobService]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      <Nav vertical={true} />
      <section>
        <div
          style={{
            backgroundImage: "url(./dog.jpg)",
          }}
          className={styles.hero}
        >
          <div className={styles.content}>
            <h1>Brian Velasquez</h1>
            <p className={styles.headerSubtext}>Full Stack Web Developer</p>
          </div>
        </div>
      </section>
      <section className={styles.textSection}>
        <div className={styles.content}>
          <h2>Expreienced</h2>
          <p>
            In my most recent role as a Senior Full Stack Developer at
            pharmaceutical tech startup Faro Health I worked on REST and CQRS
            based microservices and UI modules implemented in Typescript, Node,
            PostgreSQL, Jest and React. My work involved developing feature
            slices and POCs, creating and executing technical designs, writing
            Unit and Integration Tests, optimizing application performance, and
            building deployment pipelines using Github Actions.
          </p>
          <hr />
          <p>
            Prior to this, I led an international remote Front End team at
            Various Inc. where we worked hand in hand with the design team to
            reskin and migrate legacy Javascript and Perl based video streaming
            apps to a modern UI built in React, TypeScript and Python. A more
            scalable codebase utilizing Next.js, MOBX and WebSockets and backed
            by REST APIs and a CI/CD development pipeline to streamline
            deployment.
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
          <h2>Leadership</h2>
          <p>
            Having led a large international team of developers and engineers in
            the US, Europe, Taiwan and China I'm positive that my expertise in
            technologies like Typescript, Node, PostgreSQL, Jest and React will
            help to push your organization forward. In addition to my technical
            design and development skills, my leadership abilities will help to
            align and focus team efforts towards specific milestones, and
            company defined goals.
          </p>
        </div>
      </section>
    </div>
  );
};
