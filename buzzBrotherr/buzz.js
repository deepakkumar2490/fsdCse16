document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messageArea = document.getElementById('message-area');

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        
        const p = document.createElement('p');
        p.textContent = text;
        
        messageDiv.appendChild(p);
        messageArea.appendChild(messageDiv);
        
        
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    
    function handleSend() {
        const messageText = input.value.trim();
        
        if (messageText !== "") {
            
            addMessage(messageText, 'sent');
            
            
            input.value = "";
            
            
            setTimeout(() => {
                addMessage("This is an automatic 'Buzz Brother' reply to: " + messageText, 'received');
            }, 1000);
        }
    }


    sendButton.addEventListener('click', handleSend);

    
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            handleSend();
        }
    });
});