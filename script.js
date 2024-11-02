const addEventButton = document.getElementById('addEventButton');
const eventDateInput = document.getElementById('eventDate');
const eventTimeInput = document.getElementById('eventTime');
const eventNameInput = document.getElementById('eventName');
const eventsList = document.getElementById('events');
const calendarElement = document.getElementById('calendar');
const currentMonthDisplay = document.getElementById('currentMonth');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');

let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('events')) || {};

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Formato "dd-mm-yyyy"
}

function formatEventDateTime(date, time) {
    return `${formatDate(date)} ${time}`; // Formato "dd-mm-yyyy HH:MM"
}

function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    currentMonthDisplay.innerText = `${currentDate.toLocaleString('pt', { month: 'long' })} ${year}`;
    
    // Limpar o calendário atual
    calendarElement.innerHTML = '';

    // Adicionar dias da semana
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    daysOfWeek.forEach(day => {
        const dayNameElement = document.createElement('div');
        dayNameElement.className = 'day-name';
        dayNameElement.innerText = day;
        calendarElement.appendChild(dayNameElement);
    });

    // Criar os dias do mês
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    // Preencher os dias em branco do início
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        calendarElement.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.innerText = day;

        const dateKey = formatDate(new Date(year, month, day));

        // Adicionar eventos ao dia
        if (events[dateKey]) {
            events[dateKey].forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event';
                eventElement.innerText = `"${event.name}" às ${event.time}`; // Inclui a hora

                dayElement.appendChild(eventElement); // Adicionar o evento ao dia
            });
        }

        calendarElement.appendChild(dayElement);
    }
}

function addEvent() {
    const dateValue = eventDateInput.value;
    const timeValue = eventTimeInput.value;
    const name = eventNameInput.value;

    if (!dateValue || !timeValue || !name) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const date = formatDate(new Date(dateValue));

    if (!events[date]) {
        events[date] = [];
    }

    events[date].push({ name, time: timeValue });
    eventNameInput.value = '';
    eventTimeInput.value = ''; // Limpar o campo de hora
    saveEvents();
    renderCalendar();
    renderEventList();
}

function removeEvent(date, eventName, eventTime) {
    events[date] = events[date].filter(event => !(event.name === eventName && event.time === eventTime));
    if (events[date].length === 0) {
        delete events[date];
    }
    saveEvents();
    renderCalendar();
    renderEventList();
}

function renderEventList() {
    eventsList.innerHTML = '';
    Object.keys(events).forEach(date => {
        events[date].forEach(event => {
            const li = document.createElement('li');
            li.style.position = 'relative'; // Define o li como relativo para que o botão possa ser posicionado corretamente
            li.innerText = `${date}: ${event.name} às ${event.time}`;

            // Criar botão de remoção
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-btn';
            removeButton.innerText = 'Remover';
            removeButton.onclick = () => removeEvent(date, event.name, event.time);

            li.appendChild(removeButton); // Adicionar o botão à lista de eventos
            eventsList.appendChild(li);
        });
    });
}


function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

function changeMonth(increment) {
    currentDate.setMonth(currentDate.getMonth() + increment);
    renderCalendar();
}

// Adicionar eventos
addEventButton.onclick = addEvent;
prevMonthButton.onclick = () => changeMonth(-1);
nextMonthButton.onclick = () => changeMonth(1);

// Renderizar o calendário ao carregar
window.onload = () => {
    renderCalendar();
    renderEventList(); // Para carregar os eventos ao iniciar
};