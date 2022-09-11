const sleep = ms => new Promise(r => setTimeout(r, ms));

chrome.runtime.onInstalled.addListener(
    () => {
        chrome.storage.sync.get(['channels'], function(items) {
            if(!items.channels){
                chrome.storage.sync.set({'channels': []}, function() {
                    console.log('Settings Created');
                  });
            }
          });
          chrome.storage.local.get(['channels'], function(items) {
            if(!items.channels){
                chrome.storage.sync.set({'channels': []}, function() {
                    console.log('Settings Created');
                  });
            }
          });
        chrome.storage.local.get(['on'], function(items) {
            if(!items.on)
            chrome.storage.local.set({'on': "true"}, function() {
                console.log('Settings Created');
            });
        });
        chrome.storage.local.get(['sleep'], function(items) {
            if(!items.sleep)
            chrome.storage.local.set({'sleep': "2000"}, function() {
                console.log('Settings Created');
            });
        });
    }
)
chrome.runtime.onStartup.addListener(
    () => {
        chrome.storage.sync.get(['channels'], function(items) {
            if(!items.channels){
                chrome.storage.sync.set({'channels': []}, function() {
                    console.log('Settings Created');
                  });
            }
          });
          chrome.storage.local.get(['channels'], function(items) {
            if(!items.channels){
                chrome.storage.sync.set({'channels': []}, function() {
                    console.log('Settings Created');
                  });
            }
          });
          chrome.storage.local.get(['on'], function() {
            if(!items.on)
            chrome.storage.local.set({'on': "true"}, function() {
                console.log('Settings Created');
            });
          });
          chrome.storage.local.get(['sleep'], function(items) {
            if(!items.sleep)
            chrome.storage.local.set({'sleep': "2000"}, function() {
                console.log('Settings Created');
            });
        });
    }
)


chrome.tabs.onUpdated.addListener(
async function(tabId, changeInfo, tab) {
    // read changeInfo data and do something with it
    // like send the new url to contentscripts.js
    if (tab?.url) {
        var isOn;
        mainPart();

        async function mainPart(){
            const pathname = new URL(tab?.url).pathname;
            console.info(pathname);
            try{
                chrome.storage.local.get(['on'], async (data) => {
                    if(pathname.split("/")[1] !== "channel" && pathname.split("/")[1] !== "c" && pathname.split("/")[1] !== 'user')
                    {
                        //while(data.on !== "false"){
                            // pathname === "/" ? 'watch' ? pathname === '/watch'
                            chrome.tabs.sendMessage( tabId, {
                                message:pathname === "/" ? 'home' : pathname === '/watch' ? 'watch' :'na',
                                url: tab.url
                            })
                        //}
                    }
                    else{
                        chrome.tabs.sendMessage( tabId, {
                            message:'channel',
                        })
                    }
                    
                });
            }
            catch(err){}
            }
        }
}
);