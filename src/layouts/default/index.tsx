import { Outlet } from "react-router";
import styles from "./styles.module.scss";
import Nav from "../../components/nav";
import { Lang } from "../../components/lang";

export const DefaultLayout = () => {
  return (
    <div>
      <div>
        <div className={styles.header}>
          <Nav vertical={false} />
          <Lang className={styles.languageDropdown} />
        </div>
        <Outlet />
      </div>
    </div>
  );
};
