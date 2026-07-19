package com.videotogether.app.data

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface VideoTogetherApi {
    @POST("auth/guest") suspend fun guest(@Body body: GuestRequest): Session
    @POST("rooms") suspend fun createRoom(@Body body: CreateRoomRequest): Room
    @POST("rooms/join-by-invite/{code}") suspend fun joinByInvite(@Path("code") code: String): Room
    @GET("rooms/{roomId}") suspend fun room(@Path("roomId") roomId: String): Map<String, @JvmSuppressWildcards Any>
}
