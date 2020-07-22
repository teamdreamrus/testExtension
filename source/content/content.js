import { config } from './config';
let icon = '';
let closeIcon = '';
let data = [];

const currentHostname = window.location.hostname;

const drowIcon = (top, left) => {
  let element = document.createElement('img');
  element.className = 'ext-icon';
  element.src = `${icon}`;
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;
  document.body.appendChild(element);
};

const ready = mainBlockClass => {
  let arrQueries = document.getElementsByClassName(mainBlockClass);
  for (let i = 0; i < arrQueries.length; i++) {
    let itHas = false;
    data.forEach(el => {
      if (arrQueries[i].innerText.includes(el)) itHas = true;
    });
    if (itHas) {
      drowIcon(
        arrQueries[i].getBoundingClientRect().y,
        arrQueries[i].getBoundingClientRect().x - 25,
      );
    }
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'message':
      let node = document.createElement('div');
      node.className = 'outer-message';
      node.innerText = request.message;
      let close = document.createElement('img');
      close.src = closeIcon;
      close.className = 'img-close';
      close.onclick = () => {
        node.style.display = 'none';
        chrome.extension.sendMessage({
          hostname: request.hostname,
          event: 'close',
        });
      };
      node.appendChild(close);
      document.body.appendChild(node);
      break;
    case 'data':
      data = request.data.map(el => el.domain);
      icon = request.iconURL;
      closeIcon = request.closeURL;
      const foundConfig = config.find(el => {
        return currentHostname.split('.')[currentHostname.split('.').length - 2] === el.name;
      });
      if (!foundConfig) return;
      ready(foundConfig.mainBlockClass);
    default:
      break;
  }
});
