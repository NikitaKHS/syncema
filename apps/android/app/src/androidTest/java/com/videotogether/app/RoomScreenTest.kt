package com.videotogether.app

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithText
import org.junit.Rule
import org.junit.Test

class RoomScreenTest {
    @get:Rule val compose = createAndroidComposeRule<MainActivity>()
    @Test fun roomShowsSyncStatus() { compose.onNodeWithText("Синхронизировано").assertIsDisplayed() }
}
