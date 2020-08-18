document.addEventListener("DOMContentLoaded", function () {
    LoadBookmarks();
    checkForEnable()
});

let bookmarks = ''
let isEnabledOnThisPage  ;

function checkForEnable(){
    let message = {
        msg: "isEnabled"
    }

    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, message, setIsEnabledOnThisPage);
    });
}

function setIsEnabledOnThisPage(res){
    isEnabledOnThisPage = res;
    console.log(isEnabledOnThisPage);
    setEnableToggler()
}

function setEnableToggler(){
    let enableToggler = document.getElementById('switchSlider');
       
    isEnabledOnThisPage == 'true' ?  enableToggler.classList.add('on') :  enableToggler.classList.remove('on')
    
    enableToggler.addEventListener('click',toggleEnableBookmarkify)

}

function LoadBookmarks() {

    let message = {
        msg: "getBookmarks"
    }

    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, message, setBookmark);
    });

}

function setBookmark(res) {
    bookmarks = res;
    renderBookmarks();
}

function renderBookmarks() {
    let ul = document.getElementById('listWrapper')
    ul.innerHTML = '';
    if (bookmarks && bookmarks.length != 0) {

        bookmarks.forEach((bookmark, index) => {
            let icon = document.createElement('i');
            icon.className = 'fa fa-bookmark'
            icon.classList.add('bIcon')
            let li = document.createElement('li');
            li.className = 'list'
           
            let span = document.createElement('span');
            span.className = 'title'
            span.appendChild(icon)
            let title = document.createElement('span');
            title.innerHTML = bookmark.title;
            span.appendChild(title);
            li.appendChild(span)
            li.addEventListener('click',function(e){
                e.stopPropagation();
                scrollToBookmark(bookmark.top)
            },false)
            let deleteBtn = makeDeleteBtn();
            addDeleteEvent(deleteBtn, index);
            li.appendChild(deleteBtn)
            ul.appendChild(li)
        });

    } else {
        let li = document.createElement('li');
        li.className = 'list noBookmark'
        li.innerHTML = 'Select some text to save a bookmark'
        ul.appendChild(li)
    }
}

function scrollToBookmark(top){
    let message = {
        msg: "scrollTo",
        top: top
    }

    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, message);
    });
}

function makeDeleteBtn() {
    let span = document.createElement('span');
    span.className = 'deleteBtn'

    let delIcon = document.createElement('i');
    delIcon.className = 'fa fa-trash'

    span.appendChild(delIcon)

    return span;
}

function addDeleteEvent(btn, index) {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        deleteBookmark(index)
    })
}

function deleteBookmark(index) {

    let message = {
        msg: 'deleteBookmark',
        index: index
    }

    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, message, setNewBookmark);
    });
}

function setNewBookmark(resp) {
    bookmarks = resp;
    renderBookmarks();
}

function toggleEnableBookmarkify(e) {
    e.stopPropagation();
    let toolSwitch = document.getElementById('switchSlider');

    let isOn = toolSwitch.classList.contains('on')

    let msg = isOn == true ? 'disable' : 'enable'

    let message = {
        msg: msg
    }

    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, message, changeSwitch);
    });
}

function changeSwitch(res){
    let toolSwitch = document.getElementById('switchSlider');
    let isOn = res;

    console.log(isOn);

    isOn == 'true' ? toolSwitch.classList.add('on') : toolSwitch.classList.remove('on')

}