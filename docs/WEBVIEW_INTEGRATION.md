# XStreaming WebView integration decision

## Exact implementation identified

The WebView used by XStreaming's Microsoft sign-in flow is the **React Native WebView package** (react-native-webview), which renders a native Android WebView on Android. It is not a hand-written replacement WebView screen.

Verified upstream files at XStreaming commit 06ef1c7ee01d09cf9bb2a97fc4895da85e8488a8:

- src/pages/Login.tsx imports WebView from react-native-webview.
- XStreaming's package.json declares react-native-webview ^13.10.2 and React Native 0.72.14.
- The sign-in WebView enables JavaScript, DOM storage, third-party/shared cookies, and handles the Xbox XAL callback URI prefix ms-xal-000000004c20a908:.
- The sign-in component supplies a mobile user agent, autofocus JavaScript, and navigation/back handling.
- XStreaming also carries a local patch for the WebView package. That patch changes the behavior of stopLoading and adds a focusability command. It must be reviewed and tested before deciding whether ONNCLOUD needs it; do not copy it blindly.

## Important distinction

XStreaming's Cloud page is not simply the Xbox.com/play website embedded in a WebView. Its cloud catalogue, account/session handling, and Nano stream orchestration live in the React Native/API layer. The React Native WebView is explicitly used by the login/authentication flow.

ONNCLOUD should therefore retain this same native-backed React Native WebView for the XStreaming-compatible authentication flow. Do not replace it with an unrelated custom android.webkit.WebView implementation, and do not assume the WebView itself carries the Nano game video stream.

## ONNCLOUD keep/adapt boundary

- Keep the react-native-webview native Android component and the minimum React Native runtime it requires.
- Adapt the sign-in screen behavior into ONNCLOUD's own authentication screen; do not copy XStreaming's app UI.
- Preserve the XAL callback handling and cookie/storage behavior required by the upstream auth flow.
- Keep Nano's native Rust/JNI transport, MediaCodec video decoding, AudioTrack audio output, and controller/input bridge as a separate streaming subsystem.
- Rebuild ONNCLOUD's own home screen, navigation, settings, branding, and stream presentation.
- Inspect the WebView patch and the full authentication/token handoff before implementing sign-in. Avoid changing WebView defaults or security settings without a demonstrated xCloud requirement.

## Build and validation gates

1. Pin compatible React Native and react-native-webview versions and verify Android autolinking.
2. Decide whether the upstream WebView patch is required; test patched and unpatched behavior rather than assuming.
3. Implement only the ONNCLOUD auth screen and XAL callback handoff.
4. Build a debug APK before adding the Nano stream engine.
5. Test Microsoft sign-in, cookies across app restarts, XAL callback return, and TV/gamepad navigation on Android TV.
6. Integrate Nano separately and verify that the game stream uses the native media pipeline, not the sign-in WebView.

No application code or APK has been produced by this architecture decision. The existing onnxcloudgaming repository remains untouched.
