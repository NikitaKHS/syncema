package com.videotogether.app.data

import kotlinx.serialization.Serializable

@Serializable data class GuestRequest(val displayName: String)
@Serializable data class User(val id: String, val displayName: String, val avatarUrl: String? = null)
@Serializable data class Session(val accessToken: String, val refreshToken: String, val expiresIn: Int, val user: User)
@Serializable data class CreateRoomRequest(val name: String, val videoId: String? = null)
@Serializable data class Room(val id: String, val name: String, val ownerId: String, val inviteCode: String, val videoId: String? = null)
@Serializable data class PlaybackState(val videoId: String = "M7lc1UVf-VE", val state: String = "paused", val positionMs: Long = 0, val sequence: Long = 0, val controllerUserId: String? = null)
data class Participant(val id: String, val name: String, val role: String, val online: Boolean = true)
data class ChatMessage(val id: String, val author: String, val body: String, val mine: Boolean = false)

fun extractYouTubeId(input: String): String? {
    val trimmed = input.trim()
    if (Regex("^[A-Za-z0-9_-]{11}$").matches(trimmed)) return trimmed
    return Regex("(?:v=|youtu\\.be/|shorts/|embed/)([A-Za-z0-9_-]{11})").find(trimmed)?.groupValues?.get(1)
}
