var elem = document.createElement('input');
elem.setAttribute('id','copy');
document.body.appendChild(elem);

function copy(text) {
  document.getElementById('copy').value = text;
  document.getElementById('copy').select();
  document.execCommand('Copy', false, null);
}

function setIcon(icon) {
  chrome.browserAction.setIcon({
    path: 'copy_' + icon + '_128.png'
  });
}

function setBadgeText(text) {
  chrome.browserAction.setBadgeText({
    text: text
  });
}

chrome.contextMenus.create({
  'title': 'Copy Page URL',
  'contexts':[
    'page',
    'selection',
    'link',
    'editable',
    'image',
    'video',
    'audio'
  ],
  'onclick': function(page) {
    copy(page.pageUrl);
  }
});

chrome.contextMenus.create({
  'title': 'Copy Frame URL',
  'contexts':[
    'frame'
  ],
  'onclick': function(page) {
    copy(page.frameUrl);
  }
});

chrome.browserAction.setBadgeBackgroundColor({
  color: '#32cd32'
});

chrome.browserAction.onClicked.addListener(function(tab) {
  copy(tab.url);
  setBadgeText('OK!');
  setTimeout(setBadgeText.bind(null, ''), 3 * 1000);
});

chrome.runtime.onMessage.addListener(function(message) {
  if (!message.options) {
    return;
  }

  var opts = message.options;
  if (opts.toolbar_icon) {
    setIcon(opts.toolbar_icon);
  }
});

chrome.storage.sync.get(defaults, function(items) {
  setIcon(items.toolbar_icon);
});
