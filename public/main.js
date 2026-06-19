document
  .getElementById("loadBtn")
  .addEventListener("click", getStudents);

async function getStudents() {
  try {
    const response = await fetch(
      "/api/students?page=1&limit=5"
    );

    const data = await response.json();

    document.getElementById("result").innerText =
      JSON.stringify(data, null, 2);

  } catch (err) {
    console.error(err);
  }
}

const socket = io();

socket.emit("message", "Hello Server");

socket.on("message", (msg) => {
  console.log(msg);
});