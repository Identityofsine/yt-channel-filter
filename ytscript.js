const sleep = ms => new Promise(r => setTimeout(r, ms));
var channels;
chrome.storage.local.get(['channels'], (data) => {channels = data.channels;});

async function saveChannels(channel){
    await chrome.storage.local.set({'channels': channel});
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

chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    // listen for messages sent from background.js
    //hello!
    
      console.info("ran")
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
            const channels = document.getElementsByTagName("ytd-compact-video-renderer")
            //const channels = document.getElementById("related").querySelector('#items').childNodes[1].querySelector('#contents').childNodes;
            const scroller = document.querySelectorAll("#spinnerContainer")
            //console.log(scroller)
            for(let x in scroller){
              const s = scroller[x];
              console.log(s);
              if(s?.remove)
              s.remove();
            }
            for(let x in channels){
              const c = channels[x]
              if(c?.querySelector){
                  const channelName = channels[x]?.querySelector(".ytd-channel-name").querySelector("#text").innerHTML;
                  //console.log(channelName);
                  if(channelName !== "Hamza"){
                    c.remove();
                  }
              }
              //scroller.remove();    
            }
      }
      if(request.message === "home"){
        const videos = document.getElementsByTagName("ytd-rich-item-renderer")
        for(let x in videos){
          const video = videos[x];
          if(video?.childNodes){
            const channelName = video?.childNodes[1]?.firstChild?.childNodes[1]?.lastChild?.childNodes[1]?.childNodes[1]?.childNodes[2]?.childNodes[1]?.childNodes[1]?.childNodes[1]?.childNodes[1]?.childNodes[0]?.nextSibling?.outerText;
            if(!contains(channelName)){
              video.remove();
            }
          }
        }
      }
  });

