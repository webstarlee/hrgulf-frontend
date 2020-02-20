import {useEffect, useState} from "react";

export default (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(e => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value]);

  return debouncedValue;
}