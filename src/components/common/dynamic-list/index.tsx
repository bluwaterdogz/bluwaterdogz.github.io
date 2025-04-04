import { ReactNode } from "react";
import { Loader } from "../loader";

interface DynamisListProps<Entity> {
  loading: boolean;
  data: Entity[];
  renderListItem(item: Entity): ReactNode;
}

const DynamicList = <Entity,>(props: DynamisListProps<Entity>) => {
  const { loading, data, renderListItem } = props;
  return (
    <>
      {loading ? (
        <Loader />
      ) : data.length === 0 ? (
        <h2>None found</h2>
      ) : (
        data.map(renderListItem)
      )}
    </>
  );
};

export { DynamicList };
