import React, {Fragment} from "react";
import ListItem from "./ListItem";

export default ({items, detailLabel, detailLink, deleteLabel, page, onDelete}) => {
  const payload = () => (
    <div className={"row text-left mt-3"}>
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <ListItem data={item} detailLabel={detailLabel} detailLink={detailLink} deleteLabel={deleteLabel} page={page} onDelete={onDelete}/>
        </Fragment>
      ))}
    </div>
  );

  return payload();
};
