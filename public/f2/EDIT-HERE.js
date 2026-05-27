/*
  ✅ แก้ไฟล์นี้ไฟล์เดียวพอ สำหรับงานนี้: f2

  วิธีใช้เร็ว:
  1) แก้ค่าในไฟล์นี้
  2) Save
  3) กลับไป Cloudflare Worker เดิม bn9-code
  4) กด New deployment
  5) อัปโหลดโฟลเดอร์หลัก bn9-multi-link-worker-pack ทั้งก้อน

  actionType ที่เลือกได้:
  - "retweet"  = เปิดหน้า Retweet โพสต์ แล้วไปหน้ารับโค้ด
  - "post"     = เปิดหน้าโพสต์ข้อความ + แฮชแท็ก แล้วไปหน้ารับโค้ด
  - "follow"   = เปิดหน้าฟอลโล่บัญชี แล้วไปหน้ารับโค้ด
  - "openPost" = เปิดลิงก์โพสต์ แล้วไปหน้ารับโค้ด
  - "openPage" = เปิดลิงก์เพจ/เว็บ แล้วไปหน้ารับโค้ด
  - "none"     = ไม่เปิดลิงก์อะไร ไปหน้ารับโค้ดอย่างเดียว
*/

window.BN9_SITE_CONFIG = {
  page1: {
    // รูปภาพหน้าแรก: ถ้าจะเปลี่ยนรูป ให้ใส่ไฟล์ใน assets/ แล้วแก้ชื่อนี้
    image: "assets/hero-card.png",

    // ไอคอน + ข้อความบนปุ่ม
    iconImage: "assets/retweet.svg",
    iconText: "↻",
    buttonText: "Repost & รับโค้ด",

    // ลิงก์โพสต์ / ลิงก์เพจ
    postUrl: "https://x.com/win80108/status/2056635832128389350",
    pageUrl: "https://www.maha289.com",

    // แอคชั่นบนปุ่ม: retweet / post / follow / openPost / openPage / none
    actionType: "retweet",

    // ใช้เมื่อ actionType = "post"
    postText: "ร่วมกิจกรรมกับ BN9.ONE",
    hashtags: "BN9,กิจกรรม",

    // ใช้เมื่อ actionType = "follow"
    followUsername: "win80108",

    // หลังเปิดแอคชั่น ให้รอกี่ ms แล้วค่อยไปหน้า 2
    afterActionDelayMs: 3000,
    nextPage: "code.html"
  },

  page2: {
    // Code ที่จะแสดงหน้า 2
    code: "JZDR8908UWXE9D8G",
    copyButtonText: "copy",
    codeHint: "กด copy โค้ดเก็บไว้และนำไปใช้หลังล็อคอินเข้าสู่ระบบ",

    // ลิงก์ LOGIN
    loginButtonText: "LOGIN",
    loginEmbedUrl: "https://www.maha289.com",

    // loginOpenMode: "new_tab" / "same_tab" / "embed"
    loginOpenMode: "new_tab"
  },

  // ข้อความ www + ลิงก์ด้านล่าง ใช้ทั้งหน้า 1 และหน้า 2
  footer: {
    text: "www.maha289.com",
    link: "https://www.maha289.com"
  }
};

