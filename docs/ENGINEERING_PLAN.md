# ONNCLOUD engineering plan

## Upstream snapshot inspected

- Project: [Geocld/XStreaming](https://github.com/Geocld/XStreaming)
- Branch: `main`
- Commit inspected: `06ef1c7ee01d09cf9bb2a97fc4895da85e8488a8`
- Upstream license: GNU AGPL-3.0

This document records an initial source review. It is not a claim that upstream code has already been ported or that an APK has been built.

## Recommended streaming path: Nano

The current upstream tree contains two Android streaming paths:

1. A React Native WebRTC path (`NativeStream.tsx`, `src/webrtc/`, `react-native-webrtc`).
2. A newer native Nano path, with Rust handling Xbox session signaling, WebRTC transport, H.264/Opus media delivery and input data channels.

For ONNCLOUD, Nano is the first candidate to isolate because its streaming transport is concentrated in `nano-rs/`, with an Android JNI bridge and a dedicated native view. This avoids importing the large XStreaming streaming screen and its unrelated UI. This is a source-structure assessment only; it still needs a working build and device validation before we can call it the selected production engine.

### Nano dependency chain found

- Rust crate: `nano-rs/Cargo.toml`, `nano-rs/src/`
  - Auth/session token snapshots and Xbox stream request construction.
  - Session setup, signaling, WebRTC peer connection and data channels.
  - H.264 video and Opus audio sinks.
  - Gamepad input packet encoding and rumble events.
- JNI boundary: `nano-rs/src/android.rs` and `NanoRustBridge.java`.
- Android rendering/audio: `NanoStreamView.java`, `NanoStreamViewManager.java`, `NanoMediaCodecHelper.java`; the bridge uses Android MediaCodec for video/audio decode and AudioTrack for audio output.
- React Native adapter: `src/components/NanoStreamView.tsx`.
- Session orchestration: upstream `src/pages/NanoStream.tsx` currently coordinates the view and gamepad state, but its UI must not be copied. ONNCLOUD will implement a small independent session controller around the required bridge API.
- Xbox authentication/token acquisition is outside the Nano transport itself. The upstream XAL/MSAL and xCloud API logic must be mapped separately and reduced to the minimum required for sign-in, token refresh, title/session discovery, and stream-token delivery.

## Native WebView requirement

A separate source review confirmed that XStreaming's sign-in screen uses `react-native-webview` (React Native 0.72.14; package declaration `^13.10.2`), backed by Android's native WebView. Its login flow enables JavaScript, DOM storage, shared/third-party cookies, and routes the `ms-xal-000000004c20a908:` callback back into the app. Keep this exact native-backed component for ONNCLOUD authentication rather than substituting a custom standalone WebView. The WebView is not the Nano video transport. See [docs/WEBVIEW_INTEGRATION.md](WEBVIEW_INTEGRATION.md) for details and test gates.

## Keep / replace boundary

### Candidate to retain or adapt (subject to dependency and license review)

- Nano Rust transport/session code and its required modules.
- JNI bridge methods required to start/stop sessions, pass auth/session settings, deliver controller frames, and report status/stats.
- Native MediaCodec/AudioTrack video/audio path.
- The minimum Xbox authentication and xCloud request/token code required to obtain valid stream credentials.
- The minimum Android controller input handling required to feed Nano input frames.

### Rebuild independently

- App name, package/application ID, launcher icon and splash screen.
- Home screen, navigation, settings, account presentation and all app UI.
- Stream overlay and user-facing status/diagnostics.
- App preferences and settings persistence, except where a required engine setting must be passed into the bridge.

### Explicitly exclude unless a proven dependency requires otherwise

- XStreaming home/settings/navigation screens.
- Its unrelated remote-play library, achievements, friends, game maps, updater, feedback, recording, screenshots, frame-generation and FSR features.
- Its legacy React Native WebRTC streaming screen if Nano proves sufficient for the required xCloud use case.

## First implementation phases

1. Finish dependency and license inventory for Nano, XAL/MSAL, xCloud catalog/session APIs, Android input, and all transitive native libraries.
2. Create an ONNCLOUD-owned minimal Android/React Native shell and reproducible CI build.
3. Integrate the smallest Nano bridge and prove a clean debug APK builds.
4. Add sign-in and token acquisition; validate stream-session startup.
5. Add physical controller input and verify audio/video playback on the Onn 4K Plus.
6. Replace any temporary screens with the original ONNCLOUD experience and test long sessions.

## Device target and validation

Primary device: Onn 4K Plus (2 GB RAM). The first successful test target is a stable 1080p H.264 stream with working audio and physical controller input. Do not enable optional post-processing, frame generation, FSR, or high-cost diagnostics in the initial build.

## Licensing

XStreaming is AGPL-3.0. Any upstream code that is copied, adapted, or combined into a covered work must retain applicable copyright/license notices and satisfy the AGPL terms, including source availability obligations when distributing the application. Third-party components may have separate licenses; they must be inventoried individually. This engineering note is not legal advice.


## Phase 1 status — WebView shell

Implemented a minimal ONNCLOUD React Native shell with the same `react-native-webview` native component version targeted by XStreaming's patch. The shell tests Xbox.com/play loading, Android TV focus/navigation, cookie/storage settings, and XAL callback detection. The XAL callback is not yet completed and no Nano engine/controller/audio code has been ported. A GitHub Actions workflow now generates the React Native Android project and builds a debug APK artifact. See `docs/PHASE_1_WEBVIEW_SHELL.md`.
