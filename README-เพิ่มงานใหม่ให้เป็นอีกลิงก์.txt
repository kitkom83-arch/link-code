วิธีเพิ่มอีกงานให้เป็นอีกลิงก์
===============================

ตัวอย่างต้องการลิงก์ใหม่:
  /free100/

ทำแบบนี้:
  1) Copy โฟลเดอร์ template-campaign
  2) Paste ไว้ในโฟลเดอร์หลัก bn9-multi-link-worker-pack
  3) เปลี่ยนชื่อโฟลเดอร์ที่ copy เป็น free100
  4) เปิด free100/EDIT-HERE.js
  5) แก้ลิงก์ / ข้อความ / code / รูป
  6) Save
  7) กลับ Cloudflare Worker เดิม bn9-code
  8) New deployment
  9) อัปโหลดโฟลเดอร์ bn9-multi-link-worker-pack ทั้งก้อน
  10) Deploy

ลิงก์ที่ได้:
  https://bn9-code.sareingsaehx.workers.dev/free100/

ถ้าผูกโดเมน code.bn9.one แล้ว จะได้:
  https://code.bn9.one/free100/

ถ้าอยากให้หน้า campaign-list.html แสดง free100 ด้วย:
  เปิด campaign-list.js
  เพิ่มบรรทัดนี้:
    { name: "free100", path: "/free100/" },

ไม่เพิ่มก็ได้ ลิงก์ /free100/ ยังเปิดได้อยู่

