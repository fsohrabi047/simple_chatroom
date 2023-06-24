function joinNs(endpoint) {
    nsSocket = io(`http://localhost:9000${endpoint}`);

    nsSocket.on('nsRoomLoad', nsRooms => {
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = "";
        nsRooms.forEach( room => {
            let glyph;
            if (room.privateRoom) {
                glyph = 'lock';
            } else {
                glyph = 'globe';
            }

            roomList.innerHTML += `<li class="room" ><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
        });

        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach( elem => {
            elem.addEventListener('click', e => {
                // console.log(`${e.target.innerText} clicked`)
            });
        });

        const topRoom = document.querySelector('.room-list');
        const topRoomName = topRoom.innerText;
        joinRoom(topRoomName);
    });

    nsSocket.on('messageToClients', msg => {
        console.log(msg);
        document.querySelector('#message').innerHTML += buildHtml(msg);
    });

    document.querySelector('#message-form').addEventListener('submit', event => {
        event.preventDefault();

        const newMessage = document.querySelector('#user-message').value;
        nsSocket.emit('newMessageToServer', {text: newMessage});
    });
}

function buildHtml(msg) {
    const convertedDate = new Date(msg.time).toLocaleTimeString();
    const newHtml = `
        <li>
            <div class="user-image">
                <img src="${msh.avatar}" />
            </div>
            <div class="user-message">
                <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
                <div class="message-text">${msg.text}</div>
            </div>
        </li>
    `

    return newHtml;
}