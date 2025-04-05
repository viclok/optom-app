const copyBox = document.getElementById("copyBox")
const buttonDict = new Map([
    ["Near Phoria", "Phoria @ 33cm"],
    ["Far Phoria", "Phoria @ 3m"],
    ["+2", "Under +2:"],
    ["-2", "Under -2:"],
    ["BI/BO", "8BI/12BO facility"]
])
const rainAPIURL = "https://api.open-meteo.com/v1/forecast?latitude=-37.9713&longitude=146.9837&daily=rain_sum&timezone=auto&forecast_days=1"

var copyState = []
var backup = []
var useBackup = false
var addNewline = false
var useCM = false

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
    else if  (buttonClasses.contains("checkboxButton")) {
        useCM = !useCM
    } 
    else if (buttonClasses.contains("rainButton")) {
        fetch(rainAPIURL)
            .then(response => {
                if (!response.ok) {
                // throw new Error('Network response was not ok');
                    console.log("Error with API")
                }
                return response.json();
            })
            .then(data => {
                console.log(data.daily.rain_sum[0]);
                copyState.push(`Rainfall today is ${data.daily.rain_sum[0]}mm in Maffra`)
            })
            .catch(error => {
                console.error('Error:', error);
            });
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
        var suffix = "cm"
        if (!useCM) {
            suffix = (Number(button.innerText) % 2 == 0 ? " exo" : " eso")
        }
        copyState.push(button.innerText + suffix)
    }
    else if (buttonClasses.contains("facilityButton")) {
        copyState.push(button.innerText + " facility")
    }
    else if (buttonClasses.contains("optomNoteButton")) {
        copyState.push((buttonDict.has(button.innerText) ? buttonDict.get(button.innerText): button.innerText))
    }
    if (addNewline) {
        copyState[copyState.length - 1] = "\n" + copyState[copyState.length - 1]
        console.log(copyState)
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
    document.getElementById(button.innerText).style.display = "grid";
    button.className += " active";
}

function updateTime() {
    var date = new Date()
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var s = date.getSeconds();
    var m = date.getMinutes();
    var h = date.getHours();

    // This arrangement can be altered based on how we want the date's format to appear.
    var currentDate = `${day}-${month}-${year} ` + ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
    // console.log(currentDate); // "17-6-2022"
    document.querySelector(".datetime").innerHTML = currentDate
}

setInterval(updateTime, 1000)


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


// Other
document.getElementById("defaultTab").click()
console.log("h")