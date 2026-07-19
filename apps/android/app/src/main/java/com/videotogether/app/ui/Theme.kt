package com.videotogether.app.ui

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

enum class ThemeMode { System, Light, Dark }
private val LightColors = lightColorScheme(primary=Color(0xFF7457F5),onPrimary=Color.White,background=Color(0xFFF4F3EF),surface=Color.White,onSurface=Color(0xFF17161D),onSurfaceVariant=Color(0xFF6D6B78),outline=Color(0xFFDEDCE5),error=Color(0xFFD94B5A),tertiary=Color(0xFF2BAA71))
private val DarkColors = darkColorScheme(primary=Color(0xFF9B84FF),onPrimary=Color(0xFF17121F),background=Color(0xFF121116),surface=Color(0xFF1B1A21),onSurface=Color(0xFFF3F1F7),onSurfaceVariant=Color(0xFFAAA6B3),outline=Color(0xFF35323D),error=Color(0xFFFF7381),tertiary=Color(0xFF4FD49A))
val VideoTogetherShapes = Shapes(extraSmall=RoundedCornerShape(8.dp),small=RoundedCornerShape(12.dp),medium=RoundedCornerShape(18.dp),large=RoundedCornerShape(28.dp),extraLarge=RoundedCornerShape(32.dp))

@Composable fun VideoTogetherTheme(mode: ThemeMode, content: @Composable () -> Unit) {
    val dark = when(mode) { ThemeMode.System -> isSystemInDarkTheme(); ThemeMode.Light -> false; ThemeMode.Dark -> true }
    MaterialTheme(colorScheme=if(dark) DarkColors else LightColors, typography=Typography(), shapes=VideoTogetherShapes, content=content)
}
