import {PROJECT, RESULT} from "./globals";
import {setHeader} from "../apis/fetch";

export const triggerChangeEvent = (id, value) => {
  const input = document.getElementById(id);
  if (!input)
    return;

  let lastValue = input.value;
  input.value = value;
  let event = new Event("input", { bubbles: true });

  let tracker = input._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  input.dispatchEvent(event);
};

const onSuccessSignIn = (params, res) => {
  if (res.result === RESULT.SUCCESS) {
    setHeader({Authorization: `Bearer ${res.data.token}`});
    const authData = JSON.stringify({
      ...res.data,
      signedIn: true,
    });
    params["rememberMe"] && localStorage.setItem(PROJECT.PERSIST_KEY, authData);
  }
};

export default {
  triggerChangeEvent,
  onSuccessSignIn,
};
