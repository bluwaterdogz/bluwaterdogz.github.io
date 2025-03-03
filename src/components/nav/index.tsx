import { Link } from "react-router";
import styles from "./styles.module.scss";
interface NavProps {
  vertical: boolean;
  dark?: boolean;
}
const Nav = ({ vertical, dark = false }: NavProps) => {
  return (
    <div
      className={`${styles.nav} ${dark ? styles.dark : styles.light} ${
        vertical ? styles.vertical : ""
      }`}
    >
      <Link to={"/home"}>Home</Link>
      <Link to={"/skills"}>Skills</Link>
      <Link to={"/projects"}>Projects</Link>
      <Link to={"/about"}>About</Link>
    </div>
  );
};

export default Nav;
