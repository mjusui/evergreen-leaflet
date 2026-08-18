// Background service worker
console.log('Background service worker running');

// When the user clicks the extension's toolbar icon, open the side panel.
chrome.action.onClicked.addListener(() => {
  // Explicitly set the side panel page (optional – default_path already points here)
  chrome.sidePanel.setOptions({path: 'side_panel.html'});
});
