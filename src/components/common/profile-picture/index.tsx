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
      className={`${styles.headShot} ${className} ${
        size != null ? styles[size] : ""
      }`}
      style={{ backgroundImage: 'url("/imgs/brian.jpg")' }}
    ></div>
  );
};
