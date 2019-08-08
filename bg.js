var options;

var elem = document.createElement('input');
document.body.appendChild(elem);

function copy(text) {
  if (options.clean_url) {
    elem.value = cleanURL(text);
  } else {
    elem.value = text;
  }
  elem.select();
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

function cleanURL(url) {
  var a = document.createElement('a');
  a.href = url;
  a.search = removeTrackingTags(a.search.replace(/^\?/,''));
  a.hash = removeTrackingTags(a.hash.replace(/^#/,''));

  return a.href;
}

function removeTrackingTags(str) {
  return str
    .split('&')
    .filter(function(item) {
      return !/^(utm_|from=|_openstat)/.test(item);
    })
    .join('&');
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    'id': 'copy-page-url',
    'title': 'Copy Page URL',
    'contexts':[
      'page',
      'selection',
      'link',
      'editable',
      'image',
      'video',
      'audio'
    ]
  });

  chrome.contextMenus.create({
    'id': 'copy-frame-url',
    'title': 'Copy Frame URL',
    'contexts':[
      'frame'
    ]
  });

  chrome.browserAction.setBadgeBackgroundColor({
    color: '#32cd32'
  });
});

chrome.contextMenus.onClicked.addListener(function(info) {
  if (info.menuItemId === 'copy-page-url') {
    copy(info.pageUrl);
  } else if (info.menuItemId === 'copy-frame-url') {
    copy(info.frameUrl);
  }
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

  Object.keys(message.options).forEach(function(key) {
    options[key] = message.options[key];
  });

  var opts = message.options;
  if (opts.toolbar_icon) {
    setIcon(opts.toolbar_icon);
  }
});

chrome.storage.sync.get(defaults, function(items) {
  options = items;
  setIcon(items.toolbar_icon);
});
