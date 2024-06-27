// when extension is installed for first time, set default values


chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.sync.set({
        toggleSitesActive: false,
        toggleSitesList: 'example.com'
    }, () => {});
});

// set up the initial chrome storage values

let toggleSitesActive = false;
let toggleSitesList = 'example.com';

// replace the initial values above with ones from synced storaage
chrome.storage.sync.get([
    'toggleSitesActive',
    'toggleSitesList'
],(result)=>{
    toggleSitesActive = result.toggleSitesActive;
    toggleSitesList = result.toggleSitesList;
});

//This is beccause storage sync get is async function and doesnt block the script processing. As the extension needs values to start with, this sets those values to remove null errors

//oneach site request

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {


        if (!toggleSitesActive){
            return {cancel: false};
        }

        let cancel = toggleSitesList.split(/\n/)
            .some(site => {
                let url = new URL(details.url);

                return Boolean(url.hostname.indexOf(site) !== -1);
            });
        return {cancel: cancel};
    },
    {
        urls: ["<all_urls>"]
    },
    [
        "blocking"
    ]
);


// listener for chromestorage onchange event. Need to update global scope vairables.

chrome.storage.onChanged.addListener((changes,namespace) => {
    if( namespace === 'sync'){
        if(changes.toggleSitesActive){
            toggleSitesActive = changes.toggleSitesActive.newValue;
        }
        if(changes.toggleSitesList){
            toggleSitesList = changes.toggleSitesList.newValue;
        }
    }
})