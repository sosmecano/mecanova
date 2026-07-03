function getNative() {
  try {
    return require('expo-modules-core').requireNativeModule('SoundPlayer');
  } catch {}
}

export function playRing() {
  getNative()?.playRing();
}
export function stopRing() {
  getNative()?.stopRing();
}
export function playAlert() {
  getNative()?.playAlert();
}
