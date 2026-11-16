import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "../loader";

interface DynamisListProps<Entity> {
  loading: boolean;
  data: Entity[];
  renderListItem(item: Entity): ReactNode;
}

const DynamicList = <Entity,>(props: DynamisListProps<Entity>) => {
  const { t } = useTranslation();
  const { loading, data, renderListItem } = props;
  return (
    <>
      {loading ? (
        <Loader />
      ) : data.length === 0 ? (
        <h2>{t("common.noneFound")}</h2>
      ) : (
        data.map(renderListItem)
      )}
    </>
  );
};

export { DynamicList };
