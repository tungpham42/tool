
/**
 * Encodes a string to Base64
 * @param text - The text to encode
 * @returns Base64 encoded string
 */
export const base64Encode = (text: string): string => {
  try {
    // Use btoa for browser environment
    return btoa(unescape(encodeURIComponent(text)));
  } catch (error) {
    console.error("Base64 encoding error:", error);
    throw new Error("Failed to encode text to Base64");
  }
};

/**
 * Decodes a Base64 string to text
 * @param base64 - The Base64 string to decode
 * @returns Decoded text string
 */
export const base64Decode = (base64: string): string => {
  try {
    // Remove any whitespace and validate Base64 format
    const cleanBase64 = base64.replace(/\s/g, '');
    
    // Check if it's valid Base64
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
      throw new Error("Invalid Base64 format");
    }
    
    // Use atob for browser environment
    return decodeURIComponent(escape(atob(cleanBase64)));
  } catch (error) {
    console.error("Base64 decoding error:", error);
    throw new Error("Failed to decode Base64 string");
  }
};

/**
 * Validates if a string is valid Base64
 * @param str - The string to validate
 * @returns True if valid Base64, false otherwise
 */
export const isValidBase64 = (str: string): boolean => {
  try {
    const cleanStr = str.replace(/\s/g, '');
    return /^[A-Za-z0-9+/]*={0,2}$/.test(cleanStr) && cleanStr.length % 4 === 0;
  } catch {
    return false;
  }
};

/**
 * Estimates the size of Base64 encoded data
 * @param text - The original text
 * @returns Estimated size in bytes
 */
export const estimateBase64Size = (text: string): number => {
  // Base64 encoding increases size by approximately 33%
  return Math.ceil((text.length * 4) / 3);
};
