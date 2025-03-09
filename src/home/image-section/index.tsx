import styles from "./styles.module.scss";
import HomeNav from "../../components/nav/home-nav";

interface ImageSectionProps {
  imgUrl: string;
}
export const ImageSection = (props: ImageSectionProps) => {
  const { imgUrl } = props;

  return (
    <section className={styles.imageSection}>
      <div className={styles.container}>
        <div
          style={{
            backgroundImage: `url(${imgUrl})`,
          }}
          className={styles.img}
        ></div>
        <HomeNav className={styles.nav} />
      </div>
    </section>
  );
};
