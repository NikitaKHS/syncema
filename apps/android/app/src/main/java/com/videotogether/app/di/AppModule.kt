package com.videotogether.app.di

import retrofit2.converter.kotlinx.serialization.asConverterFactory
import com.videotogether.app.BuildConfig
import com.videotogether.app.data.VideoTogetherApi
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides @Singleton fun json() = Json { ignoreUnknownKeys = true; explicitNulls = false }
    @Provides @Singleton fun httpClient() = OkHttpClient.Builder()
        .addInterceptor(HttpLoggingInterceptor().apply { level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BASIC else HttpLoggingInterceptor.Level.NONE })
        .build()
    @Provides @Singleton fun api(client: OkHttpClient, json: Json): VideoTogetherApi = Retrofit.Builder()
        .baseUrl(BuildConfig.API_URL.trimEnd('/') + "/")
        .client(client)
        .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
        .build().create(VideoTogetherApi::class.java)
}
