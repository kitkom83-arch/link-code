BN9 Multi Link Worker Pack
==========================

ไฟล์ชุดนี้ทำมาเพื่อ Cloudflare Worker Static Files
เป้าหมาย: อัป Worker เดิมได้ และเพิ่มงานใหม่เป็นลิงก์ใหม่ด้วยชื่อโฟลเดอร์

ลิงก์หลักเดิม:
  https://bn9-code.sareingsaehx.workers.dev/

ตัวอย่างลิงก์งานย่อย:
  https://bn9-code.sareingsaehx.workers.dev/free50/
  https://bn9-code.sareingsaehx.workers.dev/retweet01/
  https://bn9-code.sareingsaehx.workers.dev/follow01/
  https://bn9-code.sareingsaehx.workers.dev/post01/

วิธีอัป:
  1) แตก ZIP
  2) เข้า Cloudflare > Workers & Pages > bn9-code
  3) กด New deployment
  4) อัปโหลดโฟลเดอร์ bn9-multi-link-worker-pack ทั้งก้อน
  5) กด Deploy

ข้อสำคัญ:
  - อย่าอัปเฉพาะ free50 หรือเฉพาะงานเดียว
  - ให้อัปโฟลเดอร์หลักทั้งก้อนเสมอ เพราะข้างในมีงานเก่า + งานใหม่
  - ถ้าอัปเฉพาะงานใหม่ งานเก่าอาจหายจาก deployment ล่าสุด

เช็กลิงก์ทั้งหมด:
  เปิด /campaign-list.html

