chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes('youtube.com/watch')) {
    const queryParameter = tab.url.split('?')[1] //this return the youtube video key
    const urlParameter = new URLSearchParams(queryParameter);

    chrome.sendMessage(tabId, {
      type: 'NEW',
      videoId: urlParameter.get('v')
    });
  }
}) 
