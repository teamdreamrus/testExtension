const ONE_HOUR = 1 * 60 * 60 * 1000;

let currentData = [];
let prevHostname = '';

const loadData = () => {
  fetch('http://www.softomate.net/ext/employees/list.json')
    .then(response => {
      return response.json();
    })
    .then(data => {
      currentData = data;
      chrome.storage.local.set({ data });
    });
};

const changeHostname = hostname => {
  if (hostname.startsWith('www.')) {
    hostname = hostname.slice(4, hostname.length);
  }
  return hostname;
};

const findDataByHostname = hostname =>
  currentData.find(data => {
    return changeHostname(hostname) === data.domain;
  });

loadData();
setInterval(() => {
  loadData();
}, ONE_HOUR);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (!currentData) return;
  let hostname = new URL(tab.url).hostname;
  const findResult = findDataByHostname(hostname);
  if (
    tab.url &&
    tab.status === 'complete' &&
    findResult &&
    !findResult.closed &&
    (!findResult.count || findResult.count < 3)
  ) {
    chrome.tabs.sendMessage(tabId, {
      message: findResult.message,
      hostname: hostname,
    });

    let index = currentData.findIndex(
      el => el.domain === changeHostname(hostname),
    );
    if (index > -1) {
      currentData[index].count = currentData[index].count
        ? currentData[index].count + 1
        : 1;
    }
  }
});

chrome.extension.onMessage.addListener(function(request) {
  if (request.hostname) {
    console.log('1. Принято: ', request);
    let index = currentData.findIndex(
      el => el.domain === changeHostname(request.hostname),
    );
    if (index > -1) {
      currentData[index].closed = true;
    }
  }
});
