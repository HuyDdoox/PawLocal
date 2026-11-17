/**
 * VietQR Generation Utility for PawLocal
 * Formats Napas247 dynamic QR codes via VietQR standard image API.
 */

const VIETQR_CONFIG = {
  bankId: process.env.VIETQR_BANK_ID || 'MB', // MBBank
  accountNo: process.env.VIETQR_ACCOUNT_NO || '0909123456',
  accountName: process.env.VIETQR_ACCOUNT_NAME || 'PAWLOCAL PET SHOP',
  template: 'compact2', // Clean mobile card with bank logo, qr, amount
};

/**
 * Generate dynamic VietQR image URL
 * @param {number} amount - Total amount in VND
 * @param {string} description - Payment note / transfer description
 * @returns {string} Fully qualified image URL
 */
function createVietQrUrl(amount, description) {
  const safeAmount = Math.round(Number(amount) || 0);
  const safeDesc = encodeURIComponent(String(description).trim());
  const safeName = encodeURIComponent(VIETQR_CONFIG.accountName);

  return `https://img.vietqr.io/image/${VIETQR_CONFIG.bankId}-${VIETQR_CONFIG.accountNo}-${VIETQR_CONFIG.template}.png?amount=${safeAmount}&addInfo=${safeDesc}&accountName=${safeName}`;
}

/**
 * Generate QR for an Order
 * @param {string|object} orderId
 * @param {number} amount
 * @returns {string}
 */
function generateOrderQr(orderId, amount) {
  const shortId = String(orderId).slice(-6).toUpperCase();
  const desc = `PAWLOCAL DH ${shortId}`;
  return createVietQrUrl(amount, desc);
}

/**
 * Generate QR for a Booking
 * @param {string|object} bookingId
 * @param {number} amount
 * @returns {string}
 */
function generateBookingQr(bookingId, amount) {
  const shortId = String(bookingId).slice(-6).toUpperCase();
  const desc = `PAWLOCAL SPA ${shortId}`;
  return createVietQrUrl(amount, desc);
}

module.exports = {
  VIETQR_CONFIG,
  createVietQrUrl,
  generateOrderQr,
  generateBookingQr,
};
