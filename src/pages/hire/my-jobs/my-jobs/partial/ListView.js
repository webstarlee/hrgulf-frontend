import React, {Fragment} from "react";

import ListItem from "./ListItem";

export default ({items, ...restProps}) => {
  const payload = () => (
    <div className={"row text-left mt-3"}>
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <ListItem data={item} {...restProps}/>
        </Fragment>
      ))}
    </div>
  );

  return payload();
};
