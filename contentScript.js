(() => {
    let youtubeLeftControl, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmark = [];

    chrome.runtime.onMessage.addListener((obj, sender, res) => {
        const { type, value, videoId } = obj;

        if(type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        }
    })

    const fetchBookmark = () => {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
                }
            })
        })
    }

    const newVideoLoaded = async () => {
        const bookmarkBtnExist = document.getElementsByClassName('bookmark-btn')[0];

        currentVideoBookmark = await fetchBookmark();
        console.log(currentVideoBookmark)
        if(!bookmarkBtnExist){
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button" + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";
            youtubeLeftControl = document.getElementsByClassName('ytp-left-controls')[0];
            youtubePlayer = document.getElementsByClassName('video-stream')[0];

            youtubeLeftControl.appendChild(bookmarkBtn);
            bookmarkBtn.addEventListener('click', addNewBookmarkEventHandler);

        }
    }
    
    const addNewBookmarkEventHandler = async () => {
        try {
            const currentTime = youtubePlayer.currentTime;
            const newBookmark = {
            time: currentTime,
            desc: "Your book mark is at " + getTime(currentTime)
        }
        
        console.log(currentVideoBookmark)
        currentVideoBookmark = await fetchBookmark();
        console.log(currentVideoBookmark)

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmark, newBookmark].sort((a,b) => a.time - b.time))
        })
        console.log("currentVideoBookmark is", currentVideoBookmark)
        }
        catch(error) {
            console.log("An error occured: ", error)
        }
        
    }

    newVideoLoaded();
})();

const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);
    return date.toISOString().substring(11,19);
}
