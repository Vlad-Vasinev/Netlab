export function untilEventStop(element, eventType, callback, timeout = 200) {
  let inputTimeout;
  const timeOutHandler = (event) => {
    clearTimeout(inputTimeout);
    inputTimeout = setTimeout(callback, timeout, event);
  };
  element.addEventListener(eventType, timeOutHandler);
}
