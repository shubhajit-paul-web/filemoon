/**
 * Format file size from bytes to human-readable format
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted file size (e.g., "2.5 MB", "1.3 GB")
 */
function formatFileSize(bytes, decimals = 1) {
    if (bytes === 0) return "0 Bytes";
    if (bytes < 0) return "Invalid size";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
}

export default formatFileSize;
