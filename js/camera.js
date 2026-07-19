/**
 * camera.js
 * Mengaktifkan kamera HP untuk scan barcode, menggunakan library html5-qrcode.
 * Barcode yang terbaca akan diproses sama seperti hasil scanner USB/manual
 * (lewat fungsi processResi() yang ada di scan.js).
 */

const btnCamera = document.getElementById('btnCamera');
const btnCloseCamera = document.getElementById('btnCloseCamera');
const cameraBox = document.getElementById('cameraBox');

let html5QrCode = null;
let cameraActive = false;
let lastScanTime = 0;

btnCamera.addEventListener('click', startCamera);
btnCloseCamera.addEventListener('click', stopCamera);

// Auto-start kamera begitu halaman terbuka (khusus dipakai di HP)
window.addEventListener('load', () => {
  startCamera();
});

async function startCamera() {
  if (cameraActive) return;

  cameraBox.style.display = 'block';
  btnCamera.style.display = 'none';

  html5QrCode = new Html5Qrcode('cameraReader');

  try {
    await html5QrCode.start(
      { facingMode: 'environment' }, // kamera belakang HP
      {
        fps: 10,
        qrbox: { width: 260, height: 140 } // area fokus, cocok untuk barcode memanjang
      },
      onScanSuccess,
      () => {} // callback error per-frame, diabaikan (normal terjadi terus saat belum ketemu barcode)
    );
    cameraActive = true;
  } catch (err) {
    showStatus('error', 'Kamera Gagal Dibuka', 'Pastikan izin kamera diaktifkan di browser.');
    stopCamera();
  }
}

async function stopCamera() {
  if (html5QrCode && cameraActive) {
    try {
      await html5QrCode.stop();
      html5QrCode.clear();
    } catch (e) {
      // abaikan kalau memang sudah berhenti
    }
  }
  cameraActive = false;
  cameraBox.style.display = 'none';
  btnCamera.style.display = 'block';
  btnCamera.textContent = '📷 Buka Kamera Lagi';
  focusInput();
}

function onScanSuccess(decodedText) {
  const now = Date.now();
  // cegah 1 barcode yang sama kebaca berkali-kali dalam waktu singkat
  if (now - lastScanTime < 2000) return;
  lastScanTime = now;

  processResi(decodedText.trim());
}
