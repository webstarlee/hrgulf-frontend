import React, {Fragment} from "react";

import ListItem from "./ListItem";
import NewItem from "./NewItem";

export default ({items, page, showNewLink, newLink, detailLabel, detailLink, deleteLabel, onDelete, questionsLink, questionsLabel}) => {
  const payload = () => (
    <div className={"row text-left mt-3"}>
      {!!showNewLink && <NewItem to={newLink}/>}
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <ListItem data={item} page={page} detailLabel={detailLabel} detailLink={detailLink} deleteLabel={deleteLabel} onDelete={onDelete} questionsLink={questionsLink} questionsLabel={questionsLabel}/>
        </Fragment>
      ))}
    </div>
  );

  return payload();
};
