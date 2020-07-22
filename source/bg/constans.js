const ONE_HOUR = 1 * 60 * 60 * 1000;
const DATA_URL = 'http://www.softomate.net/ext/employees/list.json';

const ICON_URL = chrome.runtime.getURL('images/icon.png');
const CLOSE_URL = chrome.runtime.getURL('images/close.png');

const DEFAULT_PROPS = {
  count: 0,
  closed: false,
};
export { ONE_HOUR, DATA_URL, ICON_URL, CLOSE_URL, DEFAULT_PROPS };
