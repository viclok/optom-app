// const buttons = document.getElementsByClassName("optomNoteButton")
const copyBox = document.getElementById("copyBox")

function add_to_note(button) {
    copyBox.value += (button.innerText + " ")
    console.log(copyBox.value)
}

document.querySelectorAll(".optomNoteButton").forEach((button) => {
    button.addEventListener("click", function() {
        add_to_note(button)
    })
})

document.querySelector(".copyButton").addEventListener("click", () => {
    navigator.clipboard.writeText(copyBox.value)
})

// buttons[0].addEventListener('click', add_to_note(buttons[0]))
// console.log(buttons.type)
// buttons.forEach((button) => {
//     button.addEventListener("click", function() {
//         add_to_note(button)
//     })
// });