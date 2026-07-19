package com.videotogether.app.ui

import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalWindowInfo
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.videotogether.app.data.ChatMessage
import com.videotogether.app.data.Participant

@Composable fun VideoTogetherRoot(deepLink: Uri?, themeViewModel: ThemeViewModel = hiltViewModel()) {
    val themeMode by themeViewModel.mode.collectAsStateWithLifecycle()
    VideoTogetherTheme(themeMode) { Surface(Modifier.fillMaxSize(), color=MaterialTheme.colorScheme.background) { RoomScreen(themeMode, themeViewModel::setMode, deepLink) } }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable fun RoomScreen(themeMode: ThemeMode, onTheme: (ThemeMode)->Unit, deepLink: Uri?, viewModel: RoomViewModel = hiltViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    var message by remember { mutableStateOf("") }
    var menu by remember { mutableStateOf(false) }
    val wide = with(LocalDensity.current) { LocalWindowInfo.current.containerSize.width.toDp() >= 840.dp }
    Scaffold(topBar={ TopAppBar(title={ Column { Text(state.roomName,maxLines=1,overflow=TextOverflow.Ellipsis,fontSize=15.sp,fontWeight=FontWeight.Bold); Text(if(state.connected) "● Подключено" else "● Подключение…",color=if(state.connected) MaterialTheme.colorScheme.tertiary else Color(0xFFE6A23C),fontSize=10.sp) } },navigationIcon={ IconButton({}){ Icon(Icons.Default.PlayCircle,"Video Together",tint=MaterialTheme.colorScheme.primary) } },actions={ FilledTonalButton({}){ Icon(Icons.Default.PersonAdd,null); if(wide) Text(" Пригласить") }; Box { IconButton({menu=true}){Icon(Icons.Default.MoreVert,"Настройки")}; DropdownMenu(menu,{menu=false}) { ThemeMode.entries.forEach { DropdownMenuItem({Text(when(it){ThemeMode.System->"Как в системе";ThemeMode.Light->"Светлая";ThemeMode.Dark->"Тёмная"})},{onTheme(it);menu=false},leadingIcon={Icon(if(it==ThemeMode.Dark) Icons.Default.DarkMode else if(it==ThemeMode.Light) Icons.Default.LightMode else Icons.Default.SettingsBrightness,null)}) } } } }) },contentWindowInsets=WindowInsets.safeDrawing.only(WindowInsetsSides.Top+WindowInsetsSides.Horizontal)) { padding ->
        if(wide) Row(Modifier.padding(padding).fillMaxSize()) { WatchArea(state.playback.videoId,Modifier.weight(1f)); SidePanel(state,viewModel,message,{message=it},{viewModel.send(message);message=""},Modifier.width(380.dp)) }
        else Column(Modifier.padding(padding).fillMaxSize()) { WatchArea(state.playback.videoId,Modifier.fillMaxWidth()); SidePanel(state,viewModel,message,{message=it},{viewModel.send(message);message=""},Modifier.weight(1f)) }
    }
}

@Composable private fun WatchArea(videoId:String, modifier:Modifier) { Column(modifier) { YouTubePlayerView(videoId); Column(Modifier.padding(18.dp)) { Row(verticalAlignment=Alignment.CenterVertically) { Column(Modifier.weight(1f)) { Text("YOUTUBE",color=MaterialTheme.colorScheme.error,fontSize=9.sp,fontWeight=FontWeight.Black); Text("Совместный просмотр",fontWeight=FontWeight.Bold,fontSize=18.sp); Text("Официальный плеер · управление для всех",color=MaterialTheme.colorScheme.onSurfaceVariant,fontSize=11.sp) }; Surface(shape=MaterialTheme.shapes.medium,color=MaterialTheme.colorScheme.tertiary.copy(alpha=.1f),border=androidx.compose.foundation.BorderStroke(1.dp,MaterialTheme.colorScheme.tertiary.copy(alpha=.25f))) { Row(Modifier.padding(12.dp),verticalAlignment=Alignment.CenterVertically) { Icon(Icons.Default.Sync,null,tint=MaterialTheme.colorScheme.tertiary); Spacer(Modifier.width(8.dp)); Column { Text("Синхронизировано",fontSize=10.sp,fontWeight=FontWeight.Bold,color=MaterialTheme.colorScheme.tertiary); Text("Задержка 42 мс",fontSize=9.sp,color=MaterialTheme.colorScheme.onSurfaceVariant) } } } } } } }

@Composable private fun SidePanel(state:RoomUiState, vm:RoomViewModel, message:String,onMessage:(String)->Unit,onSend:()->Unit,modifier:Modifier) { Surface(modifier,border=androidx.compose.foundation.BorderStroke(1.dp,MaterialTheme.colorScheme.outline.copy(alpha=.6f))) { Column { PrimaryTabRow(state.selectedTab) { Tab(state.selectedTab==0,{vm.selectTab(0)},text={Text("Чат  ${state.messages.size}")},icon={Icon(Icons.Default.Chat,null)}); Tab(state.selectedTab==1,{vm.selectTab(1)},text={Text("Участники  ${state.participants.size}")},icon={Icon(Icons.Default.Group,null)}) }; if(state.selectedTab==0) { LazyColumn(Modifier.weight(1f).padding(horizontal=15.dp),contentPadding=PaddingValues(vertical=14.dp),verticalArrangement=Arrangement.spacedBy(14.dp)) { items(state.messages,key={it.id}) { MessageRow(it) } }; Row(Modifier.navigationBarsPadding().padding(12.dp),verticalAlignment=Alignment.CenterVertically) { OutlinedTextField(message,onMessage,Modifier.weight(1f),placeholder={Text("Написать сообщение…")},singleLine=true,shape=MaterialTheme.shapes.medium); Spacer(Modifier.width(8.dp)); FilledIconButton(onSend,Modifier.size(50.dp)){Icon(Icons.Default.Send,"Отправить")} } } else LazyColumn(Modifier.weight(1f).padding(12.dp),verticalArrangement=Arrangement.spacedBy(6.dp)) { items(state.participants,key={it.id}) { ParticipantRow(it) } } } } }

@Composable private fun MessageRow(item:ChatMessage) { Row(Modifier.fillMaxWidth(),horizontalArrangement=if(item.mine) Arrangement.End else Arrangement.Start,verticalAlignment=Alignment.Top) { if(!item.mine){Avatar(item.author);Spacer(Modifier.width(8.dp))}; Column(horizontalAlignment=if(item.mine) Alignment.End else Alignment.Start,modifier=Modifier.widthIn(max=270.dp)) { Text(item.author,fontSize=10.sp,fontWeight=FontWeight.Bold,color=MaterialTheme.colorScheme.onSurfaceVariant); Surface(shape=if(item.mine) MaterialTheme.shapes.medium else MaterialTheme.shapes.small,color=if(item.mine) MaterialTheme.colorScheme.primary.copy(alpha=.14f) else MaterialTheme.colorScheme.background) { Text(item.body,Modifier.padding(horizontal=12.dp,vertical=9.dp),fontSize=12.sp,lineHeight=17.sp) } } } }
@Composable private fun ParticipantRow(person:Participant) { Row(Modifier.fillMaxWidth().clip(MaterialTheme.shapes.medium).padding(10.dp),verticalAlignment=Alignment.CenterVertically) { Box { Avatar(person.name); Box(Modifier.size(10.dp).clip(CircleShape).background(if(person.online) MaterialTheme.colorScheme.tertiary else MaterialTheme.colorScheme.outline).border(2.dp,MaterialTheme.colorScheme.surface,CircleShape).align(Alignment.BottomEnd)) }; Spacer(Modifier.width(11.dp)); Column(Modifier.weight(1f)){Text(person.name,fontSize=12.sp,fontWeight=FontWeight.Bold,maxLines=1,overflow=TextOverflow.Ellipsis);Text(person.role,fontSize=10.sp,color=MaterialTheme.colorScheme.onSurfaceVariant)}; if(person.role=="Организатор")Icon(Icons.Default.Crown,null,tint=Color(0xFFE6A23C)) } }
@Composable private fun Avatar(name:String) { Box(Modifier.size(36.dp).clip(MaterialTheme.shapes.small).background(MaterialTheme.colorScheme.primary),contentAlignment=Alignment.Center){Text(name.take(2).uppercase(),color=MaterialTheme.colorScheme.onPrimary,fontSize=10.sp,fontWeight=FontWeight.Black)} }
