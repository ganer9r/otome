/**
 * 웹에 주입할 NativeBridge 스크립트
 *
 * 웹에서 호출 가능한 메서드:
 * - NativeBridge.haptic(style) : 진동 피드백 (Promise)
 * - NativeBridge.showRewardedAd() : 리워드 광고 (Promise<{ success, type, amount }>)
 * - NativeBridge.showInterstitialAd() : 전면 광고 (Promise<{ success }>)
 * - NativeBridge.playBGM(uri, loop) : BGM 재생 (Promise)
 * - NativeBridge.stopBGM() : BGM 정지 (Promise)
 * - NativeBridge.pauseBGM() : BGM 일시정지 (Promise)
 * - NativeBridge.resumeBGM() : BGM 재개 (Promise)
 * - NativeBridge.playEffect(uri) : 효과음 재생 (Promise)
 * - NativeBridge.setBGMVolume(volume) : BGM 볼륨 설정 (0.0~1.0) (Promise)
 * - NativeBridge.setEffectVolume(volume) : 효과음 볼륨 설정 (0.0~1.0) (Promise)
 * - NativeBridge.setMuted(muted) : 음소거 설정 (Promise)
 * - NativeBridge.getAudioStatus() : 오디오 상태 조회 (Promise)
 *
 * 내부 메서드:
 * - NativeBridge._resolve(callId, result) : 앱에서 호출하여 Promise resolve
 * - NativeBridge._reject(callId, error) : 앱에서 호출하여 Promise reject
 */
export const bridgeScript = `
(function() {
  if (window.NativeBridge) return;

  window.NativeBridge = {
    _callId: 0,
    _pending: {},

    // 내부: 앱으로 메시지 전송 후 Promise 반환
    _call: function(type, payload) {
      return new Promise(function(resolve, reject) {
        var callId = ++this._callId;
        this._pending[callId] = { resolve: resolve, reject: reject };
        
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: type,
          callId: callId,
          payload: payload
        }));
      }.bind(this));
    },

    // 앱에서 호출: Promise resolve
    _resolve: function(callId, result) {
      if (this._pending[callId]) {
        this._pending[callId].resolve(result);
        delete this._pending[callId];
      }
    },

    // 앱에서 호출: Promise reject
    _reject: function(callId, error) {
      if (this._pending[callId]) {
        this._pending[callId].reject(new Error(error));
        delete this._pending[callId];
      }
    },

    // 진동 피드백
    haptic: function(style) {
      return this._call('haptic', { style: style || 'medium' });
    },

    // 리워드 광고 표시
    showRewardedAd: function() {
      return this._call('showRewardedAd', {});
    },

    // 전면 광고 표시
    showInterstitialAd: function() {
      return this._call('showInterstitialAd', {});
    },

    // 크래시 테스트 (개발용)
    testCrash: function() {
      return this._call('testCrash', {});
    },

    // ====== 오디오 관련 ======

    // BGM 재생 (uri: 오디오 URL, loop: 반복 여부)
    playBGM: function(uri, loop) {
      return this._call('playBGM', { uri: uri, loop: loop !== false });
    },

    // BGM 정지
    stopBGM: function() {
      return this._call('stopBGM', {});
    },

    // BGM 일시정지
    pauseBGM: function() {
      return this._call('pauseBGM', {});
    },

    // BGM 재개
    resumeBGM: function() {
      return this._call('resumeBGM', {});
    },

    // 효과음 재생 (uri: 오디오 URL)
    playEffect: function(uri) {
      return this._call('playEffect', { uri: uri });
    },

    // BGM 볼륨 설정 (0.0 ~ 1.0)
    setBGMVolume: function(volume) {
      return this._call('setBGMVolume', { volume: volume });
    },

    // 효과음 볼륨 설정 (0.0 ~ 1.0)
    setEffectVolume: function(volume) {
      return this._call('setEffectVolume', { volume: volume });
    },

    // 음소거 설정
    setMuted: function(muted) {
      return this._call('setMuted', { muted: muted });
    },

    // 오디오 상태 조회
    getAudioStatus: function() {
      return this._call('getAudioStatus', {});
    }
  };

  window.dispatchEvent(new Event('NativeBridgeReady'));
  console.log('NativeBridge injected');
})();
true;
`;
