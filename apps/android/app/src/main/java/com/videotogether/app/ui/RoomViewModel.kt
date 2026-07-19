package com.videotogether.app.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.videotogether.app.data.ChatMessage
import com.videotogether.app.data.Participant
import com.videotogether.app.data.PlaybackState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import javax.inject.Inject

data class RoomUiState(
    val roomName: String = "Вечерний просмотр",
    val connected: Boolean = true,
    val playback: PlaybackState = PlaybackState(),
    val participants: List<Participant> = listOf(Participant("1", "Никита", "Организатор"), Participant("2", "Алина", "Зритель"), Participant("3", "Максим", "Зритель", false)),
    val messages: List<ChatMessage> = listOf(ChatMessage("1", "Алина", "Всем привет! Начинаем?"), ChatMessage("2", "Вы", "Да, включаю через минуту", true)),
    val selectedTab: Int = 0,
    val error: String? = null
)

@HiltViewModel
class RoomViewModel @Inject constructor() : ViewModel() {
    private val _state = MutableStateFlow(RoomUiState())
    val state: StateFlow<RoomUiState> = _state.asStateFlow()
    fun selectTab(index: Int) = _state.update { it.copy(selectedTab = index) }
    fun send(body: String) { if (body.isNotBlank()) _state.update { it.copy(messages = it.messages + ChatMessage(System.nanoTime().toString(), "Вы", body.trim(), true)) } }
}
