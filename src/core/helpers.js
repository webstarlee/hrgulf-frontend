export const triggerChangeEvent = (id, value) => {
  const input = document.getElementById(id);
  if (!input)
    return;

  let lastValue = input.value;
  input.value = value;
  let event = new Event('input', { bubbles: true });

  let tracker = input._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  input.dispatchEvent(event);
};

export default {
  triggerChangeEvent,
};
