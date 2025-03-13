import styles from "./styles.module.scss";

interface ProfilePictureProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

export const ProfilePicture = ({
  className = "",
  size = "medium",
}: ProfilePictureProps) => {
  return (
    <div
      className={`${styles.headShotContainer} ${className} ${
        size != null ? styles[size] : ""
      }`}
    >
      <div
        className={`${styles.headShot} `}
        style={{ backgroundImage: 'url("/imgs/prof2.png")' }}
      ></div>
      <div
        className={`${styles.headShot} ${styles.main}`}
        style={{ backgroundImage: 'url("/imgs/prof1.png")' }}
      ></div>
    </div>
  );
};
