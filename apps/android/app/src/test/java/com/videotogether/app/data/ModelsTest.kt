package com.videotogether.app.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class ModelsTest {
    @Test fun extractsSupportedYouTubeLinks() {
        assertEquals("M7lc1UVf-VE", extractYouTubeId("https://youtu.be/M7lc1UVf-VE"))
        assertEquals("M7lc1UVf-VE", extractYouTubeId("M7lc1UVf-VE"))
        assertNull(extractYouTubeId("https://example.com/video"))
    }
}
