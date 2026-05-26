/*
  ✅ แก้ไฟล์นี้ไฟล์เดียวพอ สำหรับงานนี้: r1

  วิธีใช้เร็ว:
  1) แก้ค่าในไฟล์นี้
  2) Save
  3) รัน npm run check
  4) รัน npm run deploy

  หมายเหตุ:
  actionType: "retweet" ไม่สามารถกดรีโพสแทนลูกค้าได้
  ระบบจะเปิดโพสต์ X ให้ลูกค้าไปกดรีโพสเอง
  แล้วค่อยพาไปหน้ารับโค้ด
*/

window.BN9_SITE_CONFIG = {
  page1: {
    image: "assets/hero-card.png",

    iconImage: "assets/retweet.svg",
    iconText: "↻",
    buttonText: "เปิดโพสต์ X แล้วรับโค้ด",

    postUrl: "https://x.com/p_th9d/status/2058989682994893059",
    pageUrl: "https://www.BN9.ONE",

    actionType: "retweet",

    postText: "ร่วมกิจกรรมกับ BN9.ONE",
    hashtags: "BN9,กิจกรรม",

    followUsername: "p_th9d",

    afterActionDelayMs: 3000,
    nextPage: "code.html"
  },

  page2: {
    code: "onewwwbn9jo778",
    copyButtonText: "คัดลอกโค้ด",
    codeHint: "กดคัดลอกโค้ด แล้วนำไปใช้หลังล็อกอินเข้าสู่ระบบ",

    loginButtonText: "เข้าสู่ระบบ",
    loginEmbedUrl: "https://www.BN9.ONE",

    loginOpenMode: "new_tab"
  },

  footer: {
    text: "www.BN9.ONE",
    link: "https://www.BN9.ONE"
  }
};