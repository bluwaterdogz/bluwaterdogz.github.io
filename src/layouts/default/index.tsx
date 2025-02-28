import { Outlet } from "react-router";
import styles from "./styles.module.scss";
import Nav from "../../components/nav";
export const DefaultLayout = () => (
  <div>
    <div className={styles.header}>
      <Nav vertical={false} />
    </div>
    <Outlet />
  </div>
);
