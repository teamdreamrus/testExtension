chrome.runtime.onMessage.addListener(function(
  request,
  sender,
  sendResponse,
) {
  let node = document.createElement('div');
  node.className = 'outer-message';
  node.innerText = request.message;
  let close = document.createElement('img');
  close.src = 'https://image.flaticon.com/icons/svg/748/748122.svg';
  close.className = 'img-close';
  close.onclick = function() {
    node.style.display = 'none';
    // save about Close
  };

  node.appendChild(close);
  document.body.appendChild(node);
});
