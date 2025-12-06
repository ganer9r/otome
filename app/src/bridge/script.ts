/**
 * 웹에 주입할 NativeBridge 스크립트
 *
 * 웹에서 호출 가능한 메서드:
 * - NativeBridge.haptic(style) : 진동 피드백 (Promise)
 * - NativeBridge.showRewardedAd() : 리워드 광고 (Promise<{ success, type, amount }>)
 * - NativeBridge.showInterstitialAd() : 전면 광고 (Promise<{ success }>)
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
    }
  };

  window.dispatchEvent(new Event('NativeBridgeReady'));
  console.log('NativeBridge injected');
})();
true;
`;
