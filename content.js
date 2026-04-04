(function () {
  var active = false;
  var disabled = false;
  var observer = null;
  var chatObserver = null;

  function isVideoPage() {
    var path = location.pathname;
    return path.startsWith("/watch") || path.includes("/live/");
  }

  function clearPlayerSizingStyles() {
    var player = document.querySelector("#movie_player");
    if (!player) return;

    var videos = player.querySelectorAll("video.html5-main-video, video.video-stream, video");

    for (var i = 0; i < videos.length; i++) {
      videos[i].style.removeProperty("width");
      videos[i].style.removeProperty("height");
      videos[i].style.removeProperty("left");
      videos[i].style.removeProperty("top");
    }
  }

  function resetPlayerSizingAfterFullBrowserExit() {
    clearPlayerSizingStyles();

    requestAnimationFrame(function () {
      window.dispatchEvent(new Event("resize"));
    });
  }

  function enterFullBrowser() {
    if (active || disabled) return;

    var flexy = document.querySelector("ytd-watch-flexy");
    var sizeBtn = document.querySelector(".ytp-size-button");

    if (flexy && !flexy.hasAttribute("theater") && sizeBtn) {
      sizeBtn.click();
    }

    document.body.classList.add("yt-full-browser");
    active = true;

    setTimeout(closeLiveChat, 500);
    observeChat();
  }

  function leaveFullBrowser() {
    if (!active) return;
    document.body.classList.remove("yt-full-browser");
    active = false;
    resetPlayerSizingAfterFullBrowserExit();
    if (chatObserver) {
      chatObserver.disconnect();
      chatObserver = null;
    }
  }

  function update() {
    if (isVideoPage() && !disabled) {
      waitForPlayer(enterFullBrowser);
    } else {
      leaveFullBrowser();
    }
  }

  function waitForPlayer(callback) {
    var player = document.querySelector("#movie_player");
    if (player) {
      callback();
      observePlayer();
    } else {
      var interval = setInterval(function () {
        var player = document.querySelector("#movie_player");
        if (player) {
          clearInterval(interval);
          callback();
          observePlayer();
        }
      }, 250);
    }
  }

  function observePlayer() {
    var player = document.querySelector("#movie_player");
    if (!player) return;

    if (observer) observer.disconnect();

    observer = new MutationObserver(function () {
      var flexy = document.querySelector("ytd-watch-flexy");
      var isTheaterOn = flexy && flexy.hasAttribute("theater");

      if (!isTheaterOn && active) {
        disabled = true;
        leaveFullBrowser();
        return;
      }

      if (isVideoPage() && !disabled && !document.body.classList.contains("yt-full-browser")) {
        enterFullBrowser();
      }
    });

    observer.observe(player, { childList: true, subtree: true });
  }

  function closeLiveChat() {
    if (!active || disabled) return;
    var panels = document.querySelectorAll("ytd-engagement-panel-section-list-renderer");
    for (var i = 0; i < panels.length; i++) {
      if (panels[i].querySelector("ytd-live-chat-frame")) {
        var dismissBtn = panels[i].querySelector("#dismiss-button");
        if (dismissBtn) dismissBtn.click();
        setTimeout(function () { window.dispatchEvent(new Event("resize")); }, 0);
      }
    }
  }

  function observeChat() {
    var flexy = document.querySelector("ytd-watch-flexy");
    if (!flexy) return;

    if (chatObserver) chatObserver.disconnect();

    chatObserver = new MutationObserver(function () {
      closeLiveChat();
    });

    chatObserver.observe(flexy, { childList: true, subtree: true });
  }

  function reapplyFullBrowser() {
    if (!active || !isVideoPage()) return;

    var flexy = document.querySelector("ytd-watch-flexy");
    var sizeBtn = document.querySelector(".ytp-size-button");

    if (flexy && !flexy.hasAttribute("theater") && sizeBtn) {
      sizeBtn.click();
    }

    if (!document.body.classList.contains("yt-full-browser")) {
      document.body.classList.add("yt-full-browser");
    }
  }

  window.addEventListener("resize", reapplyFullBrowser);

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" && e.key !== "'") return;
    if (document.fullscreenElement) return;

    if (disabled) {
      disabled = false;
      update();
      setTimeout(function () { window.dispatchEvent(new Event("resize")); }, 0);
    } else if (active) {
      disabled = true;
      leaveFullBrowser();
    }
  });

  document.addEventListener("yt-navigate-finish", function () {
    disabled = false;
    active = false;
    update();
  });

  update();
})();
