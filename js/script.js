/* =====================================================================
   script.js — Portfolio Nguyễn Phú Quý (23150350)
   PHẦN 3: JavaScript cơ bản (mảng object, DOM, sự kiện form, arrow fn)
   PHẦN 4: JavaScript nâng cao (fetch + async/await, LocalStorage, try/catch)
   ===================================================================== */
'use strict';

/* ---------------------------------------------------------------------
   PHẦN 3.1 — Dữ liệu tĩnh: mảng object các kỹ năng
   (Kết hợp kỹ năng web + kỹ năng phân tích dữ liệu theo ngành học)
   --------------------------------------------------------------------- */
const danhSachKyNang = [
  { id: 1, ten: 'HTML5 / Semantic', mucDo: 85, nhom: 'Lập trình Web' },
  { id: 2, ten: 'CSS3 / SCSS', mucDo: 80, nhom: 'Lập trình Web' },
  { id: 3, ten: 'JavaScript (ES6+)', mucDo: 78, nhom: 'Lập trình Web' },
  { id: 4, ten: 'Python / Pandas', mucDo: 82, nhom: 'Phân tích dữ liệu' },
  { id: 5, ten: 'SQL', mucDo: 75, nhom: 'Cơ sở dữ liệu' },
  { id: 6, ten: 'Power BI / Trực quan hóa', mucDo: 70, nhom: 'Phân tích dữ liệu' },
  { id: 7, ten: 'Git & GitHub', mucDo: 72, nhom: 'Công cụ' },
  { id: 8, ten: 'Figma / UI Design', mucDo: 55, nhom: 'Thiết kế' }
];

/* Arrow function dùng lại nhiều lần: querySelector gọn */
const $ = (selector, scope = document) => scope.querySelector(selector);

/* ---------------------------------------------------------------------
   PHẦN 3.2 — Dùng map() + filter() để render kỹ năng ra DOM
   (Không hardcode trong HTML)
   --------------------------------------------------------------------- */
const renderKyNang = () => {
  const khung = $('#skills-list');
  if (!khung) return;

  const html = danhSachKyNang
    // filter: chỉ hiển thị kỹ năng đạt từ 60% trở lên
    .filter((kyNang) => kyNang.mucDo >= 60)
    // map: chuyển mỗi object thành 1 khối HTML
    .map(
      (kyNang) => `
        <article class="skill-card">
          <div class="skill-head">
            <h3 class="skill-name">${kyNang.ten}</h3>
            <span class="skill-level">${kyNang.mucDo}%</span>
          </div>
          <div class="progress" role="progressbar"
               aria-label="Mức độ thành thạo ${kyNang.ten}"
               aria-valuenow="${kyNang.mucDo}" aria-valuemin="0" aria-valuemax="100">
            <span class="progress-bar" style="width: ${kyNang.mucDo}%"></span>
          </div>
          <p class="skill-group">${kyNang.nhom}</p>
        </article>`
    )
    .join('');

  khung.innerHTML = html;
};

/* ---------------------------------------------------------------------
   PHẦN 3.3 — Xử lý sự kiện submit của form liên hệ
   (validate HTML5 đã có sẵn; JS validate bổ sung + thông báo rõ ràng)
   --------------------------------------------------------------------- */
const formLienHe = $('#contact-form');
const thongBaoForm = $('#form-message');

/* Arrow function hiển thị thông báo */
const hienThiThongBao = (noiDung, loai) => {
  if (!thongBaoForm) return;
  thongBaoForm.textContent = noiDung;
  thongBaoForm.classList.remove('is-error', 'is-success');
  thongBaoForm.classList.add(loai === 'success' ? 'is-success' : 'is-error');
};

/* Validate bổ sung bằng JavaScript, trả về mảng lỗi */
const kiemTraDuLieu = ({ fullname, phone, message }) => {
  const danhSachLoi = [];

  if (!fullname || fullname.trim().length < 2) {
    danhSachLoi.push('Họ và tên phải có ít nhất 2 ký tự.');
  }
  if (!/^(0|\+84)\d{9}$/.test((phone || '').trim())) {
    danhSachLoi.push('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0 (VD: 0901234567).');
  }
  if (!message || message.trim().length < 10) {
    danhSachLoi.push('Nội dung liên hệ phải có ít nhất 10 ký tự.');
  }
  return danhSachLoi;
};

if (formLienHe) {
  formLienHe.addEventListener('submit', (event) => {
    event.preventDefault(); // chặn reload trang

    const duLieu = Object.fromEntries(new FormData(formLienHe).entries());
    const danhSachLoi = kiemTraDuLieu(duLieu);

    if (danhSachLoi.length > 0) {
      hienThiThongBao(`⚠️ ${danhSachLoi.join(' ')}`, 'error');
      return;
    }

    hienThiThongBao(
      `✅ Cảm ơn ${duLieu.fullname.trim()}! Tin nhắn của bạn đã được ghi nhận. ` +
      `Mình sẽ phản hồi qua email ${duLieu.email} trong thời gian sớm nhất.`,
      'success'
    );
    formLienHe.reset();
  });
}

/* ---------------------------------------------------------------------
   PHẦN 4.1 + 4.2 + 4.4 — fetch + async/await, render DOM, try/catch
   --------------------------------------------------------------------- */
const DUONG_DAN_DU_LIEU = './js/data.json';

/* Arrow function tạo HTML cho 1 dự án */
const taoHtmlDuAn = (duAn) => `
  <article class="project-card">
    <p class="project-year">Năm ${duAn.namHoanThanh}</p>
    <h3>${duAn.ten}</h3>
    <p>${duAn.moTa}</p>
    <div class="project-tech">
      ${duAn.congNghe
        .split(',')
        .map((congNghe) => `<span>${congNghe.trim()}</span>`)
        .join('')}
    </div>
  </article>`;

async function taiDanhSachDuAn() {
  const luoi = $('#projects-grid');
  const oLoi = $('#projects-error');
  if (!luoi) return;

  try {
    const phanHoi = await fetch(DUONG_DAN_DU_LIEU);

    if (!phanHoi.ok) {
      throw new Error(`Không tải được data.json (HTTP ${phanHoi.status})`);
    }

    const danhSachDuAn = await phanHoi.json();
    luoi.innerHTML = danhSachDuAn.map(taoHtmlDuAn).join('');

    if (oLoi) oLoi.hidden = true;
  } catch (loi) {
    // 4.4 — Không để chương trình crash, log lỗi + báo cho người dùng
    console.error('❌ Lỗi khi tải danh sách dự án:', loi);

    if (oLoi) {
      oLoi.hidden = false;
      oLoi.textContent =
        'Không tải được danh sách dự án. Hãy chắc chắn bạn đang chạy trang qua Live Server (http://localhost), không mở trực tiếp file://.';
    }
  }
}

/* ---------------------------------------------------------------------
   PHẦN 4.3 — LocalStorage: lưu trạng thái dark/light mode
   --------------------------------------------------------------------- */
const KHOA_LUU_THEME = 'portfolio-theme';
const nutDoiTheme = $('#theme-toggle');

/* Arrow function áp dụng theme lên <html> + đổi icon + aria */
const apDungTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  if (nutDoiTheme) {
    const laDark = theme === 'dark';
    nutDoiTheme.textContent = laDark ? '☀️' : '🌙';
    nutDoiTheme.setAttribute('aria-label',
      laDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối');
    nutDoiTheme.setAttribute('aria-pressed', String(laDark));
  }
};

/* Khởi tạo theme khi trang vừa load: đọc từ LocalStorage, mặc định 'light' */
const khoiTaoTheme = () => {
  const themeDaLuu = localStorage.getItem(KHOA_LUU_THEME) || 'light';
  apDungTheme(themeDaLuu);
};

if (nutDoiTheme) {
  nutDoiTheme.addEventListener('click', () => {
    const themeHienTai = document.documentElement.getAttribute('data-theme') || 'light';
    const themeMoi = themeHienTai === 'dark' ? 'light' : 'dark';
    apDungTheme(themeMoi);
    localStorage.setItem(KHOA_LUU_THEME, themeMoi); // lưu lại để reload vẫn giữ
  });
}

/* ---------------------------------------------------------------------
   KHỞI CHẠY — DOMContentLoaded để chắc chắn DOM đã sẵn sàng
   --------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  khoiTaoTheme();          // Phần 4.3
  renderKyNang();          // Phần 3.2
  taiDanhSachDuAn();       // Phần 4.1 + 4.2 + 4.4

  // Cập nhật năm hiện tại ở footer
  const namEl = $('#current-year');
  if (namEl) namEl.textContent = new Date().getFullYear();
});