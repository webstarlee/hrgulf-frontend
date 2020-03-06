import React, {Fragment} from "react";

import ListItem from "./ListItem";
import NewItem from "./NewItem";

export default ({items, showNewLink, newLink, ...restProps}) => {
  const payload = () => (
    <div className={"row text-left mt-3"}>
      {!!showNewLink && <NewItem to={newLink}/>}
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <ListItem data={item} {...restProps}/>
        </Fragment>
      ))}
    </div>
  );

  return payload();
};
