const API_URL = 'http://localhost:3002/students';

document.addEventListener('DOMContentLoaded', () => {
    const getStudentsBtn = document.getElementById('get-students-btn');
    const addStudentForm = document.getElementById('add-student-form');
    const tbody = document.querySelector('#students-table tbody');

    getStudentsBtn.addEventListener('click', getStudents);
    addStudentForm.addEventListener('submit', addStudent);
    
    tbody.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains('delete-btn')) {
            deleteStudent(id);
        } else if (e.target.classList.contains('update-btn')) {
            updateStudent(id);
        }
    });
});

// Функція для отримання всіх студентів
async function getStudents() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Помилка отримання даних');
        const students = await response.json();
        renderStudents(students);
    } catch (error) {
        console.error(error);
        alert('Сервер недоступний. Запустіть: npx json-server --watch students.json --port 3002');
    }
}

// Функція для відображення студентів у таблиці
function renderStudents(students) {
    const tbody = document.querySelector('#students-table tbody');
    tbody.innerHTML = ''; 

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.course}</td>
            <td>${Array.isArray(student.skills) ? student.skills.join(', ') : ''}</td>
            <td>${student.email}</td>
            <td>${student.isEnrolled ? '✅' : '❌'}</td>
            <td>
                <button class="update-btn" data-id="${student.id}">Оновити</button>
                <button class="delete-btn" data-id="${student.id}" style="background-color: #dc3545;">Видалити</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Функція для додавання нового студента
async function addStudent(e) {
    e.preventDefault();

    const newStudent = {
        name: document.getElementById('name').value,
        age: Number(document.getElementById('age').value),
        course: document.getElementById('course').value,
        skills: document.getElementById('skills').value.split(',').map(s => s.trim()),
        email: document.getElementById('email').value,
        isEnrolled: document.getElementById('isEnrolled').checked
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });

        if (response.ok) {
            e.target.reset();
            getStudents(); 
        }
    } catch (error) {
        console.error(error);
    }
}

// Функція для оновлення студента
async function updateStudent(id) {
    const newName = prompt("Введіть нове ім'я студента:");
    if (!newName) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        });

        if (response.ok) getStudents();
    } catch (error) {
        console.error(error);
    }
}

// Функція для видалення студента
async function deleteStudent(id) {
    if (!confirm('Видалити цього студента?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) getStudents();
    } catch (error) {
        console.error(error);
    }
}
// npx json-server --watch students.json --port 3002