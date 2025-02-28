import { Link } from "react-router";
import styles from "./styles.module.scss";
interface NavProps {
  vertical: boolean;
}
const Nav = ({ vertical }: NavProps) => {
  return (
    <div className={`${styles.nav} ${vertical ? styles.vertical : ""}`}>
      <Link to={"/home"}>Home</Link>
      <Link to={"/skills"}>Skills</Link>
      <Link to={"/projects"}>Projects</Link>
      <Link to={"/about"}>About</Link>
    </div>
  );
};

export default Nav;
