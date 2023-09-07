import {getCurrentTab} from './utils.js'
// adding a new bookmark row to the popup
const addNewBookmark = (bookmarkElement, bookmark) => {
    const bookmarkTitleELement = document.createElement('div');
    const newBookmarkElement = document.createElement('div');

    bookmarkTitleELement.textContent = bookmark.desc;
    bookmarkTitleELement.className = 'bookmark-title';

    newBookmarkElement.id = 'bookmark' + bookmark.time;
    newBookmarkElement.className = 'bookmark';
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    newBookmarkElement.appendChild(bookmarkTitleELement);
    bookmarkElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmark) => {
    const bookmarkElement = document.getElementById('bookmarks');
    bookmarkElement.innerHTML = "";
    console.log("Inside viewbookmark")
    console.log(currentBookmark)
    if (currentBookmark.length > 0) {
        bookmarkElement.innerHTML = '<i class="row">Some Bookmarks to show </i>'
        for (let i = 0; i < currentBookmark.length; i++){
            const bookmark = currentBookmark[i];
            addNewBookmark(bookmarkElement, bookmark);
        }
    }
    else {
        bookmarkElement.innerHTML = '<i class="row">There is no Bookmarks to show </i>'
    }
};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getCurrentTab();
    const queryParameter = activeTab.url.split('?')[1];
    const urlParameter = new URLSearchParams(queryParameter);

    const currentVideo = urlParameter.get('v');
    console.log(currentVideo);
    if(currentVideo && activeTab.url.includes('youtube.com/watch')) {
        chrome.storage.sync.get([currentVideo], (data) => {
            try {
                console.log(data)
                const currentVideoBookmark = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
                console.log("CurrentVideoBookmark", currentVideoBookmark)
                viewBookmarks(currentVideoBookmark);
            }
            catch (error) {
                console.log(error)
            }
        })

        
    }
    else {
        const container = document.getElementsByClassName('container')[0];
        container.innerHTML = "<div class='title'>This is not a youtube page. </div>"
    }
});
