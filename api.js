/**
 * api.js
 * Semua komunikasi ke backend Apps Script lewat sini.
 * Ganti API_URL dengan URL Web App hasil Deploy di Apps Script.
 */

const API_URL = 'https://script.google.com/macros/s/AKfycbyTg14nebBOsc6lMFmCJGhi7zVi39C1DlpHP1WXsGKTLquCsDeneScVLz4NmkvUxjm1/exec';

async function apiGet(action) {
  const res = await fetch(`${API_URL}?action=${encodeURIComponent(action)}`);
  return res.json();
}

async function apiPost(body) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' }, // hindari preflight CORS di Apps Script
    body: JSON.stringify(body)
  });
  return res.json();
}
