import {getSiteData, getPost, getMorePost} from "./API_Connection.js"

document.addEventListener("DOMContentLoaded", () => {
    getSiteData()
    getPost()
    getMorePost()
})