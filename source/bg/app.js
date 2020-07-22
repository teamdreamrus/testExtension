import { ONE_HOUR, DATA_URL } from './constans';
const iconURL = chrome.runtime.getURL('images/icon.png');
const closeURL = chrome.runtime.getURL('images/close.png');

let currentData = [];

const loadData = () => {
  chrome.storage.local.get('lastUpdate', res => {
    const time = res.lastUpdate ? res.lastUpdate : 0;
    if (Date.now() - time > ONE_HOUR) {
      fetch(DATA_URL)
        .then(response => {
          return response.json();
        })
        .then(data => {
          data.forEach(el => {
            if (
              currentData.findIndex(currentElement => {
                return el.domain === currentElement.domain;
              }) < 0
            ) {
              el.count = 0;
              el.closed = false;
              currentData.push(el);
            }
          });
          chrome.storage.local.set({
            lastUpdate: Date.now(),
            data: currentData,
          });
          setTimeout(() => {
            loadData();
          }, ONE_HOUR);
        });
    } else {
      chrome.storage.local.get('data', result => (currentData = result.data));
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
    iconURL: iconURL,
    closeURL: closeURL,
    data: currentData,
  });
  if (foundSite) {
    if (!foundSite.closed && foundSite.count < 3) {
      chrome.tabs.sendMessage(tabId, {
        type: 'message',
        message: foundSite.message,
        hostname: hostname,
      });

      let index = currentData.findIndex(el => el.domain === changeHostname(hostname));
      if (index > -1) {
        console.log(currentData[index]);
        currentData[index].count++;
      }
    }
  }
});

chrome.extension.onMessage.addListener(request => {
  if (request.hostname) {
    let index = currentData.findIndex(el => el.domain === changeHostname(request.hostname));
    if (index > -1) {
      currentData[index].closed = true;
    }
  }
});
