new ClipboardJS("#code");
new ClipboardJS(".copy");
window.addEventListener("load", () => {
  chrome.storage.local.get(["currentCast"], (result) => {
    if (result.currentCast != undefined && result.currentCast != "") {
      document.querySelector("#visible").innerText = result.currentCast;
      document
        .querySelector("#code")
        .setAttribute("data-clipboard-text", result.currentCast);
      document
        .querySelector("#link")
        .setAttribute(
          "data-clipboard-text",
          `https://replcast.micahlindley.com/?id=${result.currentCast}`
        );
      document.querySelector("main").style.display = "block";
      document.querySelector("#start").style.display = "none";
    } else {
      document.querySelector("main").style.display = "none";
      document.querySelector("#start").style.display = "block";
    }
  });
});
