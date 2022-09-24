const sleep = ms => new Promise(r => setTimeout(r, ms));
var sleepTime;
var channels;
var reverse;
var totalTime;
var isAlreadyCounting;
chrome.storage.sync.get(['channels'], (data) => {channels = data.channels;});
chrome.storage.sync.get(['time'], (data) => {totalTime = data.time; console.info(data)});
chrome.storage.local.get(['sleep'], (data) => {sleepTime = data.sleep;});
chrome.storage.local.get(['reverse'], (data) => {reverse = data.reverse;});


async function saveChannels(channel){
    await chrome.storage.sync.set({'channels': channel});
}

async function saveTime(time){
  await chrome.storage.sync.set({'time':time})
}

function removeChannel(channel){
  var index = channels.indexOf(channel);
  if (index !== -1) {
    channels.splice(index, 1);
  }
}

function contains(channelName){
  for(let x in channels){
    const channel = channels[x];
    if(channelName === channel)
      return true;
  }
  return false;
}
const updateTime = async () => {
  if(isAlreadyCounting) return;
  isAlreadyCounting = true;
  while(true){
    //run this loop for ever(in the background)
    await sleep(1000); // wait one second
    totalTime = totalTime + 1;
    await saveTime(totalTime);
    console.info(totalTime) // update value
  }
} //this async function updates the time variable every second

chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    // listen for messages sent from background.js
    //hello!
      updateTime();
      if (request.message === 'channel'){
        const channelName = document.getElementsByTagName("ytd-channel-name")[0]
        const _ChannelName = channelName.childNodes[1].childNodes[1].firstChild.nextSibling.innerText;
        if(channelName && _ChannelName){
          if(!contains(_ChannelName)){ 
            const addbutton = document.getElementsByClassName("cusadd");
            if(addbutton.length !== 0){
              console.error('Button Exists Already');
              console.log(addbutton.length)
            }
            else{
              let btn = document.createElement("div");
              btn.id = 'addbuttondontcopy'
              btn.className = 'cusadd'
              const x = document.createElement("span")
              x.innerText = "Add Channel";
              btn.appendChild(x)
              btn.onclick = function () {
                console.info(`${_ChannelName} added...`);
                channels.push(_ChannelName);
                console.info("arrays : ", channels);
                saveChannels(channels).then(() => {location.reload();})
              };
              channelName.childNodes[1].appendChild(btn)
            }
          }
          else{
            const removebutton = document.getElementsByClassName("cusremove");
            if(removebutton.length !== 0){
              console.error('Button Exists Already');
              console.log(removebutton.length)
            }
            else{
              let btn = document.createElement("div");
              btn.className = 'cusremove'
              const x = document.createElement("span")
              x.innerText = "Remove Channel";
              btn.appendChild(x)
              btn.onclick = function () {
                console.info(`${_ChannelName} added...`);
                removeChannel(_ChannelName); 
                //TODO: REMOVE FROM ARRAY
                console.info("arrays : ", channels);
                saveChannels(channels).then(() => {location.reload();})
              };
              channelName.childNodes[1].appendChild(btn)
            }
          }
        }
        }
        
        if (request.message === 'watch') {
          const watchFunction = async (data) => {
            const channels = document.getElementsByTagName("ytd-compact-video-renderer")
            for(let x in channels){
              const c = channels[x]
              if(c?.querySelector){
                  const channelName = channels[x]?.querySelector(".ytd-channel-name").querySelector("#text").innerHTML;
                  //console.log(channelName);
                  if(!contains(channelName)){
                    c.style.display = "none";
                  }
              }
            }
            while(data === "true"){
              await sleep(sleepTime);  
              //const channels = document.getElementById("related").querySelector('#items').childNodes[1].querySelector('#contents').childNodes;
              const scroller = document.querySelectorAll("#spinnerContainer")
              //console.log(scroller)
              for(let x in scroller){
                const s = scroller[x];
                if(s?.remove)
                s.remove();
              }
              for(let x in channels){
                const c = channels[x]
                if(c?.querySelector){
                    const channelName = channels[x]?.querySelector(".ytd-channel-name").querySelector("#text").innerHTML;
                    //console.log(channelName);
                    const condition = reverse ? contains(channelName) : !contains(channelName);
                    if(condition){
                      c.remove();
                    }
                }
                //scroller.remove();    
              }
              const blankRec = document.getElementsByTagName("ytd-continuation-item-renderer")
              for(let x in blankRec){
                blankRec[x]?.remove();
              }

            }
            //end of function
          }
          chrome.storage.local.get(['on'], data => {
            if(data.on === "true")
              watchFunction(data.on);
          })
      }
      if(request.message === "home"){
        const homeFunction = async (data) => {
          while(data === "true"){
            const videos = document.getElementsByTagName("ytd-rich-item-renderer")
            for(let x in videos){
              const video = videos[x];
              if(video?.childNodes){
                const channelName = video?.childNodes[1]?.firstChild?.childNodes[1]?.lastChild?.childNodes[1]?.childNodes[1]?.childNodes[2]?.childNodes[1]?.childNodes[1]?.childNodes[1]?.childNodes[1]?.childNodes[0]?.nextSibling?.outerText;
                const condition = reverse ? contains(channelName) : !contains(channelName);
                if(condition){
                  video.style.display = 'none';
                }
              }
            }
            await sleep(sleepTime);  
            for(let x in videos){
              const video = videos[x];
              if(video?.childNodes){
                const channelName = video?.childNodes[1]?.firstChild?.childNodes[1]?.lastChild?.childNodes[1]?.childNodes[1]?.childNodes[2]?.childNodes[1]?.childNodes[1]?.childNodes[1]?.childNodes[1]?.childNodes[0]?.nextSibling?.outerText;
                const condition = reverse ? contains(channelName) : !contains(channelName);
                if(condition){
                  video.remove();
                }
              }
            }
            const row = document.getElementsByTagName("ytd-rich-grid-row");
            try{
              for(let x in row){
                const content = row[x]?.querySelector("#contents")
                // console.log(content);
                if(content){
                  if(!content.hasChildNodes())
                    row[x]?.remove()
                }
                if(!row[x]?.childNodes[1].hasChildNodes){
                  console.log("removal!")
                  row[x].remove();
                }
              }
            }
            catch(e) {
              //e --> something went wrong...
            }
          }
        }
        chrome.storage.local.get(['on'], data => {
          if(data.on === "true")
            homeFunction(data.on);
        })
      }
  });

