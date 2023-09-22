const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var style = "";
document.addEventListener("DOMContentLoaded", function() {
  let autoScroll = true;
  const messagesContainer = document.getElementById("messages-container");
  messagesContainer.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
    autoScroll = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
  });
  const username = localStorage.getItem("username") || "\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641";
  if (username === "\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641") {
    window.location.href = "login.html";
  }
  document.getElementById("username").textContent = username;
  localStorage.setItem("username", username);
  const emojiButton = document.getElementById("emoji-button");
  const emojiMenu = document.getElementById("emoji-menu");
  async function fetchMessages() {
    const response = await fetch("https://alsafwaautopartsest.com/testchat/androidapi.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    return data;
  }
  async function sendMessage(username2, message, audio_url, attachment_url, reply_to, originalMessagePart) {
    const payload = {
      username: username2,
      message,
      audio_url,
      attachment_url,
      reply_to,
      originalMessagePart
    };
    const response = await fetch("https://alsafwaautopartsest.com/testchat/androidapi.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return data;
  }
  async function deleteMessage(id) {
    const response = await fetch("https://alsafwaautopartsest.com/testchat/androidapi.php", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });
    return await response.json();
  }
  async function updateMessage(id, newMessage) {
    const response = await fetch("https://alsafwaautopartsest.com/testchat/androidapi.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, new_message: newMessage })
    });
    return await response.json();
  }
  async function replyToMessage(id, replyMessage) {
    const response = await fetch("https://alsafwaautopartsest.com/testchat/androidapi.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, message: replyMessage, reply_to: id })
    });
    return await response.json();
  }
  function addEventHandlers(messageDiv, message) {
    const editButton = messageDiv.querySelector(".edit-button");
    const copyButton = messageDiv.querySelector(".copy-button");
    const deleteButton = messageDiv.querySelector(".delete-button");
    const replyButton = messageDiv.querySelector(".reply-button");
    document.getElementById("toast");
    document.getElementById("toast-message");
    if (editButton) {
      editButton.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color: #ffffff;"></i>';
      editButton.addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById("edit-toast").classList.add("show");
        const editInput = document.getElementById("edit-input");
        const editConfirm = document.getElementById("edit-confirm");
        editInput.value = message.message;
        editConfirm.onclick = () => {
          const newMessage = editInput.value;
          if (newMessage) {
            updateMessage(message.id, newMessage).then((response) => {
              if (response.success) {
                messageDiv.querySelector("p").textContent = newMessage + " (\u062A\u0645 \u0627\u0644\u062A\u0639\u062F\u064A\u0644)";
                document.getElementById("edit-toast").classList.remove("show");
                showToast("\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0628\u0646\u062C\u0627\u062D");
              }
            });
          }
        };
      });
    }
    if (copyButton) {
      copyButton.innerHTML = '<i class="fa-solid fa-copy" style="color: #ffffff;"></i>';
      copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(message.message);
        showToast("\u062A\u0645 \u0646\u0633\u062E \u0627\u0644\u0631\u0633\u0627\u0644\u0629 ");
      });
    }
    if (deleteButton) {
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.addEventListener("click", () => {
        const confirmDelete = confirm("\u0647\u0644 \u062A\u0631\u064A\u062F \u062D\u0630\u0641 \u0627\u0644\u0631\u0633\u0627\u0644\u0629\u061F");
        if (confirmDelete) {
          deleteMessage(message.id).then((response) => {
            if (response.success) {
              messageDiv.remove();
            }
          });
        }
      });
    }
    if (replyButton) {
      replyButton.innerHTML = '<i class="fa-solid fa-reply" style="color: #ffffff;"></i>';
      replyButton.addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById("reply-toast").classList.add("show");
        const replyInput = document.getElementById("reply-input");
        const replyConfirm = document.getElementById("reply-confirm");
        replyConfirm.onclick = () => {
          const replyMessage = replyInput.value;
          if (replyMessage) {
            replyToMessage(message.id, replyMessage).then((response) => {
              if (response.success) {
                document.getElementById("reply-toast").classList.remove("show");
                showToast("\u062A\u0645 \u0627\u0644\u0631\u062F \u0628\u0646\u062C\u0627\u062D");
                replyInput.value = "";
              }
            });
          }
        };
      });
    }
  }
  document.addEventListener("click", (e) => {
    if (!document.getElementById("edit-toast-frame").contains(e.target)) {
      document.getElementById("edit-toast").classList.remove("show");
    }
    if (!document.getElementById("reply-toast-frame").contains(e.target)) {
      document.getElementById("reply-toast").classList.remove("show");
    }
  });
  let lastMessageId = 0;
  async function fetchAndDisplayMessages() {
    const data = await fetchMessages();
    const messagesContainer2 = document.getElementById("messages-container");
    if (data.messages.length > 0) {
      const newLastMessageId = data.messages[data.messages.length - 1].id;
      if (newLastMessageId !== lastMessageId || newLastMessageId < lastMessageId) {
        messagesContainer2.innerHTML = "";
        data.messages.forEach((message) => {
          let messageClass = "other-message";
          let adminLabel = "";
          if (message.username === username) {
            messageClass = "own-message";
          } else if (message.userId === 9 && message.username === "Ahmed Gad") {
            messageClass = "special-message";
            adminLabel = '<span class="admin-label">Admin</span><br>';
          }
          const messageDiv = document.createElement("div");
          messageDiv.className = `message ${messageClass}`;
          let buttonsHTML = "";
          if (messageClass === "own-message") {
            buttonsHTML = `<button class="edit-button">Edit</button><button class="copy-button">Copy</button><button class="delete-button">Delete</button>`;
          } else {
            buttonsHTML = `<button class="reply-button">Reply</button><button class="copy-button">Copy</button>`;
          }
          messageDiv.id = `message-${message.id}`;
          let attachmentHTML = "";
          if (message.attachment_url) {
            attachmentHTML = `<img src="${message.attachment_url}" alt="Attachment" width="200" style="display: block; margin: auto;">`;
          }
          if (message.audio_url) {
            attachmentHTML = `<audio controls><source src="${message.audio_url}" type="audio/wav"></audio>`;
          }
          const truncatedOriginalMessagePart = message.originalMessagePart ? message.originalMessagePart.substring(0, 50) : "";
          const truncatedOriginalMessagePartHTML = truncatedOriginalMessagePart.replace(/\n/g, "<br>");
          const editedMessageHTML = message.edited ? "\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0645\u062D\u062A\u0648\u064A \u0627\u0644\u0631\u0633\u0627\u0644\u0629" : "";
          let frameOriginal = truncatedOriginalMessagePartHTML ? `<div class="frame-reply" data-reply-to="${message.reply_to}"><h4>${truncatedOriginalMessagePartHTML}</h4></div>` : "";
          let frameEdited = editedMessageHTML ? `<div class="frame-edit"><h4>${editedMessageHTML}</h4></div>` : "";
          messageDiv.innerHTML = `${adminLabel}${frameOriginal}<span class="message-username">${message.username}<br></span><span class="message-timestamp">${message.timestamp}</span>${frameEdited}<p>${message.message}</p>${attachmentHTML}${buttonsHTML}`;
          messagesContainer2.appendChild(messageDiv);
          addEventHandlers(messageDiv, message);
        });
        lastMessageId = newLastMessageId;
      }
    }
    if (autoScroll) {
      messagesContainer2.scrollTop = messagesContainer2.scrollHeight;
    }
  }
  const replyFrames = document.querySelectorAll(".frame-reply");
  replyFrames.forEach((frame) => {
    frame.addEventListener("click", function() {
      const originalMessageId = frame.getAttribute("data-original-message-id");
      const originalMessageElement = document.getElementById(`message-${originalMessageId}`);
      if (originalMessageElement) {
        originalMessageElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
  let highlightedMessage = null;
  document.addEventListener("click", function(event) {
    let targetElement = event.target;
    if (highlightedMessage) {
      highlightedMessage.style.backgroundColor = "";
    }
    if (targetElement.tagName.toLowerCase() === "h4") {
      targetElement = targetElement.closest(".frame-reply");
    }
    if (targetElement && targetElement.classList.contains("frame-reply")) {
      const replyToId = targetElement.getAttribute("data-reply-to");
      const messageElement = document.getElementById(`message-${replyToId}`);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: "smooth" });
        messageElement.style.backgroundColor = "lightyellow";
        highlightedMessage = messageElement;
      }
    }
  });
  emojiButton.addEventListener("click", () => {
    emojiMenu.style.display = emojiMenu.style.display === "none" ? "block" : "none";
  });
  emojiMenu.addEventListener("click", (event) => {
    if (event.target.nodeName === "SPAN") {
      const messageInput2 = document.getElementById("message");
      messageInput2.value += event.target.textContent;
      messageInput2.focus();
    }
  });
  let isRecording = false;
  let mediaRecorder;
  let stream;
  document.getElementById("record");
  const icon = document.querySelector("#record i");
  document.getElementById("record").addEventListener("click", function() {
    const mediaConstraints = { audio: true };
    if (isRecording) {
      mediaRecorder.stop();
      isRecording = false;
      icon.className = "fas fa-microphone";
    } else {
      navigator.mediaDevices.getUserMedia(mediaConstraints).then((s) => {
        stream = s;
        mediaRecorder = new MediaRecorder(stream);
        let audioChunks = [];
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const formData = new FormData();
          formData.append("file", audioBlob);
          const response = await fetch("https://alsafwaautopartsest.com/testchat/upload_audio.php", {
            method: "POST",
            body: formData
          });
          const data = await response.json();
          if (data.success) {
            sendMessage(username, "", data.url, null, null, null);
          }
        };
        mediaRecorder.start();
        isRecording = true;
        icon.className = "fa-solid fa-record-vinyl";
      });
    }
  });
  let selectedFile;
  document.getElementById("images").addEventListener("click", function() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.addEventListener("change", async () => {
      selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        const thumbnail = document.getElementById("thumbnail");
        const thumbnailContainer = document.getElementById("thumbnail-container");
        thumbnail.src = e.target.result;
        thumbnailContainer.style.display = "block";
      };
      reader.readAsDataURL(selectedFile);
      const formData = new FormData();
      formData.append("file", selectedFile);
      document.getElementById("loading-overlay").style.display = "block";
      const response = await fetch("https://alsafwaautopartsest.com/testchat/upload_image.php", {
        method: "POST",
        body: formData
      });
      document.getElementById("loading-overlay").style.display = "none";
      const data = await response.json();
      if (data.success) {
        showToast("\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0635\u0648\u0631\u0629 \u0628\u0646\u062C\u0627\u062D");
        attachmentURL = data.url;
      }
    });
  });
  function showToast(message, duration = 3e3) {
    const toast = document.getElementById("toast-photo");
    const toastMessage = document.getElementById("toast-message");
    toastMessage.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, duration);
  }
  let attachmentURL = null;
  document.getElementById("send").addEventListener("click", async function() {
    document.getElementById("messages-container");
    const message = document.getElementById("message").value;
    if (message.trim() === "" && !attachmentURL) {
      alert("\u0644\u0627 \u062A\u0648\u062C\u062F \u0631\u0633\u0627\u0644\u0629 \u0623\u0648 \u0635\u0648\u0631\u0629 \u0644\u0644\u0625\u0631\u0633\u0627\u0644");
      return;
    }
    const sendResponse = await sendMessage(username, message.trim(), null, attachmentURL, null, null);
    if (sendResponse.success) {
      await fetchAndDisplayMessages();
      const thumbnailContainer = document.getElementById("thumbnail-container");
      thumbnailContainer.style.display = "none";
      attachmentURL = null;
      document.getElementById("message").focus();
    }
    document.getElementById("message").value = "";
  });
  fetchAndDisplayMessages();
  setInterval(fetchAndDisplayMessages, 1e3);
  const messageInput = document.getElementById("message");
  messageInput.addEventListener("keydown", async function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      document.getElementById("messages-container");
      const message = messageInput.value;
      if (message.trim() === "" && !attachmentURL) {
        alert("\u0644\u0627 \u062A\u0648\u062C\u062F \u0631\u0633\u0627\u0644\u0629 \u0623\u0648 \u0635\u0648\u0631\u0629 \u0644\u0644\u0625\u0631\u0633\u0627\u0644");
        return;
      }
      const sendResponse = await sendMessage(username, message.trim(), null, attachmentURL, null, null);
      if (sendResponse.success) {
        await fetchAndDisplayMessages();
        const thumbnailContainer = document.getElementById("thumbnail-container");
        thumbnailContainer.style.display = "none";
        attachmentURL = null;
        document.getElementById("message").focus();
      }
      messageInput.value = "";
    }
  });
  document.getElementById("delete-my-messages").addEventListener("click", function() {
    document.getElementById("delete-toast").style.display = "block";
  });
  document.getElementById("delete-confirm").addEventListener("click", async function() {
    document.getElementById("delete-toast").style.display = "none";
    const response = await fetch("https://alsafwaautopartsest.com/testchat/delete_my_messages.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username })
    });
    const data = await response.json();
    if (data.success) {
      showToast("\u062A\u0645 \u062D\u0630\u0641 \u062C\u0645\u064A\u0639 \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u0628\u0646\u062C\u0627\u062D");
      fetchAndDisplayMessages();
    } else {
      showToast("\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062D\u0630\u0641 \u0627\u0644\u0631\u0633\u0627\u0626\u0644");
    }
  });
  document.getElementById("delete-cancel").addEventListener("click", function() {
    document.getElementById("delete-toast").style.display = "none";
  });
  document.getElementById("privacy").addEventListener("click", function() {
    window.location.href = "privacy-policy.html";
  });
  document.getElementById("logout").addEventListener("click", function() {
    localStorage.removeItem("username");
    showToast("\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C");
    window.location.href = "login.html";
  });
  document.getElementById("delete-user").addEventListener("click", function() {
    document.getElementById("confirmation-toast").classList.remove("hidden");
    document.getElementById("confirm-delete").addEventListener("click", function() {
      document.getElementById("confirmation-toast").classList.add("hidden");
      var username2 = localStorage.getItem("username");
      var userId = localStorage.getItem("userId");
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://alsafwaautopartsest.com/testchat/delete-user-account.php", true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          if (data.success) {
            fetchAndDisplayMessages();
            showToast("\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u062D\u0633\u0627\u0628 \u0628\u0646\u062C\u0627\u062D\u060C \u0633\u064A\u062A\u0645 \u0646\u0642\u0644\u0643 \u0625\u0644\u0649 \u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629 \u0628\u0639\u062F 5 \u062B\u0648\u0627\u0646\u064A.");
            let counter = 5;
            const interval = setInterval(function() {
              showToast(`\u0633\u064A\u062A\u0645 \u0646\u0642\u0644\u0643 \u0641\u064A ${counter} \u062B\u0648\u0627\u0646\u064A`);
              counter--;
              if (counter < 0) {
                localStorage.removeItem("username");
                clearInterval(interval);
                window.location.href = "https://alsafwaautopartsest.com";
              }
            }, 1e3);
          } else {
            showToast("\u062D\u062F\u062B \u062E\u0637\u0623: " + data.error);
          }
        }
      };
      xhr.send(JSON.stringify({ username: username2, id: userId }));
    });
    document.getElementById("cancel-delete").addEventListener("click", function() {
      document.getElementById("confirmation-toast").classList.add("hidden");
    });
  });
  document.addEventListener("click", function(event) {
    if (event.target.tagName.toLowerCase() === "img") {
      const modal = document.getElementById("imageModal");
      const modalImg = document.getElementById("modalImage");
      modalImg.src = event.target.src;
      modal.style.display = "block";
    }
  });
  document.getElementById("closeImageModal").addEventListener("click", function() {
    document.getElementById("imageModal").style.display = "none";
  });
});
