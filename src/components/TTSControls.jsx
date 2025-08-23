import React, { useState } from 'react';
import useTextToSpeech from '../hooks/useTextToSpeech';
import { TTS_CONFIG, API_KEY_INSTRUCTIONS } from '../config/tts';

const TTSControls = ({ content, title = "Nội dung trang" }) => {
  const [showSettings, setShowSettings] = useState(false);
  const {
    isSupported,
    isPlaying,
    isPaused,
    isLoading,
    voices,
    selectedVoice,
    rate,
    volume,
    setSelectedVoice,
    setRate,
    setVolume,
    speak,
    pause,
    resume,
    stop
  } = useTextToSpeech();

  if (!isSupported) {
    return (
      <div className="bg-gray-100 p-3 rounded-lg border">
        <div className="flex items-center text-gray-500">
          <span className="text-lg mr-2">🔇</span>
          <span className="text-sm">Trình duyệt không hỗ trợ đọc văn bản</span>
        </div>
      </div>
    );
  }

  const handlePlay = () => {
    if (!content) {
      alert('Không có nội dung để đọc');
      return;
    }
    speak(content);
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        {/* <div className="flex items-center">
          <span className="text-lg mr-2">🔊</span>
          <span className="font-medium text-gray-800">Đọc văn bản</span>
        </div> */}
        {/* <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Cài đặt"
        >
          ⚙️
        </button> */}
      </div>

      {/* Main Controls */}
      <div className="flex items-center gap-2 mb-3">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={!content || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Đang tạo...</span>
              </>
            ) : (
              <>
                <span>▶️</span>
                <span>Phát</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handlePauseResume}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            disabled={isLoading}
          >
            <span>{isPaused ? '▶️' : '⏸️'}</span>
            <span>{isPaused ? 'Tiếp tục' : 'Tạm dừng'}</span>
          </button>
        )}

        {(isPlaying || isLoading) && (
          <button
            onClick={stop}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <span>⏹️</span>
            <span>Dừng</span>
          </button>
        )}
        

        {/* Status */}
        <div className="flex items-center ml-auto text-sm text-gray-600">
          {isLoading && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Đang tạo audio...</span>
            </div>
          )}
          {/* {isPlaying && !isLoading && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{isPaused ? 'Đã tạm dừng' : 'Đang phát'}</span>
            </div>
          )} */}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-t pt-3 space-y-3">
          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giọng đọc:
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {voices.map((voice, index) => (
                <option key={index} value={voice.code}>
                  {voice.flag} {voice.name}
                </option>
              ))}
            </select>
          </div>

          {/* Speed Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tốc độ: {rate > 0 ? `+${rate}` : rate}
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={rate}
              onChange={(e) => setRate(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Chậm (-10)</span>
              <span>Bình thường (0)</span>
              <span>Nhanh (+10)</span>
            </div>
          </div>

          {/* Volume Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Âm lượng: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Nhỏ</span>
              <span>To</span>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      {!content && (
        <div className="text-sm text-gray-500 italic">
          Chọn một trang để bắt đầu đọc
        </div>
      )}

      {/* API Info */}
      {/* ResponsiveVoice.js does not require API key for free version */}
    </div>
  );
};

export default TTSControls;
