import styles from "./styles.module.scss";
export const Home = () => {
  return (
    <div>
      <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div
            style={{
              backgroundImage: "url(./dog.jpg)",
            }}
            className="mr-auto place-self-center lg:col-span-7"
          >
            Brian Velasquez
          </div>
        </div>
      </section>
    </div>
  );
};
