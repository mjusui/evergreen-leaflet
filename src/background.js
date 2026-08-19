console.log('Background service worker running');

chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({
    tabId: tab.id
  });
});
