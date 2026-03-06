const problem_key="problem_key";
let currbookmarks=[];
const bookmarksec=document.getElementById("bookmarks");
let searchquery=document.getElementById("search");
let difficultyFilter=document.querySelector("#difficultyFilter");
let sorted=document.querySelector("#sortFilter");
const assetURLMap={
    "play":chrome.runtime.getURL("assets/play.png"),
    "delete":chrome.runtime.getURL("assets/delete.png")
}
document.addEventListener("DOMContentLoaded",()=>{
    chrome.storage.sync.get([problem_key],(data)=>{
         currbookmarks=data[problem_key]||[];
        veiwbookmarks(currbookmarks);
    })
});
function veiwbookmarks(bookmarks){
    bookmarksec.innerHTML="";
    if(bookmarks.length===0){
          bookmarksec.innerHTML="<i>no bookmarks to show<i>"
          bookmarksec.style.fontSize="15px";
          bookmarksec.style.textAlign="center";
          bookmarksec.style.fontWeight="bold";
          return ;
    }
    bookmarks.forEach(bookmark=>addnewbookmark(bookmark));
}
function addnewbookmark(bookmark){
    const newbookmark=document.createElement("div");
    const newbookmarktitle=document.createElement("div");
    const newbookmarkicons=document.createElement("div");
    const difficultyBadge = document.createElement("span");
     difficultyBadge.innerText = bookmark.difficulty;
     difficultyBadge.classList.add("difficulty");
    if(bookmark.difficulty==="Easy")
        difficultyBadge.style.color="green";
    else if(bookmark.difficulty==="Medium")
        difficultyBadge.style.color="orange";
    else
        difficultyBadge.style.color="Red";
    newbookmarktitle.innerText=bookmark.name;
    newbookmarktitle.append(difficultyBadge);
    newbookmarktitle.classList.add("bookmarktitle");
    setcontrolattributes(assetURLMap["play"],onplay,newbookmarkicons);
    setcontrolattributes(assetURLMap["delete"],ondelete,newbookmarkicons);
    newbookmarkicons.classList.add("bookmark-controls");
    newbookmark.appendChild(newbookmarktitle);
    newbookmark.appendChild(newbookmarkicons);
    bookmarksec.appendChild(newbookmark);
    newbookmark.classList.add("bookmark");
    newbookmark.setAttribute("url",bookmark.url);
     newbookmark.setAttribute("id",bookmark.id);
}
function setcontrolattributes(src,handler,parentdiv){
     const ele=document.createElement("img");
   ele.src=src;
   ele.addEventListener("click",handler);
   parentdiv.appendChild(ele);
}
function onplay(event){
  const problemurl=event.target.parentNode.parentNode.getAttribute("url");
  window.open(problemurl,"_blank");
}
function ondelete(event){
 const bookmarkitem=event.target.parentNode.parentNode;
 const problemid=event.target.parentNode.parentNode.getAttribute("id");
 bookmarkitem.remove();
 deleteItem(problemid);
}
function deleteItem(id){
    chrome.storage.sync.get([problem_key],(data)=>{
        const currbookmarks=data[problem_key]||[];
        const updatedbookmarks=currbookmarks.filter((bookmark)=>bookmark.id!==id)
         chrome.storage.sync.set({[problem_key]:updatedbookmarks})
    })
}
searchquery.addEventListener("input",searchbookmarks);
function searchbookmarks(event){
    const query=event.target.value.toLowerCase();
    const filtered = currbookmarks.filter((bookmark)=>
        bookmark.name.toLowerCase().includes(query)
    );
    veiwbookmarks(filtered);
}
difficultyFilter.addEventListener("change",changebookmarks);
function changebookmarks(event){
    const level = event.target.value;
    if(level==="all")
    {
        veiwbookmarks(currbookmarks);
        return ;
    }
    const filtered=currbookmarks.filter((bookmark)=>bookmark.difficulty===level);
    veiwbookmarks(filtered);
}
sorted.addEventListener("change", handleSort);
function handleSort(event){
    const type = event.target.value;

    if(type === "default"){
        veiwbookmarks(currbookmarks);
        return;
    }

    let sortedBookmarks = [...currbookmarks];

    sortBookmarks(type, sortedBookmarks);

    veiwbookmarks(sortedBookmarks);
}
function sortBookmarks(type, bookmarks){

    if(type === "problem no."){
        bookmarks.sort((a,b)=>{
            const numA = parseInt(a.name);
            const numB = parseInt(b.name);
            return numA - numB;
        });
    }

    else if(type === "difficulty"){
        const order = {Easy:1, Medium:2, Hard:3};
        bookmarks.sort((a,b)=>order[a.difficulty]-order[b.difficulty]);
    }
}
