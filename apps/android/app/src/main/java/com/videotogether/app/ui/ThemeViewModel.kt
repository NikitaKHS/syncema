package com.videotogether.app.ui

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton

private val Context.themeDataStore by preferencesDataStore("appearance")

@Singleton
class ThemeRepository @Inject constructor(@ApplicationContext private val context: Context) {
    private val key = stringPreferencesKey("theme_mode")
    val mode = context.themeDataStore.data
        .map { preferences -> preferences[key]?.let { stored -> ThemeMode.entries.find { it.name == stored } } ?: ThemeMode.System }
        .catch { emit(ThemeMode.System) }

    suspend fun setMode(mode: ThemeMode) { context.themeDataStore.edit { it[key] = mode.name } }
}

@HiltViewModel
class ThemeViewModel @Inject constructor(private val repository: ThemeRepository) : ViewModel() {
    val mode = repository.mode.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), ThemeMode.System)
    fun setMode(mode: ThemeMode) { viewModelScope.launch { repository.setMode(mode) } }
}
