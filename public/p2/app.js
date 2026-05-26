(function () {
  "use strict";

  const config = window.BN9_SITE_CONFIG || {};
  const page = document.body.dataset.page;

  function safeText(value, fallback) {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  }

  function setImage() {
    const img = document.getElementById("heroImage");
    if (!img) return;
    img.src = safeText(config.page1 && config.page1.image, "assets/hero-card.png");
  }

  function setFooter() {
    const footerText = document.getElementById("footerText");
    const footerLink = document.getElementById("footerLink");
    const text = safeText(config.footer && config.footer.text, "www.BN9.ONE");
    const link = safeText(config.footer && config.footer.link, "https://www.BN9.ONE");

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

  function injectSpinStyles() {
    if (document.getElementById("bn9-spin-style")) return;

    const style = document.createElement("style");
    style.id = "bn9-spin-style";
    style.textContent = `
      .main-button.is-waiting {
        opacity: 0.82;
        cursor: wait;
      }

      .phone.is-spinning .slot-machine-hero {
        animation: cabinet-jackpot 0.46s cubic-bezier(0.2, 0.8, 0.2, 1) infinite !important;
      }

      .phone.is-spinning .slot-machine-hero .machine-reels span {
        animation: bn9-reel-run 0.18s linear infinite !important;
      }

      .phone.is-spinning .slot-machine-hero .machine-reels span:nth-child(2) {
        animation-delay: 0.04s !important;
      }

      .phone.is-spinning .slot-machine-hero .machine-reels span:nth-child(3) {
        animation-delay: 0.08s !important;
      }

      .phone.is-spinning .slot-machine-hero .machine-handle {
        transform-origin: 50% 8px;
        animation: bn9-handle-pull 3s ease-in-out forwards !important;
      }

      .phone.is-spinning .slot-lights i {
        animation-duration: 0.18s !important;
      }

      @keyframes bn9-reel-run {
        0% { transform: translateY(-20px); filter: blur(2px); }
        50% { transform: translateY(20px); filter: blur(3px); }
        100% { transform: translateY(-20px); filter: blur(2px); }
      }

      @keyframes bn9-handle-pull {
        0% { transform: rotate(0deg); }
        12% { transform: rotate(36deg); }
        26% { transform: rotate(-8deg); }
        42% { transform: rotate(28deg); }
        58% { transform: rotate(-5deg); }
        78% { transform: rotate(16deg); }
        100% { transform: rotate(0deg); }
      }
    `;
    document.head.appendChild(style);
  }

  function getSpinDelay(p1) {
    const configuredDelay = Number(p1.afterActionDelayMs);
    return Number.isFinite(configuredDelay) ? Math.max(configuredDelay, 3000) : 3000;
  }

  function runSlotSpin(phone, durationMs) {
    return new Promise(function (resolve) {
      const delay = Number.isFinite(Number(durationMs)) ? Number(durationMs) : 3000;

      if (!phone) {
        window.setTimeout(resolve, delay);
        return;
      }

      const reels = Array.prototype.slice.call(phone.querySelectorAll(".machine-reels span"));
      const symbols = ["0", "1", "2", "3", "5", "7", "8", "9", "BN9"];
      let tick = 0;

      phone.classList.remove("is-spinning");
      void phone.offsetWidth;
      phone.classList.add("is-spinning");

      const intervalId = window.setInterval(function () {
        reels.forEach(function (reel, index) {
          const randomOffset = Math.floor(Math.random() * symbols.length);
          reel.textContent = symbols[(tick + index * 3 + randomOffset) % symbols.length];
        });
        tick += 1;
      }, 70);

      window.setTimeout(function () {
        window.clearInterval(intervalId);
        reels.forEach(function (reel) {
          reel.textContent = "7";
        });
        resolve();
      }, delay);
    });
  }

  function openActionUrl(actionUrl) {
    if (!actionUrl) return;
    const opened = window.open(actionUrl, "_blank", "noopener,noreferrer");
    if (!opened) {
      window.location.href = actionUrl;
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
    let actionInProgress = false;

    if (text) text.textContent = safeText(p1.buttonText, "รีทวิส & รับโค้ด");
    setActionIcon(icon, p1);

    if (button) {
      button.addEventListener("click", function () {
        if (actionInProgress) return;
        actionInProgress = true;

        const actionUrl = makeActionUrl();
        const nextPage = safeText(p1.nextPage, "code.html");
        const spinDelay = getSpinDelay(p1);
        const afterOpenDelay = 700;

        button.disabled = true;
        button.classList.add("is-waiting");
        button.setAttribute("aria-busy", "true");

        runSlotSpin(phone, spinDelay).then(function () {
          openActionUrl(actionUrl);

          window.setTimeout(function () {
            if (phone) phone.classList.remove("is-spinning");
            button.disabled = false;
            button.classList.remove("is-waiting");
            button.removeAttribute("aria-busy");
            actionInProgress = false;
            window.location.href = nextPage;
          }, afterOpenDelay);
        });
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
    const loginUrl = safeText(p2.loginEmbedUrl, "https://www.BN9.ONE");
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

  injectSpinStyles();
  setImage();
  setFooter();

  if (page === "home") initHome();
  if (page === "code") initCode();
})();
