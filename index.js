const http = require('http').createServer(function (req, res) {
    require('fs').readFile('game.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });
  });
let rooms={}
const io = require('socket.io')(http, { cors: { origin: "*" } });

io.on('connection', (socket) => {
    let id;
    let room;

   socket.on('c',m=>{
    console.log(m);
    id=m.id;
    room=m.room; 
    if (!rooms.hasOwnProperty(room)) {
      rooms[room]={players:{}, obs:{}, start:false, }
      socket.emit('btn')
    }
    rooms[room].players[id]=0
    socket.join(room)
    io.to(room).emit('player',id)
    }
    )

    socket.on('start',()=>{rooms[room].start=true})
   socket.on ('msg' , e=>{
    delete rooms[room].obs[e.p[0]]
    io.to(room).emit('f',e)
  })
    socket.on('disconnect',()=>{socket.leave(room)})

});

setInterval(f, 2000);

function f()  {
  for (const k in rooms) {
    let i='b'+Math.floor( Math.random()*10000 )
    if (rooms[k].start==true && !rooms[k].obs.hasOwnProperty(i)){
      io.to(k).emit('f',{f:'create' ,p:[i,Math.random()*5+5,Math.random(),Math.random()]})
    }
  }
  console.log(rooms);}

let ip=[]
let os=require('os').networkInterfaces()
for (const k in os) {
os[k].forEach(e=>{
  if(e.family=='IPv4'){
    ip.push(e.address)}
})

}
http.listen(100, () => console.log(`CONNECT TO: http://${ip[0]}:100`) );