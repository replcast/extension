const copy = (text) => {
  var textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = 0;
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  textArea.style.opacity = "0";
  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Copying text command was " + msg);
  } catch (err) {
    console.log("Oops, unable to copy");
  }

  document.body.removeChild(textArea);
};

window.resetListener = () => {
  try {
    const objects = document.querySelectorAll(".cm-content");
    console.log(`Found ${objects.length} instances`);
    objects.forEach((object) => {
      object.addEventListener("keyup", () => {
        chrome.runtime.sendMessage({
          type: "updateCast",
          content: object.innerText,
        });
      });
    });
  } catch {
    console.log("Failed to find initial element, waiting 2s");
    setTimeout(window.resetListener, 2000);
  }
};

chrome.runtime.onMessage.addListener((request) => {
  console.log("Setting up listener");
  console.log("Writing id");
  if (request.type == "copyCode") {
    copy(`https://replcast.micahlindley.com/?id=${request.id}`);
    console.log("Writing id");
  }
  window.resetListener();
  let checkReset = document.querySelectorAll(
    ".dir-node.root-node, .file-header"
  );
  checkReset.forEach((element) => {
    element.addEventListener("click", () => {
      console.log("Switching tabs");
      setTimeout(window.resetListener, 1000);
    });
  });

  try {
    window.addEventListener("beforeunload", () => {
      chrome.runtime.sendMessage({
        type: "killCast",
      });
      chrome.storage.local.set({ currentCast: "" });
    });
  } catch {
    console.log("Couldn't kill cast in time");
  }
});
