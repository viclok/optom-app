const copyBox = document.getElementById("copyBox")
const buttonDict = new Map([
    ["Near Phoria", "Phoria @ 33cm"],
    ["Far Phoria", "Phoria @ 3m"],
    ["+2", "Under +2:"],
    ["-2", "Under -2:"],
    ["BI/BO", ".8BI/12BO facility"]
])
var copyState = []
var backup = []
var useBackup = false
var addNewline = false

// Functions
function add_to_note(button) {
    var buttonClasses = button.classList
    if (buttonClasses.contains("undoButton")) {
        if (useBackup) {
            copyState = backup
            useBackup = false
        } else if (addNewline) {
            addNewline = false
        } else {
            copyState.pop()
        }
    } 
    else if (buttonClasses.contains("radioButton")) {
        copyState.push(button.value)
    }
    else if (buttonClasses.contains("clearButton")) {
        backup = copyState
        copyState = []
        useBackup = true
    }
    else if (buttonClasses.contains("newlineButton")) {
        backup = copyState
        addNewline = true
        return
    }
    else if (buttonClasses.contains("phoriaButton")) {
        copyState.push(button.innerText + " " + (Number(button.innerText) % 2 == 0 ? "exo" : "eso"))
    }
    else if (buttonClasses.contains("facilityButton")) {
        copyState.push(button.innerText + " facility")
    }
    else if (buttonClasses.contains("optomNoteButton")) {
        copyState.push((buttonDict.has(button.innerText) ? buttonDict.get(button.innerText): button.innerText))
    }
    if (addNewline) {
        copyState[copyState.length - 1] = "\n" + copyState[copyState.length - 1]
        addNewline = false
    }
    copyBox.value = copyState.join(" ")
}

function openTab(button) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(button.innerText).style.display = "block";
    button.className += " active";
}


// Event Listeners
document.querySelectorAll(".optomNoteButton").forEach((button) => {
    button.addEventListener("click", function() {
        add_to_note(button)
    })
})

document.querySelectorAll(".tablinks").forEach((button) => {
    button.addEventListener("click", function() {
        openTab(button)
    })
})

document.querySelector(".copyButton").addEventListener("click", () => {
    navigator.clipboard.writeText(copyBox.value)
})

document.querySelector(".nRetButton").addEventListener("click", () => {
    document.querySelector(".nretOptions").style.display = "block"
})

document.querySelector(".closeButton").addEventListener("click", () => {
    document.querySelector(".nretOptions").style.display = "none"
})
// Other
document.getElementById("defaultTab").click()
console.log("h")