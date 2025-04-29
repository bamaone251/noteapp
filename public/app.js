const form = document.getElementById('messageForm');
const messagesList = document.getElementById('messagesList');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const res = await fetch('/api/messages', {
    method: 'POST',
    body: formData
  });

  const newMessage = await res.json();
  addMessageToList(newMessage);
  form.reset();
});

async function loadMessages() {
  const res = await fetch('/api/messages');
  const messages = await res.json();
  messagesList.innerHTML = '';
  messages.forEach(addMessageToList);
}

function addMessageToList(message) {
  const li = document.createElement('li');
  li.className = 'message';
  li.setAttribute('data-id', message.id);
  li.innerHTML = `
    <strong>${message.username}</strong>: ${message.text} 
    <div class="timestamp">${message.timestamp}</div>
    ${message.image ? `<img src="${message.image}" alt="uploaded image" />` : ''}
    <button class="delete-btn" onclick="deleteMessage(${message.id})">Delete</button>
  `;
  messagesList.appendChild(li);
}

async function deleteMessage(id) {
  const res = await fetch(`/api/messages/${id}`, {
    method: 'DELETE'
  });
  if (res.ok) {
    document.querySelector(`li[data-id='${id}']`)?.remove();
  }
}

loadMessages();
