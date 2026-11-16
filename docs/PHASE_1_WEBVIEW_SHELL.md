# Phase 1 — ONNCLOUD Android shell and WebView test

## Included in this phase

- A minimal React Native Android project is generated in GitHub Actions using React Native 0.72.14.
- The app pins react-native-webview 13.10.5, the version targeted by XStreaming's checked-in WebView patch.
- The app uses the XStreaming sign-in user-agent string and enables JavaScript, DOM storage, third-party/shared cookies, and multiple-window suppression.
- The app recognizes the XAL callback URI prefix used by XStreaming. This phase only detects that callback; it does not claim to complete XAL authentication.
- The app has a lightweight ONNCLOUD red/black home screen and Android TV-friendly launch control.
- GitHub Actions builds a debug APK and uploads it as an artifact.

## Deliberate exclusions

This is a WebView compatibility test shell, not a playable ONNCLOUD release. It does not yet contain the XAL native key/signing module, token exchange/persistence, Nano Rust library, Nano JNI bridge, MediaCodec/AudioTrack stream view, or XStreaming's native controller service. Those must be ported in separately after the WebView build is verified.

The XStreaming WebView patch is not applied in this phase. Its focusability/stop-loading changes need a targeted test before inclusion.

## Test gate

1. GitHub Actions must produce the debug APK.
2. Install it on the Onn 4K Plus.
3. Confirm the ONNCLOUD home screen opens and the WebView test launches.
4. Confirm Xbox.com loads and controller/remote navigation can focus and operate the page.
5. Record any sign-in or WebView renderer issue before implementing the XAL bridge.

A successful CI build is not proof that Xbox authentication or Nano streaming works.
