init();

function init() {
    initBookmarkify();
    drawBookmarkBar();
}


function initBookmarkify() {

    const body = document.getElementsByTagName('body')[0]

    // create a button to bookmark a section
    const btn = document.createElement('span')
    btn.innerHTML = '&#128278';
    btn.className = 'bookmarkBtn';
    btn.setAttribute('title', 'Bookmark this line')
    btn.id = 'bookmarkBtn'

    // add button to current web page
    body.appendChild(btn)

    // get bookmark button element from DOM
    const bookmarkBtn = document.getElementById('bookmarkBtn');

    // set the selecte text to empty initially 
    let selectedText = ""

    // add an event to get the selected text
    document.addEventListener('mouseup', onTextSelected, false);

    function onTextSelected() {

        let newSelectedText = getSelectionText();

        if (newSelectedText !== "") {
            selectedText = newSelectedText;
            const x = event.pageX;
            const y = event.pageY;

            // show the bookmark icon near the selected text
            bookmarkBtn.classList.add('show')
            bookmarkBtn.style.left = (x - 0) + 'px';
            bookmarkBtn.style.top = (y - 36) + 'px';
        }
    }


    // hide bookmark button if nothing is selected
    document.addEventListener('mousedown', onSelectionRemove, false)

    function onSelectionRemove(event) {
        if (getComputedStyle(bookmarkBtn).display == 'block' && event.target.id !== 'bookmarkBtn') {
            bookmarkBtn.classList.remove('show')
            window.getSelection().empty();
        }
    }

    // add new click event to save a bookmark
    bookmarkBtn.addEventListener('click', addAbookmark, false)

    function addAbookmark(event) {

        let bookmarkList = JSON.parse(localStorage.getItem('bookmarks')) || {}
        let currentURL = window.location.href;
        let title = selectedText;
        let pos = event.pageY;

        const bookmark = {
            title: title,
            top: pos,
            color: getRandomColor()
        }

        // if bookmark is created for the current site
        if (bookmarkList) {

            let currentPageBookmarkList = getBookmark(bookmarkList);

            // if there are existing bookmarks for the current page
            if (currentPageBookmarkList) {
                currentPageBookmarkList.push(bookmark)
                bookmarkList[currentURL] = currentPageBookmarkList;
                saveToLocalStorage(bookmarkList)
            } else {
                // set the bookmark for the current
                setBookmark(bookmarkList, bookmark)
                saveToLocalStorage(bookmarkList);
            }

        } else {
            bookmarkList[currentURL] = []
            bookmarkList[currentURL].push(bookmark)
            //setBookmark(bookmarkList)
            saveToLocalStorage(bookmarkList);
        }

        // hide the bookmark button
        bookmarkBtn.classList.remove('show')
        drawBookmarkBar();
    }
}

function getSelectionText() {
    return window.getSelection().toString().trim();
}

// get bookmarks for the current page
function getBookmark(bookmarkList) {
    let currentURL = window.location.href;
    return bookmarkList[currentURL]
}

// set bookmakrs for the current page
function setBookmark(bookmarkList, bookmark) {

    let currentURL = window.location.href;

    bookmarkList[currentURL] = []
    bookmarkList[currentURL].push(bookmark)
}

// save the bookmarks to the local storage
function saveToLocalStorage(bookmarkList) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarkList))
}


function drawBookmarkBar() {
    const body = document.getElementsByTagName('body')[0]
    const url = window.location.href;

    // delete any existing bookmarkbar
    let existingBookmarkBar = document.getElementById('bookmarkBar')

    if (existingBookmarkBar) {
        body.removeChild(existingBookmarkBar)
    }

    let bookmarkBar = document.createElement('div');
    bookmarkBar.id = 'bookmarkBar'
    let bookmarkList = JSON.parse(localStorage.getItem('bookmarks'));
    // if bookmarks are created then , draw bookmarkbar
    if (bookmarkList !== null) {
        let list = bookmarkList[url]
        if (list.length != 0) {
            // create navigation dots to scroll to the bookmark location
            for (bookmark of list) {
                let dot = getBookmarkDot(bookmark)
                bookmarkBar.appendChild(dot)
            }
            body.appendChild(bookmarkBar)
        }

    }
}


// retuns a div element indicating the navigation dot
function getBookmarkDot(bookmark) {
    let dot = document.createElement('div');
    dot.className = 'dot'
    dot.style.backgroundColor = bookmark.color;
    // dot.style.backgroundColor = '#E91E63';

    dot.title = 'Go to ➡️ ' + bookmark.title;

    // add click event to scroll to this bookmark
    addClickEvent(dot, bookmark)

    return dot;
}

// generates random hex color code for the bookmark dot
function getRandomColor() {
    let colors = ['#d32f2f', '#E91E63', '#8E24AA', '#33691E', '#FF6F00', '#3E2723', '#607D8B', '#FFEE58', '#8BC34A', '#2962FF']
    let randomColor = colors[Math.floor(Math.random() * colors.length)];
    return randomColor;
}


function addClickEvent(el, bookmark) {
    el.addEventListener('click', onDotClicked, false)

    function onDotClicked() {
        let scrollTo = bookmark.top - 50 > 0 ? bookmark.top - 50 : 0
        window.scrollTo(0, scrollTo)
    }
}


// chrome eventes 
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        let msg = request.msg;

        if (msg == 'getBookmarks') {
            let bookmarks = getBookmarksFromLocalStorage();
            sendResponse(bookmarks);
        }
        if (msg == 'deleteBookmark') {
            let index = request.index;
            deleteBookmark(index)
            drawBookmarkBar();
            sendResponse(getBookmarksFromLocalStorage());
        }
    }
);


function getBookmarksFromLocalStorage() {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {}
    let currentURL = window.location.href;
    if (bookmarks) {
        return bookmarks[currentURL]
    } else {
        bookmarks
    }
}

function deleteBookmark(index) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    let currentURL = window.location.href;
    let currentPageBookmarkList = bookmarks[currentURL];
    currentPageBookmarkList.splice(index, 1)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
}