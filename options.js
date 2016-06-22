function saveAndApply(params) {
  chrome.storage.sync.set(params, function () {
    chrome.runtime.sendMessage({
      options: params
    });
  });
}

function restore() {
  chrome.storage.sync.get(defaults, function(items) {
    document.getElementById('toolbar_icon:' + items.toolbar_icon).checked = 'checked';
    if (items.clean_url) {
      document.getElementById('clean_url').checked = true;
    }
  });
}

document.addEventListener('DOMContentLoaded', restore);

document.getElementById('toolbar_icon:black')
  .addEventListener(
    'click',
    saveAndApply.bind(null, { toolbar_icon: 'black' }),
    false
  );

document.getElementById('toolbar_icon:gray')
  .addEventListener(
    'click',
    saveAndApply.bind(null, { toolbar_icon: 'gray' }),
    false
  );

document.getElementById('clean_url')
  .addEventListener(
    'change',
    function() {
      saveAndApply({
        clean_url: document.getElementById('clean_url').checked
      });
    },
    false
  );
