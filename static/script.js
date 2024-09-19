document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let priority = document.getElementById('priority').value;
    
    fetch('/add_task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&priority=${encodeURIComponent(priority)}`
    }).then(() => {
        window.location.reload();
    });
});

function completeTask(taskId) {
    fetch(`/complete_task/${taskId}`, {
        method: 'POST'
    }).then(() => {
        window.location.reload();
    });
}

function deleteTask(taskId) {
    fetch(`/delete_task/${taskId}`, {
        method: 'POST'
    }).then(() => {
        window.location.reload();
    });
}

function editTask(taskId) {
    let taskElement = document.querySelector(`li[data-id="${taskId}"]`);
    let title = taskElement.querySelector('.task-title').textContent;
    let description = taskElement.querySelector('.task-description').textContent;
    let priority = taskElement.className.split(' ')[0].split('-')[1];

    document.getElementById('edit-id').value = taskId;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-description').value = description;
    document.getElementById('edit-priority').value = priority;

    document.getElementById('edit-modal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

document.getElementById('edit-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let id = document.getElementById('edit-id').value;
    let title = document.getElementById('edit-title').value;
    let description = document.getElementById('edit-description').value;
    let priority = document.getElementById('edit-priority').value;
    
    fetch(`/update_task/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&priority=${encodeURIComponent(priority)}`
    }).then(() => {
        closeEditModal();
        window.location.reload();
    });
});

window.onclick = function(event) {
    let modal = document.getElementById('edit-modal');
    if (event.target == modal) {
        closeEditModal();
    }
}
