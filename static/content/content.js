let icon = '';
let data = [];
let currentHostname = window.location.hostname;
let parentClass = '';

const drowIcon = (top, left) => {
  let element = document.createElement('img');
  element.className = 'ext-icon';
  element.src = `${icon}`;
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;

  document.body.appendChild(element);
};

const ready = () => {
  if (!parentClass) return;

  let arrQueries = document.getElementsByClassName(parentClass);

  for (let i = 0; i < arrQueries.length; i++) {
    let itHas = false;
    let arrTagsA = arrQueries[i].getElementsByTagName('a');
    for (let index = 0; index < arrTagsA.length; index++) {
      data.forEach(el => {
        let linkHost = '';
        try {
          linkHost = new URL(arrTagsA[index].href).hostname;
        } catch (e) {}
        if (linkHost.includes(el) && !currentHostname.includes(el))
          itHas = true;
      });
    }
    if (itHas) {
      drowIcon(
        arrQueries[i].getBoundingClientRect().y,
        arrQueries[i].getBoundingClientRect().x - 25,
      );
    }
  }
};

chrome.runtime.onMessage.addListener(function(
  request,
  sender,
  sendResponse,
) {
  if (request.message) {
    let node = document.createElement('div');
    node.className = 'outer-message';
    node.innerText = request.message;
    let close = document.createElement('img');
    close.src = 'https://image.flaticon.com/icons/svg/748/748122.svg';
    close.className = 'img-close';
    close.onclick = function() {
      node.style.display = 'none';
      chrome.extension.sendMessage({
        hostname: request.hostname,
        event: 'close',
      });
    };
    node.appendChild(close);
    document.body.appendChild(node);
  }
  if (request.iconURL) {
    data = request.data.map(el => el.domain);

    icon = request.iconURL;
    parentClass = currentHostname.includes('google')
      ? 'g'
      : currentHostname.includes('bing')
      ? 'b_algo'
      : '';
    ready();
  }
});
