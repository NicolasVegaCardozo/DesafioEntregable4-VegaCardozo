const socket = io()

const form = document.getElementById("formProduct")

form.addEventListener("submit", (e) => {
    e.preventDefault()
    console.log(e.target)
    const datForm = new FormData(e.target)
    const prod = Object.fromEntries(datForm)
    console.log(prod)
    socket.emit("nuevoProducto", prod)
    socket.on("MensajeProductoCreado", (mensaje) => {

        Swal.fire(
            mensaje
        )
        
    })
    e.target.reset
})