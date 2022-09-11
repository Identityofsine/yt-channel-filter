
//do this on load
var channel;
var page = 1;
var pages = 1;
var sleep;
chrome.storage.local.get(['channels'], (data) => {channel = data.channels; load(); onRunTime();})


function calibrateSleepTimer(){
    const sleepBox = document.getElementById("sleepTime");
    chrome.storage.local.get(['sleep'], (data) => {
        sleep = data.sleep;
        sleepBox.value = sleep
    })

    function onChange(e){
        if(isNaN(e.target.value)){
            e.target.value = sleep;
        } else{
            sleep = e.target.value;
            chrome.storage.local.set({"sleep":sleep}, function() {
                console.log("Sleep Set!");
            });
        }
    }
    sleepBox.onchange = onChange
}

function load(){
    loadToggle()
    calibrateSleepTimer();
}

function getDOM(){
    const div = document.getElementById("yt-channels");
    return div;
}

function createChannelNode(iText, i ){
    const node = document.createElement("channel")
    const container = document.createElement("chan-contain");
    const span = document.createElement("span")
    const text = document.createTextNode(iText);
    span.appendChild(text);
    container.appendChild(span)
    node.appendChild(container);
    node.onclick = e => ButtonOnClick(i);
    return node;
}

function enableFooter(){
    const buttons = [document.getElementById("left"), document.getElementById("right")];
    buttons.forEach(butt => {
        butt.classList.remove("disable")
    });
    buttons[0].onclick = (e => {goLeft()});
    buttons[1].onclick = (e => {goRight()});

}
function disableFooter(){
    const buttons = [document.getElementById("left"), document.getElementById("right")];
    buttons.forEach(butt => {
        butt.classList.add("disable")
    });
}

async function rerenderItems(div){
    while(div.firstChild){
        div.removeChild(div.firstChild)
    }
}

const changePageText = () => {
    const pageText = document.getElementById("page")
    pageText.innerText = `Page ${page}/${pages}`
}

var goLeft = async e => {
    if(page <= 1){
        return;
    }
    page = page - 1;
    changePageText();
    await rerenderItems(getDOM());
    for(let i = (page - 1) * 10; i < 10; i++){
        console.log(channel[i]);
        getDOM().appendChild(createChannelNode(channel[i], i)); 
    }
}
var goRight = async e => {
    if(page >= pages){
        return;
    }
    page = page + 1;
    changePageText();
    await rerenderItems(getDOM());
    for(let i = 1 * 10; i < channel.length; i++){
        getDOM().appendChild(createChannelNode(channel[i], i));
    }
}

async function toggle(){
    const dom = document.getElementById("toggle")
    await chrome.storage.local.get(['on'], function(data) {
        // chrome.stroage.local.set({'on':data.on === "false" ? "true" : "false"}, function() {
        const choice = data.on === "false" ? "true" : "false";
        console.log(choice)
        chrome.storage.local.set({'on': choice}, function() {
            dom.innerText = choice === "false" ? "OFF" : "ON";
            if(choice === "false"){
                dom.classList.remove("on")
            }
            else
                dom.classList.add("on")
        })
    })
}
async function loadToggle(){
    const dom = document.getElementById("toggle")
    chrome.storage.local.get(['on'], function(data) {
        // chrome.stroage.local.set({'on':data.on === "false" ? "true" : "false"}, function() {
            dom.innerText = data.on === "false" ? "OFF" : "ON";
            if(data.on === "false"){
                dom.classList.remove("on")
            }
            else
                dom.classList.add("on")
    })
}

async function ButtonOnClick(i){

    if (i > -1) { 
        channel.splice(i, 1); 
    }
    console.log(channel)
    await rerenderItems(getDOM());
    onRunTime();
    chrome.storage.local.set({'channels': channel})
}

async function onRunTime() {
    const div = getDOM();
    document.getElementById("toggle").onclick = toggle
    const length = (channel.length <= 10) ? channel.length : 10
    if(channel.length > 10){
        pages = Math.floor(channel.length / 10) + 1;
        enableFooter();
        changePageText();
    }
    for(let i = 0; i < length; i++){
        div.appendChild(createChannelNode(channel[i], i));
    }
}
