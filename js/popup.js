document.addEventListener("DOMContentLoaded", function () {
    
    let enableToggler = document.getElementById('enableToggler');
    enableToggler.addEventListener('change',toggleEnableBookmarkify,false)
    LoadBookmarks();
    checkForEnable()
    
});

let bookmarks = ''
let isEnabledOnThisPage = '' ;


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
    setEnableToggler()
}

function setEnableToggler(){
    let enableToggler = document.getElementById('enableToggler');
        console.log('isEnabledOnThisPage', isEnabledOnThisPage);
        enableToggler.value = isEnabledOnThisPage

        if(isEnabledOnThisPage){
            enableToggler.checked = true;
        }else{
            enableToggler.checked = false;
        }
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
            li.appendChild(icon)
            let span = document.createElement('span');
            span.className = 'title'
            span.innerHTML = bookmark.title;
            li.appendChild(span)

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

function makeDeleteBtn() {
    let span = document.createElement('span');
    span.className = 'deleteBtn'

    let delIcon = document.createElement('i');
    delIcon.className = 'fa fa-trash'

    span.appendChild(delIcon)

    return span;
}

function addDeleteEvent(btn, index) {
    btn.addEventListener('click', function () {
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
    // let toggler = document.querySelector('input[type="checkbox"]')
    let toggler = document.getElementById('enableToggler')
    let val = e.target.value;
    let newVal = val == 'true' ? 'false' : 'true'

    toggler.value = newVal;
   
    let msg = val == 'true' ? 'disable' : 'enable'

    let message = {
        msg: msg
    }

    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, message);
    });
}