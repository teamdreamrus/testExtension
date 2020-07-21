const oneHour = 1 * 60 * 60 * 1000;

let currentData = [];
let prevHostname = '';
const loadData = () => {
  fetch('http://www.softomate.net/ext/employees/list.json')
    .then(response => {
      return response.json();
    })
    .then(data => {
      currentData = data;
      console.log(currentData);
    });
};
loadData();
setInterval(() => {
  loadData();
}, oneHour);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (!currentData) return;
  const findResult = currentData.find(data => {
    let hostname = new URL(tab.url).hostname;
    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4, hostname.length);
    }
    return hostname === data.domain;
  });
  if (tab.url && tab.status === 'complete' && findResult) {
    chrome.tabs.sendMessage(tabId, {
      message: findResult.message,
      url: tab.url,
    });
    console.log('message:', findResult.message);
  }
});
