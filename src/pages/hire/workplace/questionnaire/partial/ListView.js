import React, {Fragment} from "react";

import ListItem from "./ListItem";
import NewItem from "./NewItem";

export default ({items, showNewLink, newLink, detailLabel, detailLink, deleteLabel, page, onDelete}) => {
  const payload = () => (
    <div className={"row text-left mt-3"}>
      {!!showNewLink && <NewItem to={newLink}/>}
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <ListItem data={item} detailLabel={detailLabel} detailLink={detailLink} deleteLabel={deleteLabel} page={page} onDelete={onDelete}/>
        </Fragment>
      ))}
    </div>
  );

  return payload();
};
