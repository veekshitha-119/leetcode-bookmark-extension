const bookmark_img = chrome.runtime.getURL("assets/bookmark.png");
const problem_key="problem_key";
const observer=new MutationObserver(()=>{
    addbookmarkbtn();
})
observer.observe(document.body,{childList:true,subtree:true});
addbookmarkbtn();
function addbookmarkbtn(){
if(!window.location.pathname.startsWith('/problems/'))
    return ;
if(document.getElementById("add_button"))
        return;
const bookmarkbtn = document.createElement("img");

bookmarkbtn.id="add_button";
bookmarkbtn.src=bookmark_img;
bookmarkbtn.style.height="30px";
bookmarkbtn.style.width="30px";
bookmarkbtn.style.cursor = "pointer";
const temp = document.querySelector('.text-title-large');
temp.insertAdjacentElement("afterend",bookmarkbtn);
bookmarkbtn.addEventListener("click",bookmarkhandler);
}
async function bookmarkhandler(){
    const currbookmarks=await getcurrentbookmarks();
    const problemurl=window.location.href;
    const uniqueId=getProblemId(problemurl);
    const difficulty=document.querySelector('[class*="text-difficulty"]');
    const level=difficulty.innerText;
    console.log(level);
    const problemname=document.querySelector('.text-title-large').innerText;
     if(currbookmarks.some((bookmarks)=>bookmarks.id==uniqueId)){
        console.log("already bookmarked\n");
                return ;
     }
    const bookmarkobject={
        id:uniqueId,
        name:problemname,
        url:problemurl,
        difficulty:level,
    }
    const updatedbookmarks=[...currbookmarks,bookmarkobject];
    chrome.storage.sync.set({[problem_key]:updatedbookmarks},()=>{
        console.log("updated book marks to ",updatedbookmarks);
    });
}
function getProblemId(url) {
    const match = url.match(/problems\/([^\/?]+)/);
    return match ? match[1] : null;
}
function getcurrentbookmarks(){
    return new Promise((resolve,reject)=>{
       chrome.storage.sync.get([problem_key],(results)=>{
           resolve(results[problem_key] ? results[problem_key] : []);
    });
    });
}