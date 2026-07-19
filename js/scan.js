/**
 * scan.js
 * Halaman ini didesain agar SELALU siap menerima input dari barcode scanner:
 * - Tidak ada tombol submit / klik.
 * - Scanner USB/Bluetooth berperilaku seperti keyboard: ia mengetik karakter
 *   resi lalu menekan "Enter" secara otomatis di akhir. Kita manfaatkan
 *   event Enter itu untuk memicu proses, TANPA user perlu menekan apa pun.
 * - Setelah selesai diproses, fokus otomatis dikembalikan ke input.
 */

const operator = localStorage.getItem('operator');
if (!operator) {
  window.location.href = 'index.html';
}

document.getElementById('operatorName').textContent = operator || '-';

const resiInput = document.getElementById('resiInput');
const statusBox = document.getElementById('statusBox');
const statusTitle = document.getElementById('statusTitle');
const statusDetail = document.getElementById('statusDetail');

let isProcessing = false; // cegah scan ganda saat masih memproses request sebelumnya

function focusInput() {
  resiInput.focus();
}

// Paksa fokus tetap di input, kapan pun berpindah (klik di area lain, dsb)
document.addEventListener('click', focusInput);
window.addEventListener('load', focusInput);
resiInput.addEventListener('blur', () => {
  setTimeout(focusInput, 50);
});

resiInput.addEventListener('keydown', async (e) => {
  if (e.key !== 'Enter') return;
  e.preventDefault();

  const resi = resiInput.value.trim();
  resiInput.value = '';

  if (!resi) return;
  processResi(resi);
});

async function processResi(resi) {
  if (!resi || isProcessing) return;

  isProcessing = true;
  setIdleProcessing();

  try {
    const result = await apiPost({ action: 'scan', resi: resi, operator: operator });
    handleResult(result);
  } catch (err) {
    showStatus('error', 'Gagal Terhubung', 'Cek koneksi internet atau URL API.');
    playSound('error');
  } finally {
    isProcessing = false;
    focusInput();
  }
}

function setIdleProcessing() {
  statusBox.className = 'status-box status-idle';
  statusTitle.textContent = 'Memproses...';
  statusDetail.textContent = '';
}

function handleResult(result) {
  if (result.status === 'success') {
    const detail = [
      result.orderId ? `Order: ${result.orderId}` : null,
      result.customer ? `Customer: ${result.customer}` : null,
      result.cs ? `CS: ${result.cs}` : null,
      result.produk ? `Produk: ${result.produk}` : null
    ].filter(Boolean).join('\n');

    showStatus('success', `Berhasil - ${result.resi}`, detail);
    playSound('success');
  } else if (result.status === 'duplicate') {
    showStatus('duplicate', `Duplicate - ${result.resi}`, 'Resi ini sudah pernah discan sebelumnya.');
    playSound('duplicate');
  } else if (result.status === 'notfound') {
    showStatus('error', `Tidak Ditemukan - ${result.resi}`, 'Resi tidak terdaftar di data marketplace.');
    playSound('error');
  } else {
    showStatus('error', 'Error', result.message || 'Terjadi kesalahan.');
    playSound('error');
  }
}

function showStatus(type, title, detail) {
  const classMap = {
    success: 'status-success',
    duplicate: 'status-duplicate',
    error: 'status-error'
  };
  statusBox.className = 'status-box ' + classMap[type];
  statusTitle.textContent = title;
  statusDetail.textContent = detail || '';
}

document.getElementById('btnGanti').addEventListener('click', () => {
  localStorage.removeItem('operator');
  window.location.href = 'index.html';
});

focusInput();
