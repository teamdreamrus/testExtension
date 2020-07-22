const ONE_HOUR = 1 * 60 * 60 * 1000;

const iconURL = chrome.runtime.getURL('images/icon.png');
const closeURL = chrome.runtime.getURL('images/close.png');

let currentData = [];
let prevHostname = '';

const loadData = () => {
  chrome.storage.local.get('lastUpdate', res => {
    let time = res.lastUpdate ? res.lastUpdate : 0;
    if (new Date().getTime() - time > ONE_HOUR) {
      fetch('http://www.softomate.net/ext/employees/list.json')
        .then(response => {
          return response.json();
        })
        .then(data => {
          currentData = data.map(el => {
            el.count = 0;
            el.closed = false;
            return el;
          });
          chrome.storage.local.set({ data: currentData });
          chrome.storage.local.set({
            lastUpdate: new Date().getTime(),
          });
          setTimeout(() => {
            loadData();
          }, ONE_HOUR);
        });
    } else {
      chrome.storage.local.get(
        'data',
        result => (currentData = result.data),
      );
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

chrome.tabs.onUpdated.addListener(
  (tabId, changeInfo, { url, status }) => {
    if (!url || status !== 'complete') return;
    let hostname = new URL(url).hostname;
    const findResult = findDataByHostname(hostname);
    chrome.tabs.sendMessage(tabId, {
      type: 'data',
      iconURL: iconURL,
      closeURL: closeURL,
      data: currentData,
    });
    if (findResult) {
      if (!findResult.closed && findResult.count < 3) {
        chrome.tabs.sendMessage(tabId, {
          type: 'message',
          message: findResult.message,
          hostname: hostname,
        });

        let index = currentData.findIndex(
          el => el.domain === changeHostname(hostname),
        );
        if (index > -1) {
          console.log(currentData[index]);
          currentData[index].count = currentData[index].count + 1;
        }
      }
    }
  },
);

chrome.extension.onMessage.addListener(request => {
  if (request.hostname) {
    let index = currentData.findIndex(
      el => el.domain === changeHostname(request.hostname),
    );
    if (index > -1) {
      currentData[index].closed = true;
    }
  }
});
