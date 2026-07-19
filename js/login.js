/**
 * login.js
 */

const operatorSelect = document.getElementById('operatorSelect');
const btnMasuk = document.getElementById('btnMasuk');
const loginError = document.getElementById('loginError');

// Kalau operator sudah tersimpan, langsung lempar ke halaman scan
const savedOperator = localStorage.getItem('operator');
if (savedOperator) {
  window.location.href = 'scan.html';
}

async function loadOperators() {
  try {
    const data = await apiGet('operator');
    if (data.status === 'success' && data.operator.length > 0) {
      operatorSelect.innerHTML = '<option value="">-- Pilih Operator --</option>';
      data.operator.forEach(nama => {
        const opt = document.createElement('option');
        opt.value = nama;
        opt.textContent = nama;
        operatorSelect.appendChild(opt);
      });
    } else {
      operatorSelect.innerHTML = '<option value="">Tidak ada operator aktif</option>';
    }
  } catch (err) {
    operatorSelect.innerHTML = '<option value="">Gagal memuat operator</option>';
    loginError.textContent = 'Tidak bisa terhubung ke server. Cek koneksi / URL API.';
  }
}

btnMasuk.addEventListener('click', () => {
  const nama = operatorSelect.value;
  if (!nama) {
    loginError.textContent = 'Pilih nama operator terlebih dahulu.';
    return;
  }
  localStorage.setItem('operator', nama);
  window.location.href = 'scan.html';
});

loadOperators();
