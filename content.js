console.log("Setting up listener");
window.resetListener = () => {
  try {
    document.querySelector(".cm-content").addEventListener(
      "keyup",
      (event) => {
        console.log("key:", event.keyCode);
        window.resetListener();
      },
      { once: true }
    );
    chrome.runtime.sendMessage({
      type: "updateCast",
      content: document.querySelector(".cm-content").innerText,
      cursorPosition: getCaretCharacterOffsetWithin(
        document.querySelector(".cm-content")
      ),
    });
  } catch {
    console.log("Failed to find initial element, waiting 2s");
    setTimeout(window.resetListener, 2000);
  }
};

window.addEventListener("load", () => {
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
});

window.addEventListener("beforeunload", () => {
  chrome.runtime.sendMessage({
    type: "killCast",
  });
});

function getCaretCharacterOffsetWithin(element) {
  var caretOffset = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}

chrome.runtime.onMessage.addListener((request) => {
  console.log("Writing id");
  if (request.type == "copyCode") {
    navigator.clipboard.writeText(request.id);
    console.log("Writing id");
  }
});
