// ResponsiveVoice.js TTS Configuration
export const TTS_CONFIG = {
  // Các voice hỗ trợ (tham khảo https://responsivevoice.org/api/)
  SUPPORTED_VOICES: [
    { code: 'Vietnamese Female', name: 'Tiếng Việt (Nữ)', lang: 'vi-VN', flag: '🇻🇳' },
    { code: 'UK English Female', name: 'English (UK)', lang: 'en-GB', flag: '🇬🇧' },
    { code: 'US English Female', name: 'English (US)', lang: 'en-US', flag: '🇺🇸' },
    { code: 'Chinese Female', name: '中文 (普通话)', lang: 'zh-CN', flag: '🇨🇳' },
    { code: 'Japanese Female', name: '日本語', lang: 'ja-JP', flag: '🇯🇵' },
    { code: 'Korean Female', name: '한국어', lang: 'ko-KR', flag: '🇰🇷' }
  ],
  // Cài đặt mặc định
  DEFAULT_SETTINGS: {
    voice: 'Vietnamese Female',
    rate: 1,     // 0.1 to 2 (ResponsiveVoice)
    volume: 1    // 0 to 1
  }
};

// Không cần API key cho ResponsiveVoice Free (phiên bản miễn phí)
export const API_KEY_INSTRUCTIONS = `
ResponsiveVoice.js không yêu cầu API key cho phiên bản miễn phí (phiên bản thương mại cần đăng ký).
`;
