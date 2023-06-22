// Function to handle sending a message
function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();
  if (message !== '') {
    const chatMessages = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = message;

    // Add delete button
    const deleteButton = document.createElement('span');
    deleteButton.textContent = 'Delete this message';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', deleteMessage);
    messageElement.appendChild(deleteButton);

    chatMessages.appendChild(messageElement);
    messageInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

function deleteMessage(event) {
  const messageElement = event.target.parentNode;
  messageElement.style.animation = 'slideOut 0.3s forwards';
  messageElement.addEventListener('animationend', () => {
    messageElement.remove();
  });
}

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

const socket = io();

socket.on('init', (messages) => {
  messages.forEach(addMessage);
});

socket.on('message', addMessage);

function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();
  if (message !== '') {
    socket.emit('message', message);
    messageInput.value = '';
  }
}

function addMessage(message) {
  const chatMessages = document.querySelector('.chat-messages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.textContent = message.content;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});
