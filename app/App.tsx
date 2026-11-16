import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';

const XBOX_PLAY_URL = 'https://www.xbox.com/play';
const XSTREAMING_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36';
const XAL_CALLBACK_PREFIX = 'ms-xal-000000004c20a908:';

export default function App() {
  const [browserOpen, setBrowserOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Ready');
  const [xalCallbackReceived, setXalCallbackReceived] = useState(false);

  const handleNavigationChange = (state: WebViewNavigation) => {
    setPageTitle(state.title || 'Xbox Cloud Gaming');
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar hidden />
      {browserOpen ? (
        <View style={styles.browser}>
          <View style={styles.topBar}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => setBrowserOpen(false)}
              style={styles.backButton}>
              <Text style={styles.backText}>‹  ONNCLOUD</Text>
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.pageTitle}>
              {pageTitle}
            </Text>
          </View>
          {xalCallbackReceived ? (
            <View style={styles.callbackNotice}>
              <Text style={styles.callbackTitle}>XAL callback detected</Text>
              <Text style={styles.callbackBody}>
                The WebView detected XStreaming's Xbox callback scheme. The
                native XAL authentication bridge is a later integration step;
                this test build does not complete sign-in yet.
              </Text>
            </View>
          ) : null}
          <WebView
            source={{uri: XBOX_PLAY_URL}}
            style={styles.webView}
            javaScriptEnabled
            domStorageEnabled
            thirdPartyCookiesEnabled
            sharedCookiesEnabled
            setSupportMultipleWindows={false}
            mixedContentMode="always"
            cacheEnabled
            keyboardDisplayRequiresUserAction={false}
            userAgent={XSTREAMING_USER_AGENT}
            onNavigationStateChange={handleNavigationChange}
            onShouldStartLoadWithRequest={request => {
              if (request.url.startsWith(XAL_CALLBACK_PREFIX)) {
                setXalCallbackReceived(true);
                return false;
              }
              return (
                request.url.startsWith('https://') ||
                request.url.startsWith('http://')
              );
            }}
          />
        </View>
      ) : (
        <View style={styles.home}>
          <View style={styles.brandMark}>
            <Text style={styles.brandInitial}>ONN</Text>
            <Text style={styles.brandCloud}>CLOUD</Text>
          </View>
          <Text style={styles.heading}>Your cloud gaming hub.</Text>
          <Text style={styles.subheading}>
            Phase 1 · Native WebView compatibility test
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            hasTVPreferredFocus
            onPress={() => {
              setXalCallbackReceived(false);
              setBrowserOpen(true);
            }}
            style={styles.launchButton}>
            <Text style={styles.launchText}>OPEN WEBVIEW TEST</Text>
          </TouchableOpacity>
          <Text style={styles.note}>
            This test checks the same react-native-webview component used by
            XStreaming. Xbox authentication and Nano streaming are not wired
            into this phase yet.
          </Text>
          <Text style={styles.version}>ONNCLOUD · DEVELOPMENT BUILD</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#090909'},
  home: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#090909',
  },
  brandMark: {flexDirection: 'row', alignItems: 'baseline', marginBottom: 28},
  brandInitial: {color: '#FFFFFF', fontSize: 42, fontWeight: '900', letterSpacing: 1},
  brandCloud: {color: '#E32636', fontSize: 42, fontWeight: '900', letterSpacing: 1},
  heading: {color: '#FFFFFF', fontSize: 23, fontWeight: '700', textAlign: 'center'},
  subheading: {color: '#A5A5A5', fontSize: 14, marginTop: 10, textAlign: 'center'},
  launchButton: {
    marginTop: 34,
    minWidth: 250,
    minHeight: 54,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#D7192D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  launchText: {color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 1},
  note: {
    color: '#858585',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 24,
    maxWidth: 440,
  },
  version: {position: 'absolute', bottom: 18, color: '#555555', fontSize: 10, letterSpacing: 1},
  browser: {flex: 1, backgroundColor: '#000000'},
  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#292929',
  },
  backButton: {paddingVertical: 8, paddingRight: 16},
  backText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700'},
  pageTitle: {flex: 1, color: '#AAAAAA', fontSize: 12},
  webView: {flex: 1, backgroundColor: '#000000'},
  callbackNotice: {padding: 12, backgroundColor: '#241216', borderBottomWidth: 1, borderBottomColor: '#6F1723'},
  callbackTitle: {color: '#FF6675', fontSize: 13, fontWeight: '800'},
  callbackBody: {color: '#E5C9CD', fontSize: 12, lineHeight: 17, marginTop: 4},
});
