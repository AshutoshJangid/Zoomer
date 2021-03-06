const { text } = require("express");

const socket = io('/');
const videoGrid = document.getElementById('video-grid'); 
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3030'
}); 




let myVideoStream 

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    
    peer.on('call',call=>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('steam',userVideoStream=>{
            addVideoStream(video, userVideoStream)
        })
    })
    
    
    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    })
})

peer.on('open',id=>{
    // console.log(id);
socket.emit('join-room',ROOM_ID, id);

})


const connectToNewUser = (userId,stream) =>{
    // console.log(userId);
    const call = peer.call(userId,stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream=>{
        addVideoStream(video, userVideoStream)
    })
}
const addVideoStream = (video, stream) =>{
    video.srcObject = stream;
    video.addEventListner('loadmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}

let text = $('#chat_message')
// console.log(msg);

$('html').keydown((e)=>{
    if(e.which==13 && text.val() !== 0 ){
    console.log(text.val());

        socket.emit('message',text.val());
        text.val('')
    }
})