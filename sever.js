const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views' , path.join(__dirname , 'public'));
app.engine('html',require('ejs').renderFile);
app.set('view engine' , 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

let messages =[];
fs.readFile('MesnsagensAnteriores.json', (err, data) => {
    if (err) throw err;
    messages = JSON.parse(data);
    console.log(messages);
});

io.on('connection' , socket =>{
    console.log(`Socket conectado: ${socket.id}`)

    socket.emit('mensagemPrevia',messages);

    socket.on('sendMessage' , data =>{
        messages.push(data);
        fs.writeFile('MesnsagensAnteriores.json', JSON.stringify(messages), (err) => {
            if (err) throw err;
            console.log('Dado foi escrito no arquivo');
        });
        console.log(data);
        console.log(messages);
        socket.broadcast.emit('recivedMessage' , data);
    });
});

server.listen(3000);