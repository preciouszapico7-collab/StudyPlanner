/* =====================================================
   STUDYSYNC - BSIS 1A ACADEMIC PLANNER
   ===================================================== */


/* ================= DATA ================= */

let classes = JSON.parse(localStorage.getItem("classes")) || [
    {
        id: 1,
        subject: "Computer Programming 1",
        teacher: "Your Teacher",
        day: "Monday",
        time: "8:00 AM - 10:00 AM",
        room: "Room 101"
    },
    {
        id: 2,
        subject: "Introduction to Computing",
        teacher: "Your Teacher",
        day: "Tuesday",
        time: "10:00 AM - 12:00 PM",
        room: "Room 102"
    },
    {
        id: 3,
        subject: "Information Systems",
        teacher: "Your Teacher",
        day: "Wednesday",
        time: "8:00 AM - 10:00 AM",
        room: "Room 103"
    }
];


let tasks = JSON.parse(localStorage.getItem("tasks")) || [
    {
        id: 1,
        title: "Review Java Looping",
        subject: "Computer Programming 1",
        due: "Tomorrow",
        completed: false
    },
    {
        id: 2,
        title: "Finish HTML Activity",
        subject: "Introduction to Computing",
        due: "Friday",
        completed: false
    }
];


let reviewers = JSON.parse(localStorage.getItem("reviewers")) || [
    {
        id: 1,
        title: "Java Looping Reviewer",
        subject: "Computer Programming 1",
        description: "Loops, nested loops, for loop, while loop.",
        link: "#"
    },
    {
        id: 2,
        title: "HTML & CSS Basics",
        subject: "Introduction to Computing",
        description: "Basic HTML tags and CSS styling.",
        link: "#"
    }
];


let teachers = JSON.parse(localStorage.getItem("teachers")) || [
    {
        id: 1,
        name: "Your Teacher",
        subject: "Computer Programming 1",
        email: "teacher@example.com"
    },
    {
        id: 2,
        name: "Your Teacher",
        subject: "Introduction to Computing",
        email: "teacher@example.com"
    }
];


let currentFilter = "all";


/* ================= SAVE DATA ================= */

function saveData() {

    localStorage.setItem("classes", JSON.stringify(classes));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("reviewers", JSON.stringify(reviewers));
    localStorage.setItem("teachers", JSON.stringify(teachers));

}


/* ================= DATE ================= */

function updateDate() {

    const date = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    document.getElementById("dateText").textContent =
        date.toLocaleDateString("en-US", options);

}


/* ================= NAVIGATION ================= */

const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const page = button.dataset.page;

        showPage(page);

    });

});


function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }


    navButtons.forEach(button => {

        button.classList.remove("active");

        if (button.dataset.page === pageName) {
            button.classList.add("active");
        }

    });


    const titles = {
        dashboard: "Overview",
        schedule: "Class Schedule",
        tasks: "To-Do List",
        reviewer: "Reviewer",
        teachers: "Teachers"
    };

    document.getElementById("pageTitle").textContent =
        titles[pageName] || "StudySync";

}


/* ================= RENDER ALL ================= */

function renderAll() {

    renderStats();
    renderTasks();
    renderDashboardTasks();
    renderClasses();
    renderDashboardClasses();
    renderReviewers();
    renderTeachers();
    renderTeacherPreview();
    renderNotifications();

}


/* ================= STATISTICS ================= */

function renderStats() {

    document.getElementById("classCount").textContent =
        classes.length;

    document.getElementById("taskCount").textContent =
        tasks.filter(task => !task.completed).length;

    document.getElementById("reviewerCount").textContent =
        reviewers.length;

    document.getElementById("teacherCount").textContent =
        teachers.length;

}


/* ================= TASKS ================= */

function renderTasks() {

    const container = document.getElementById("taskList");

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }


    if (filteredTasks.length === 0) {

        container.innerHTML = `
            <div class="empty">
                🎉 No tasks found.
            </div>
        `;

        return;
    }


    container.innerHTML = filteredTasks.map(task => `

        <div class="task-item ${task.completed ? "completed" : ""}">

            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <div class="task-info">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <small>
                    ${escapeHTML(task.subject)}
                    • Due: ${escapeHTML(task.due)}
                </small>

            </div>

            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
            >
                🗑️
            </button>

        </div>

    `).join("");

}


function renderDashboardTasks() {

    const container = document.getElementById("dashboardTasks");

    const pending = tasks.filter(task => !task.completed).slice(0, 4);

    if (pending.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No pending tasks 🎉
            </div>
        `;

        return;
    }


    container.innerHTML = pending.map(task => `

        <div class="task-item">

            <input
                type="checkbox"
                onchange="toggleTask(${task.id})"
            >

            <div class="task-info">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <small>
                    ${escapeHTML(task.subject)}
                    • ${escapeHTML(task.due)}
                </small>

            </div>

        </div>

    `).join("");

}


function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (task) {
        task.completed = !task.completed;
    }

    saveData();
    renderAll();

}


function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveData();
    renderAll();

}


/* ================= FILTER ================= */

document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});


/* ================= SCHEDULE ================= */

function renderClasses() {

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
    ];


    days.forEach(day => {

        const id = day.toLowerCase() + "Classes";

        const container = document.getElementById(id);

        const dayClasses = classes.filter(
            item => item.day === day
        );


        if (dayClasses.length === 0) {

            container.innerHTML = `
                <p style="text-align:center;color:#9aa3ad;font-size:13px;">
                    No classes
                </p>
            `;

            return;
        }


        container.innerHTML = dayClasses.map(item => `

            <div class="class-card">

                <button
                    class="delete-btn"
                    onclick="deleteClass(${item.id})"
                >
                    🗑️
                </button>

                <strong>
                    ${escapeHTML(item.subject)}
                </strong>

                <small>
                    ⏰ ${escapeHTML(item.time)}
                </small>

                <small>
                    👩‍🏫 ${escapeHTML(item.teacher)}
                </small>

                <small>
                    📍 ${escapeHTML(item.room)}
                </small>

            </div>

        `).join("");

    });

}


function renderDashboardClasses() {

    const container = document.getElementById("dashboardClasses");

    const today = new Date().toLocaleDateString(
        "en-US",
        { weekday: "long" }
    );


    const todayClasses = classes.filter(
        item => item.day === today
    );


    if (todayClasses.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No classes today 🎉
            </div>
        `;

        return;
    }


    container.innerHTML = todayClasses.map(item => `

        <div class="class-card">

            <strong>${escapeHTML(item.subject)}</strong>

            <small>
                ⏰ ${escapeHTML(item.time)}
            </small>

            <small>
                👩‍🏫 ${escapeHTML(item.teacher)}
            </small>

        </div>

    `).join("");

}


function deleteClass(id) {

    classes = classes.filter(item => item.id !== id);

    saveData();
    renderAll();

}


/* ================= REVIEWERS ================= */

function renderReviewers() {

    const container = document.getElementById("reviewerGrid");

    if (reviewers.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No reviewers yet.
            </div>
        `;

        return;
    }


    container.innerHTML = reviewers.map(item => `

        <div class="reviewer-card">

            <div class="reviewer-icon">
                📚
            </div>

            <h3>
                ${escapeHTML(item.title)}
            </h3>

            <p>
                ${escapeHTML(item.subject)}
            </p>

            <p>
                ${escapeHTML(item.description)}
            </p>

            <a
                class="material-link"
                href="${escapeAttribute(item.link)}"
                target="_blank"
            >
                Open Material →
            </a>

            <button
                class="delete-btn"
                onclick="deleteReviewer(${item.id})"
            >
                🗑️
            </button>

        </div>

    `).join("");

}


function deleteReviewer(id) {

    reviewers = reviewers.filter(item => item.id !== id);

    saveData();
    renderAll();

}


/* ================= TEACHERS ================= */

function renderTeachers() {

    const container = document.getElementById("teacherGrid");

    if (teachers.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No teachers added yet.
            </div>
        `;

        return;
    }


    container.innerHTML = teachers.map(teacher => `

        <div class="teacher-card">

            <div class="teacher-avatar">
                👩‍🏫
            </div>

            <h3>
                ${escapeHTML(teacher.name)}
            </h3>

            <p>
                📚 ${escapeHTML(teacher.subject)}
            </p>

            <p>
                📧 ${escapeHTML(teacher.email)}
            </p>

            <button
                class="delete-btn"
                onclick="deleteTeacher(${teacher.id})"
            >
                🗑️
            </button>

        </div>

    `).join("");

}


function renderTeacherPreview() {

    const container = document.getElementById("teacherPreview");

    container.innerHTML = teachers.slice(0, 4).map(teacher => `

        <div class="teacher-card">

            <div class="teacher-avatar">
                👩‍🏫
            </div>

            <strong>
                ${escapeHTML(teacher.name)}
            </strong>

            <p>
                ${escapeHTML(teacher.subject)}
            </p>

        </div>

    `).join("");

}


function deleteTeacher(id) {

    teachers = teachers.filter(item => item.id !== id);

    saveData();
    renderAll();

}


/* ================= MODAL ================= */

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

document.getElementById("closeModal").addEventListener(
    "click",
    closeModal
);


function openModal(title, content) {

    modalTitle.textContent = title;
    modalBody.innerHTML = content;

    modal.classList.add("show");

}


function closeModal() {

    modal.classList.remove("show");

}


window.addEventListener("click", event => {

    if (event.target === modal) {
        closeModal();
    }

});


/* ================= ADD TASK ================= */

document.getElementById("addTaskBtn").addEventListener(
    "click",
    () => {

        openModal(
            "Add New Task",
            `
            <form id="taskForm">

                <div class="form-group">
                    <label>Task Name</label>
                    <input
                        type="text"
                        id="taskTitle"
                        required
                        placeholder="Example: Java Activity"
                    >
                </div>

                <div class="form-group">
                    <label>Subject</label>
                    <input
                        type="text"
                        id="taskSubject"
                        required
                        placeholder="Example: Computer Programming 1"
                    >
                </div>

                <div class="form-group">
                    <label>Due Date</label>
                    <input
                        type="date"
                        id="taskDue"
                        required
                    >
                </div>

                <button class="primary-btn form-submit">
                    Add Task
                </button>

            </form>
            `
        );


        document.getElementById("taskForm").addEventListener(
            "submit",
            event => {

                event.preventDefault();

                tasks.push({

                    id: Date.now(),

                    title:
                        document.getElementById("taskTitle").value,

                    subject:
                        document.getElementById("taskSubject").value,

                    due:
                        document.getElementById("taskDue").value,

                    completed: false

                });


                saveData();
                renderAll();
                closeModal();

            }
        );

    }
);


/* ================= ADD CLASS ================= */

document.getElementById("addClassBtn").addEventListener(
    "click",
    () => {

        openModal(
            "Add New Class",
            `
            <form id="classForm">

                <div class="form-group">
                    <label>Subject</label>
                    <input
                        type="text"
                        id="classSubject"
                        required
                        placeholder="Example: Computer Programming 1"
                    >
                </div>

                <div class="form-group">
                    <label>Teacher</label>
                    <input
                        type="text"
                        id="classTeacher"
                        required
                        placeholder="Teacher name"
                    >
                </div>

                <div class="form-group">
                    <label>Day</label>

                    <select id="classDay" required>

                        <option value="">Select Day</option>
                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>

                    </select>

                </div>

                <div class="form-group">
                    <label>Time</label>
                    <input
                        type="text"
                        id="classTime"
                        required
                        placeholder="8:00 AM - 10:00 AM"
                    >
                </div>

                <div class="form-group">
                    <label>Room</label>
                    <input
                        type="text"
                        id="classRoom"
                        placeholder="Room 101"
                    >
                </div>

                <button class="primary-btn form-submit">
                    Add Class
                </button>

            </form>
            `
        );


        document.getElementById("classForm").addEventListener(
            "submit",
            event => {

                event.preventDefault();

                classes.push({

                    id: Date.now(),

                    subject:
                        document.getElementById("classSubject").value,

                    teacher:
                        document.getElementById("classTeacher").value,

                    day:
                        document.getElementById("classDay").value,

                    time:
                        document.getElementById("classTime").value,

                    room:
                        document.getElementById("classRoom").value

                });


                saveData();
                renderAll();
                closeModal();

            }
        );

    }
);


/* ================= ADD REVIEWER ================= */

document.getElementById("addReviewerBtn").addEventListener(
    "click",
    () => {

        openModal(
            "Add Reviewer",
            `
            <form id="reviewerForm">

                <div class="form-group">
                    <label>Reviewer Title</label>
                    <input
                        type="text"
                        id="reviewerTitle"
                        required
                        placeholder="Java Reviewer"
                    >
                </div>

                <div class="form-group">
                    <label>Subject</label>
                    <input
                        type="text"
                        id="reviewerSubject"
                        required
                        placeholder="Computer Programming 1"
                    >
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea
                        id="reviewerDescription"
                        required
                        placeholder="Short description..."
                    ></textarea>
                </div>

                <div class="form-group">
                    <label>Material Link</label>
                    <input
                        type="url"
                        id="reviewerLink"
                        placeholder="https://..."
                    >
                </div>

                <button class="primary-btn form-submit">
                    Add Reviewer
                </button>

            </form>
            `
        );


        document.getElementById("reviewerForm").addEventListener(
            "submit",
            event => {

                event.preventDefault();

                reviewers.push({

                    id: Date.now(),

                    title:
                        document.getElementById("reviewerTitle").value,

                    subject:
                        document.getElementById("reviewerSubject").value,

                    description:
                        document.getElementById("reviewerDescription").value,

                    link:
                        document.getElementById("reviewerLink").value || "#"

                });


                saveData();
                renderAll();
                closeModal();

            }
        );

    }
);


/* ================= ADD TEACHER ================= */

document.getElementById("addTeacherBtn").addEventListener(
    "click",
    () => {

        openModal(
            "Add Teacher",
            `
            <form id="teacherForm">

                <div class="form-group">
                    <label>Teacher Name</label>

                    <input
                        type="text"
                        id="teacherName"
                        required
                        placeholder="Teacher name"
                    >

                </div>

                <div class="form-group">
                    <label>Subject</label>

                    <input
                        type="text"
                        id="teacherSubject"
                        required
                        placeholder="Subject"
                    >

                </div>

                <div class="form-group">
                    <label>Email</label>

                    <input
                        type="email"
                        id="teacherEmail"
                        placeholder="teacher@example.com"
                    >

                </div>

                <button class="primary-btn form-submit">
                    Add Teacher
                </button>

            </form>
            `
        );


        document.getElementById("teacherForm").addEventListener(
            "submit",
            event => {

                event.preventDefault();

                teachers.push({

                    id: Date.now(),

                    name:
                        document.getElementById("teacherName").value,

                    subject:
                        document.getElementById("teacherSubject").value,

                    email:
                        document.getElementById("teacherEmail").value

                });


                saveData();
                renderAll();
                closeModal();

            }
        );

    }
);


/* ================= SEARCH ================= */

document.getElementById("searchInput").addEventListener(
    "input",
    event => {

        const search = event.target.value.toLowerCase();

        document.querySelectorAll(
            ".task-item, .class-card, .reviewer-card, .teacher-card"
        ).forEach(item => {

            item.style.display =
                item.textContent.toLowerCase().includes(search)
                    ? ""
                    : "none";

        });

    }
);


/* ================= NOTIFICATIONS ================= */

function renderNotifications() {

    const container = document.getElementById("notificationList");

    const pending = tasks.filter(task => !task.completed);

    const count = pending.length;

    const badge = document.getElementById("notificationCount");

    if (count > 0) {

        badge.style.display = "flex";
        badge.textContent = count;

    } else {

        badge.style.display = "none";

    }


    if (count === 0) {

        container.innerHTML = `
            <div class="notification-item">
                🎉 You're all caught up!
            </div>
        `;

        return;
    }


    container.innerHTML = pending.slice(0, 5).map(task => `

        <div class="notification-item">

            📝 <strong>
                ${escapeHTML(task.title)}
            </strong>

            <br>

            <small>
                Due: ${escapeHTML(task.due)}
            </small>

        </div>

    `).join("");

}


document.getElementById("notificationBtn").addEventListener(
    "click",
    () => {

        document
            .getElementById("notificationBox")
            .classList.toggle("show");

    }
);


/* ================= SECURITY HELPERS ================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

    return String(value)
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


/* ================= START ================= */

updateDate();
renderAll();
