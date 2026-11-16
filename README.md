# ONNCLOUD

A clean Android TV / Android app for Xbox Cloud Gaming.

ONNCLOUD is a separate application project. Its goal is to retain only the proven streaming technology required from [Geocld/XStreaming](https://github.com/Geocld/XStreaming), while replacing the application experience with ONNCLOUD-owned screens, navigation, settings, branding, and diagnostics.

## Project rules

- Keep the XStreaming streaming path that is required for Xbox Cloud Gaming.
- Preserve the working audio/video WebRTC pipeline and Android decoding path.
- Preserve controller input support and required native input components.
- Rebuild the app shell, navigation, settings, and branding for ONNCLOUD.
- Do not copy XStreaming's home screen, settings screens, menus, or unrelated features.
- Keep the existing `nick1234-design/onnxcloudgaming` repository separate and untouched.

## Important architecture note

XStreaming's streaming implementation is not a single isolated native library. Authentication/session setup and parts of stream orchestration are implemented in the React Native/TypeScript layer; WebRTC supplies the real-time audio/video transport; Android native code and bundled native libraries provide additional media/input functionality.

Therefore, ONNCLOUD must retain the minimum supporting TypeScript, React Native packages, Android code, and native libraries needed for those capabilities. Removing all JavaScript would break the stream setup. The extraction will be dependency-driven and tested in small steps rather than blindly copying or deleting large directories.

## Upstream source and license

The initial upstream reference is [Geocld/XStreaming](https://github.com/Geocld/XStreaming), branch `main`, inspected at commit:

`06ef1c7ee01d09cf9bb2a97fc4895da85e8488a8`

XStreaming is licensed under **GNU Affero General Public License v3.0 (AGPL-3.0)**. The upstream license text is included in this repository as `LICENSE`. Any copied or adapted covered code must retain its notices and comply with the license, including corresponding-source obligations when distributing builds. See the upstream project for its current notices and source.

## Build status

This repository is at the clean-project foundation stage. No installable APK has been produced yet. The next engineering steps are:

1. Map the minimum stream, authentication, audio/video, controller, and native dependencies.
2. Create the ONNCLOUD Android/React Native app shell with a distinct application ID and app identity.
3. Integrate the selected runtime components without importing XStreaming's UI.
4. Add a reproducible Android build workflow.
5. Build, install, and test on the Onn 4K Plus before adding features.

## Disclaimer

ONNCLOUD is an independent community project and is not affiliated with, endorsed by, or sponsored by Microsoft or Xbox. Xbox and related marks are the property of their respective owners.
