const socket = io('http://localhost:9000');

let nsSocket = '';

socket.on('nsList', nsData => {
    let namespaceDiv = document.querySelector('.namespaces');
    namespaceDiv.innerHTML = "";
    nsData.forEach( ns => {
        namespaceDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;
    });
    
    Array.from(document.getElementsByClassName('namespace'))
        .forEach( elm => {
            elm.addEventListener('click', e => {
                const nsEndpoint = elm.getAttribute('ns');
        
                console.log(`${nsEndpoint} is ready`);
            });
        });
    joinNs('/wiki');
})