const sleep = ms => new Promise(r => setTimeout(r, ms));

chrome.runtime.onInstalled.addListener(
    () => {
        chrome.storage.sync.set({'channels': []}, function() {
            console.log('Settings Created');
          });
    }
)
chrome.runtime.onStartup.addListener(
    () => {
        chrome.storage.sync.get(['channels'], function(items) {
            if(!channels || !channels?.length){
                chrome.storage.sync.set({'channels': []}, function() {
                    console.log('Settings Created');
                  });
            }
          });
    }
)


chrome.tabs.onUpdated.addListener(
async function(tabId, changeInfo, tab) {
    // read changeInfo data and do something with it
    // like send the new url to contentscripts.js
    if (tab?.url) {
        const pathname = new URL(tab?.url).pathname;
        console.info(pathname);
        try{
            if(pathname.split("/")[1] !== "channel" && pathname.split("/")[1] !== "c" && pathname.split("/")[1] !== 'user')
            {
                while(true){
                    await sleep(2000);     
                    // pathname === "/" ? 'watch' ? pathname === '/watch'
                    chrome.tabs.sendMessage( tabId, {
                        message:pathname === "/" ? 'home' : pathname === '/watch' ? 'watch' :'na',
                        url: tab.url
                    })
                }
            }
            else{
                chrome.tabs.sendMessage( tabId, {
                    message:'channel',
                })
            }
        }
        catch(err){}
    }
}
);