import { Link } from "react-router";
import styles from "./styles.module.scss";

const Nav = () => {
  return (
    <div className={styles.nav}>
      <Link to={"/skills"}>Skills</Link>
      <Link to={"/"}>None</Link>
      <Link to={"/"}>None</Link>
      <Link to={"/"}>None</Link>
    </div>
  );
};

export default Nav;
