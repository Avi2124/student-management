let page = 1;
let limit = 5;

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("loginBtn").addEventListener("click", login);
    document.getElementById("logoutBtn").addEventListener("click", logout);
    document.getElementById("addBtn").addEventListener("click", addStudent);
    document.getElementById("prevBtn").addEventListener("click", prevPage);
    document.getElementById("nextBtn").addEventListener("click", nextPage);

    document.getElementById("search").addEventListener("keyup", () => loadStudents(1));

    document.getElementById("filterBtn").addEventListener("click", () => loadStudents(1));

    document.getElementById("table").addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            deleteStudent(e.target.dataset.id);
        }
    });

});

async function login(){

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if(data.success){
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("app").style.display = "block";
        loadStudents(1);
    } else {
        alert(data.message);
    }
}

async function logout(){

    await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include"
    });

    location.reload();
}

async function addStudent(){

    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("age", document.getElementById("age").value);
    formData.append("city", document.getElementById("city").value);
    formData.append("photo", document.getElementById("photo").files[0]);

    await fetch("/api/students", {
        method: "POST",
        credentials: "include",
        body: formData
    });

    loadStudents(page);
}

document.addEventListener("DOMContentLoaded", async () => {

    try {
        const res = await fetch("/api/auth/check-auth", {
            credentials: "include"
        });

        const data = await res.json();

        if (data.success) {

            document.getElementById("loginBox").style.display = "none";
            document.getElementById("app").style.display = "block";

            loadStudents(1);
        }

    } catch (err) {
        console.log(err);
    }

});

async function loadStudents(p = 1){

    page = p;

    const search = document.getElementById("search").value;
    const city = document.getElementById("cityFilter").value;

    const res = await fetch(
        `/api/students?page=${page}&limit=${limit}&city=${city}&search=${search}`,
        { credentials: "include" }
    );

    const data = await res.json();

    document.getElementById("pageNo").innerText = page;

    let rows = "";

    data.data.forEach(s => {
        rows += `
        <tr>
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.age}</td>
            <td>${s.city}</td>
            <td>
                ${s.photo ? `<img src="/uploads/${s.photo}" width="50">` : "No Photo"}
            </td>
            <td>
                <button class="delete-btn" data-id="${s.id}">Delete</button>
            </td>
        </tr>`;
    });

    document.getElementById("table").innerHTML = rows;
}

async function deleteStudent(id){

    await fetch(`/api/students/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    loadStudents(page);
}

function nextPage(){
    page++;
    loadStudents(page);
}

function prevPage(){
    if(page > 1){
        page--;
        loadStudents(page);
    }
}
