var net = require('net');
var HOST = '127.0.0.1';
var PORT = 6969;

var db = ["sword", "spear", "staff", "shield", "bow", "crossbow", "potion", "poison", "glove", "hat", "shoe", "apple"]

net.createServer(function (sock) {
    var state = 0
    var current_key = null
    var i = 0
    sock.on('data', function (data) {
        switch(state){
            case 0:
                if(data == 'STARTGAME'){
                    sock.write('GAMESTART')
                    state = 1 //wait for key
                }
                break
            case 1:
                current_key = data
                //sock.write("" + (db[current_key] || 0))
                for(i = 0 ; i<=db.length; i++) {
                    if(db[i] == current_key) {
                        if(i == 0){
                            sock.write('' + (i+1))
                        }else {
                            sock.write('' + (i))
                        }
                    }
                }
                state = 2 //wait for number
                break
            case 2:
                if(data == 'GAMEOVER!!'){
                    sock.write('GG')
                    sock.close()
                    state = 3 //end
                }else{
                try{
                    let v = data.toUppercase()
                    if(!db[current_key]){
                        db[current_key] = 0
                        sock.write("" + (db[current_key]))
                    //db[current_key] += v
                    }

                    for(i = 0; i < db.length; i++) {
                        if(db[i] == v) {
                            sock.write("" + (db[i] + 1))
                        }
                    }
                }catch(e){
                    sock.write('INVALID')
                }
            }
            break
        }
    })
}).listen(PORT, HOST);
console.log('Server listening on ' + HOST + ':' + PORT);