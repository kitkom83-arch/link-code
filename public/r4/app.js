(function () {
  "use strict";

  const config = window.BN9_SITE_CONFIG || {};
  const page = document.body.dataset.page;

  function safeText(value, fallback) {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  }

  function resolveHeroVideoSrc(src) {
    return src.indexOf("assets/videos/") === 0 ? "/" + src : src;
  }

  function setHeroMedia() {
    const img = document.getElementById("heroImage");
    const video = document.getElementById("heroVideo");
    const imageSrc = safeText(config.page1 && config.page1.image, "assets/hero-card.png");
    const videoSrc = resolveHeroVideoSrc(safeText(config.page1 && config.page1.heroVideo, ""));

    if (img) {
      img.src = imageSrc;
      img.hidden = false;
    }

    if (!video) return;

    function useImageFallback() {
      video.classList.remove("is-visible");
      video.removeAttribute("src");
      video.load();
      if (img) img.hidden = false;
    }

    video.classList.remove("is-visible");
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("loop", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("playsinline", "");

    if (!videoSrc) {
      useImageFallback();
      return;
    }

    video.addEventListener("loadeddata", function () {
      video.classList.add("is-visible");
      if (img) img.hidden = true;
      video.play().catch(useImageFallback);
    }, { once: true });

    video.addEventListener("error", useImageFallback, { once: true });
    video.src = videoSrc;
    video.load();
  }

  function setFooter() {
    const footerText = document.getElementById("footerText");
    const footerLink = document.getElementById("footerLink");
    const text = safeText(config.footer && config.footer.text, "www.maha289.com");
    const link = safeText(config.footer && config.footer.link, "https://www.maha289.com");

    if (footerText) footerText.textContent = text;
    if (footerLink) footerLink.href = link;
  }

  function getTweetIdFromUrl(url) {
    const match = String(url || "").match(/(?:status|statuses)\/(\d+)/i);
    return match ? cleanTweetId(match[1]) : "";
  }

  function cleanTweetId(value) {
    const match = String(value || "").match(/\d{6,}/);
    const id = match ? match[0] : "";
    return id === "1234567890123456789" ? "" : id;
  }

  function isPlaceholderPostUrl(url) {
    return String(url || "").includes("1234567890123456789");
  }

  function cleanUsername(username) {
    return String(username || "")
      .replace(/^@/, "")
      .replace(/^https?:\/\/(?:www\.)?(?:x|twitter)\.com\//i, "")
      .split(/[/?#]/)[0]
      .trim();
  }

  function makeActionUrl() {
    const p1 = config.page1 || {};
    const actionType = safeText(p1.actionType, "retweet");
    const postUrl = safeText(p1.postUrl, "");
    const pageUrl = safeText(p1.pageUrl, "");
    const tweetId = cleanTweetId(p1.tweetId) || getTweetIdFromUrl(postUrl);
    const username = cleanUsername(p1.followUsername);
    const hashtags = String(p1.hashtags || "")
      .split(",")
      .map(function (item) {
        return item.trim().replace(/^#/, "");
      })
      .filter(Boolean)
      .join(",");

    switch (actionType) {
      case "retweet":
        if (tweetId) return "https://twitter.com/intent/retweet?tweet_id=" + encodeURIComponent(tweetId);
        return isPlaceholderPostUrl(postUrl) ? "" : postUrl;

      case "post": {
        const params = new URLSearchParams();
        const text = safeText(p1.postText, "");
        if (text) params.set("text", text);
        if (pageUrl) params.set("url", pageUrl);
        if (hashtags) params.set("hashtags", hashtags);
        return "https://twitter.com/intent/tweet?" + params.toString();
      }

      case "follow":
        if (username) return "https://twitter.com/intent/follow?screen_name=" + encodeURIComponent(username);
        return pageUrl || postUrl;

      case "openPost":
        return postUrl;

      case "openPage":
        return pageUrl;

      case "none":
      default:
        return "";
    }
  }

  function setActionIcon(icon, p1) {
    if (!icon) return;

    const iconImage = safeText(p1.iconImage, "");
    if (iconImage) {
      icon.innerHTML = "";
      const img = document.createElement("img");
      img.src = iconImage;
      img.alt = "";
      icon.appendChild(img);
      return;
    }

    icon.textContent = safeText(p1.iconText, "↻");
  }

  function initHome() {
    const p1 = config.page1 || {};
    const button = document.getElementById("actionButton");
    const icon = document.getElementById("buttonIcon");
    const text = document.getElementById("buttonText");
    const phone = document.getElementById("rewardPhone");

    if (text) text.textContent = safeText(p1.buttonText, "รีทวิส & รับโค้ด");
    setActionIcon(icon, p1);

    if (button) {
      button.addEventListener("click", function () {
        const actionUrl = makeActionUrl();
        const actionType = safeText(p1.actionType, "retweet");
        const nextPage = safeText(p1.nextPage, "code.html");
        const configuredDelay = Number(p1.afterActionDelayMs);
        const delay = Number.isFinite(configuredDelay) ? Math.max(configuredDelay, 760) : 800;
        const retweetDelay = 3000;

        if (phone) {
          phone.classList.remove("is-spinning");
          void phone.offsetWidth;
          phone.classList.add("is-spinning");
        }

        if (actionType === "retweet") {
          button.disabled = true;
          button.setAttribute("aria-busy", "true");

          if (actionUrl) {
            window.open(actionUrl, "_blank", "noopener,noreferrer");
          }

          window.setTimeout(function () {
            if (phone) phone.classList.remove("is-spinning");
            button.disabled = false;
            button.removeAttribute("aria-busy");
            window.location.href = nextPage;
          }, retweetDelay);
          return;
        }

        if (actionUrl) {
          window.open(actionUrl, "_blank", "noopener,noreferrer");
        }

        window.setTimeout(function () {
          window.location.href = nextPage;
        }, delay);
      });
    }
  }

  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const temp = document.createElement("textarea");
    temp.value = text;
    temp.setAttribute("readonly", "");
    temp.style.position = "fixed";
    temp.style.left = "-9999px";
    document.body.appendChild(temp);
    temp.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(temp);
    return ok;
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(function () {
      toast.classList.remove("show");
    }, 1600);
  }

  function initCode() {
    const p2 = config.page2 || {};
    const codeInput = document.getElementById("rewardCode");
    const copyButton = document.getElementById("copyButton");
    const codeHint = document.getElementById("codeHint");
    const loginButton = document.getElementById("loginButton");
    const embedWrap = document.getElementById("loginEmbedWrap");
    const embed = document.getElementById("loginEmbed");
    const phone = document.getElementById("rewardPhone");

    const rewardCode = safeText(p2.code, "xxxxxxxxxxxxxxxxxx");
    const loginUrl = safeText(p2.loginEmbedUrl, "https://www.maha289.com");
    const loginMode = safeText(p2.loginOpenMode, "new_tab");

    if (codeInput) codeInput.value = rewardCode;
    if (copyButton) copyButton.textContent = safeText(p2.copyButtonText, "copy");
    if (codeHint) codeHint.textContent = safeText(p2.codeHint, "กด copy โค้ดเก็บไว้และนำไปใช้หลังล็อคอินเข้าสู่ระบบ");
    if (loginButton) loginButton.textContent = safeText(p2.loginButtonText, "LOGIN");

    if (copyButton) {
      copyButton.addEventListener("click", async function () {
        try {
          await copyText(rewardCode);
          const oldText = safeText(p2.copyButtonText, "copy");
          copyButton.textContent = "copied";
          copyButton.classList.add("is-copy-done");
          if (phone) {
            phone.classList.remove("is-blasting");
            void phone.offsetWidth;
            phone.classList.add("is-blasting");
            window.setTimeout(function () {
              phone.classList.remove("is-blasting");
            }, 760);
          }
          showToast("คัดลอกโค้ดแล้ว");
          window.setTimeout(function () {
            copyButton.textContent = oldText;
            copyButton.classList.remove("is-copy-done");
          }, 1400);
        } catch (error) {
          window.alert("Copy ไม่สำเร็จ กรุณากดเลือกโค้ดแล้ว copy เองครับ");
        }
      });
    }

    if (loginButton) {
      loginButton.addEventListener("click", function () {
        if (loginMode === "embed") {
          if (embed && embedWrap) {
            embed.src = loginUrl;
            embedWrap.hidden = false;
            embedWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
          return;
        }

        if (loginMode === "same_tab") {
          window.location.href = loginUrl;
          return;
        }

        window.open(loginUrl, "_blank", "noopener,noreferrer");
      });
    }
  }

  setHeroMedia();
  setFooter();

  if (page === "home") initHome();
  if (page === "code") initCode();
})();
