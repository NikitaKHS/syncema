package com.videotogether.app.ui

import android.annotation.SuppressLint
import android.graphics.Color
import android.net.Uri
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView

@SuppressLint("SetJavaScriptEnabled")
@Composable fun YouTubePlayerView(videoId: String, modifier: Modifier = Modifier) {
    var webView: WebView? = null
    AndroidView(modifier = modifier.fillMaxWidth().aspectRatio(16f/9f), factory = { context ->
        WebView(context).apply {
            webView = this
            setBackgroundColor(Color.BLACK)
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = false
            settings.allowFileAccess = false
            settings.allowContentAccess = false
            settings.mediaPlaybackRequiresUserGesture = false
            settings.setSupportMultipleWindows(false)
            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                    val host = request.url.host.orEmpty()
                    return host !in setOf("www.youtube.com", "youtube.com", "www.youtube-nocookie.com")
                }
            }
            val safeId = if (Regex("^[A-Za-z0-9_-]{11}$").matches(videoId)) videoId else "M7lc1UVf-VE"
            val html = """<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body,#p{margin:0;width:100%;height:100%;background:#000;overflow:hidden}</style></head><body><div id="p"></div><script src="https://www.youtube.com/iframe_api"></script><script>function onYouTubeIframeAPIReady(){new YT.Player('p',{videoId:'$safeId',width:'100%',height:'100%',playerVars:{playsinline:1,controls:1,origin:'https://videotogether.example'}})}</script></body></html>"""
            loadDataWithBaseURL("https://videotogether.example", html, "text/html", "UTF-8", null)
        }
    })
    DisposableEffect(videoId) { onDispose { webView?.stopLoading(); webView?.destroy(); webView = null } }
}
