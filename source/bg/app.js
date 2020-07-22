import { ONE_HOUR, DATA_URL, ICON_URL, CLOSE_URL, DEFAULT_PROPS } from './constans';

let currentData = [];

const loadData = () => {
  chrome.storage.local.get({ lastUpdate: 0 }, ({ lastUpdate }) => {
    if (Date.now() - lastUpdate > ONE_HOUR) {
      fetch(DATA_URL)
        .then(response => {
          return response.json();
        })
        .then(data => {
          currentData = data.map(el => Object.assign({}, DEFAULT_PROPS, el));
          chrome.storage.local.set({
            lastUpdate: Date.now(),
            data: currentData,
          });
          setTimeout(() => {
            loadData();
          }, ONE_HOUR);
        });
    } else {
      chrome.storage.local.get({ data: [] }, ({ data }) => (currentData = data));
    }
  });
};

const changeHostname = hostname => {
  if (hostname.startsWith('www.')) {
    hostname = hostname.slice(4, hostname.length);
  }
  return hostname;
};

const findDataByHostname = hostname => {
  return currentData.find(data => {
    return changeHostname(hostname) === data.domain;
  });
};

loadData();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, { url, status }) => {
  if (!url || status !== 'complete') return;
  const { hostname } = new URL(url);
  const foundSite = findDataByHostname(hostname);
  chrome.tabs.sendMessage(tabId, {
    type: 'data',
    iconURL: ICON_URL,
    closeURL: CLOSE_URL,
    data: currentData,
  });
  if (foundSite) {
    if (!foundSite.closed && foundSite.count < 3) {
      chrome.tabs.sendMessage(tabId, {
        type: 'message',
        message: foundSite.message,
        hostname: hostname,
      });

      const index = currentData.findIndex(el => el.domain === changeHostname(hostname));
      if (index > -1) {
        currentData[index].count++;
      }
    }
  }
});

chrome.extension.onMessage.addListener(request => {
  if (request.hostname) {
    const index = currentData.findIndex(el => el.domain === changeHostname(request.hostname));
    if (index > -1) {
      currentData[index].closed = true;
    }
  }
});
