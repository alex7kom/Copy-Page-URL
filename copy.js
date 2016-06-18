var elem = document.createElement('input');
elem.setAttribute('id','copy');
document.body.appendChild(elem);

function copy(text) {
  document.getElementById('copy').value = text;
  document.getElementById('copy').select();
  document.execCommand('Copy', false, null);
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

chrome.browserAction.onClicked.addListener(function(tab) {
  copy(tab.url);
});
