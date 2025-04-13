var copyBox = document.getElementById("copyBox")
const buttonDict = new Map([
    ["Near Phoria", "Phoria @ 33cm"],
    ["Far Phoria", "Phoria @ 3m"],
    ["+2", "Under +2:"],
    ["-2", "Under -2:"],
    ["BI/BO", "8BI/12BO facility"]
])
const copyButtonGrid = new Map([
    ["BinocularRow", "3 / 4"],
    ["BinocularColumn", "1 / 3"],
    ["Stereo/CVRow", "8 / 9"],
    ["Stereo/CVColumn", "1 / 4"],
    ["PerceptualRow", "18 / 19"],
    ["PerceptualColumn", "1 / 8"]
])
const ngCheckboxArray = Array(14).fill(false);
const threeCycleButtonStates = ["",  "#b8fc94", "#fb8c8a"]

const rainAPIURL = "https://api.open-meteo.com/v1/forecast?latitude=-38.145&longitude=146.787&daily=rain_sum&timezone=auto&forecast_days=1"
var copyState = []
var backup = []
var useBackup = false
var addNewline = false
var useCM = false
var activeButton = false
var currentTimerID = null
var counter = 0
var taasIndex = -1
var tvasIndex = -1
var mvptIndex = -1
var currentTab = ""

function useTimer(button) {
    if (!activeButton) {
        currentTimerID = setInterval(startTimer, 1000)
        
        if (button.value == "demC") {
            document.getElementById("skipOutput").value = 0
            document.getElementById("rptOutput").value = 0
        }
    } else {
        clearInterval(currentTimerID)
        document.getElementById(button.value + "Output").value = counter
        copyState.push(button.innerText + " " + counter + "sec ")

        if (button.value == "demB") {
            copyState.push(`Total=${Number(document.getElementById("demAOutput").value) + counter}`)
        }
        if (button.value == "demC") {
            var skipOutput = Number(document.getElementById("skipOutput").value)
            var rptOutput = Number(document.getElementById("rptOutput").value)

            copyState.push(`${skipOutput} lines skpd, ${rptOutput} lines rpted = ${counter + 4 * (skipOutput - rptOutput)}sec total`)
        }

        copyBox.value = copyState.join(" ")
        counter = 0
    }
    activeButton = !activeButton

}

function startTimer() {
    counter++
    document.getElementById("perceptualTimer").value = counter
}

function threeCycleRotate(button) {
    var state = Number(button.getAttribute('data-state'))
    state = state < 2 ? ++state : 0
    button.setAttribute('data-state', state)
    button.style.backgroundColor = threeCycleButtonStates[state]
}

function renderTVAS() {
    var parentDiv = document.getElementById("ngButtons")
    // console.log(parentDiv.children)
    let tvasCount = 0
    let tvasArray = ["TVAS"]
    for (let i=0 ; i<parentDiv.children.length; i++) {
        if (Number(parentDiv.children[i].getAttribute('data-state')) == 1) {
            tvasCount++
            tvasArray.push(parentDiv.children[i].innerText + ' ✔')
            if (ngCheckboxArray[i]) {
                tvasArray.push("NG")
            }
        } else if (Number(parentDiv.children[i].getAttribute('data-state')) == 2) {
            tvasArray.push(parentDiv.children[i].innerText + " ✖")
            if (ngCheckboxArray[i]) {
                tvasArray.push("NG")
            }
        }
    }
    if (tvasCount < 5) {
        tvasArray.push("(Pre Kinda)")
    } else if (tvasCount < 7) {
        tvasArray.push("(Kinda)")
    } else if (tvasCount < 8) {
        tvasArray.push("(Prep)")
    } else if (tvasCount < 9) {
        tvasArray.push("(Grade 1)")
    } else if (tvasCount < 10) {
        tvasArray.push("(Grade 2)")
    } else if (tvasCount < 12) {
        tvasArray.push("(Grade 3)")
    } else if (tvasCount < 14) {
        tvasArray.push("(Grade 4)")
    } else {
        tvasArray.push("(>Grade 4)")
    }
    return tvasArray
}

// Functions
function add_to_note(button) {
    var buttonClasses = button.classList
    if (!buttonClasses.contains("undoButton")) {
        if (useBackup) {
            useBackup = false;
        }
    }

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
    else if (buttonClasses.contains("taasButton")) {
        if (taasIndex < 0) {
            taasIndex = copyState.length
        }
        threeCycleRotate(button)
        var parentDiv = button.parentElement
        // console.log(parentDiv.children)
        let taasCount = 0
        let taasArray = ["TAAS"]
        for (let child of parentDiv.children) {
            if (Number(child.getAttribute('data-state')) == 1) {
                taasCount++
                taasArray.push(child.innerText + ' ✔')
            } else if (Number(child.getAttribute('data-state')) == 2) {
                taasArray.push(child.innerText + " ✖")
            }
        }
        if (taasCount < 3) {
            taasArray.push("(Pre prep)")
        } else if (taasCount < 6) {
            taasArray.push("(Prep)")
        } else if (taasCount < 9) {
            taasArray.push("(Early grade 1)")
        } else if (taasCount < 12) {
            taasArray.push("(Grade 1)")
        } else if (taasCount < 13) {
            taasArray.push("(Early grade 2)")
        } else if (taasCount < 14) {
            taasArray.push("(Grade 2)")
        } else if (taasCount < 15) {
            taasArray.push("(Early grade 3)")
        } else {
            taasArray.push("(Grade 3)")
        }
        copyState[taasIndex] = taasArray.join(" ")
    }
    else if (buttonClasses.contains("tvasButton")) {
        if (tvasIndex < 0) {
            tvasIndex = copyState.length
        }
        threeCycleRotate(button)
        let tvasArray = renderTVAS()
        copyState[tvasIndex] = tvasArray.join(" ")
    }
    else if (buttonClasses.contains("tvasNGButton")) {
        if (tvasIndex < 0) {
            tvasIndex = copyState.length
        }
        ngCheckboxArray[Number(button.value)] = !ngCheckboxArray[Number(button.value)]
        let tvasArray = renderTVAS()
        copyState[tvasIndex] = tvasArray.join(" ")
    }
    else if (buttonClasses.contains("mvptButton")) {
        if (mvptIndex < 0) {
            mvptIndex = copyState.length
        }
        threeCycleRotate(button)
        var parentDiv = button.parentElement
        // console.log(parentDiv.children)
        let mvptCount = 0
        let mvptArray = ["MVPT"]
        for (let child of parentDiv.children) {
            if (Number(child.getAttribute('data-state')) == 1) {
                mvptCount++
                mvptArray.push(child.innerText + ' ✔')
            } else if (Number(child.getAttribute('data-state')) == 2) {
                mvptArray.push(child.innerText + " ✖")
            }
        }
        mvptArray.push("Total Correct = " + mvptCount)
        copyState[mvptIndex] = mvptArray.join(" ")
    }
    else if  (buttonClasses.contains("checkboxButton")) {
        useCM = !useCM
    }
    else if  (buttonClasses.contains("demButton")) {
        useTimer(button)
    } else if  (buttonClasses.contains("demHelpButton")) {
        var count = document.getElementById(button.value + "Output")
        count.value = Number(count.value) + 1
        return
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
                copyState.push(`Rainfall today is ${data.daily.rain_sum[0]}mm in Rosedale`)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    else if (buttonClasses.contains("monroeSubmitButton")) {
        var monroeValue = Number(document.getElementById("monroeInput").value)
        var monroeScore = "Monroe V3 score = " + monroeValue + " "
        if (monroeValue < 4) {
            monroeScore += "(<age 5)"
        } else if (monroeValue < 6) {
            monroeScore += "(age 5)"
        } else if (monroeValue < 7) {
            monroeScore += "(age 6)"
        } else if (monroeValue < 8) {
            monroeScore += "(age 6.5)"
        } else if (monroeValue < 9) {
            monroeScore += "(age 7)"
        } else if (monroeValue < 10) {
            monroeScore += "(age 8)"
        } else if (monroeValue < 11) {
            monroeScore += "(age 9)"
        } else {
            monroeScore += "(>=age 10)"
        }
        copyState.push(monroeScore)
    }
    else if (buttonClasses.contains("radioButton")) {
        copyState.push(button.value)
    }
    else if (buttonClasses.contains("clearButton")) {
        backup = copyState
        taasIndex = -1
        tvasIndex = -1
        mvptIndex = -1
        copyState = []
        useBackup = true
        if (currentTab == "Perceptual") {
            console.log("Perceptual")
            for (let child of document.getElementById("demValues").children) {
                child.value = 0
            }
            for (let child of document.getElementById("taasButtons").children) {
                child.setAttribute('data-state', 0)
                child.style.backgroundColor = threeCycleButtonStates[0]
            }
            for (let child of document.getElementById("ngButtons").children) {
                child.setAttribute('data-state', 0)
                child.style.backgroundColor = threeCycleButtonStates[0]
            }
            for (let child of document.getElementById("mvptButtons").children) {
                child.setAttribute('data-state', 0)
                child.style.backgroundColor = threeCycleButtonStates[0]
            }
            document.querySelectorAll('#ngButtonCheckboxes input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
              });
        }
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
    if (addNewline & !activeButton) {
        copyState[copyState.length - 1] = "\n" + copyState[copyState.length - 1]
        console.log(copyState)
        addNewline = false
    }
    copyBox.value = copyState.join(" ")
    // console.log(copyState)
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
    // console.log(document.getElementById(button.innerText))
    copyBox = document.getElementById(button.innerText).appendChild(document.getElementById('copyBox').parentElement.removeChild(document.getElementById('copyBox')))
    // console.log(copyBox.value)
    copyBox.style.gridRow = copyButtonGrid.get(button.innerText + "Row")
    copyBox.style.gridColumn = copyButtonGrid.get(button.innerText + "Column")
    button.className += " active";
    currentTab = document.getElementById(button.innerText).id
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

document.querySelectorAll(".copyButton").forEach((button) => {
    button.addEventListener("click", () => {
        navigator.clipboard.writeText(copyBox.value)
    })
})

// document.querySelectorAll(".tvasNGButton").forEach((button) => {
//     button.addEventListener("click", () => {
//         ngCheckboxArray[Number(button.value)] = !ngCheckboxArray[Number(button.value)]
//     })
// })

document.querySelector(".nRetButton").addEventListener("click", () => {
    document.querySelector(".nretOptions").style.display = "block"
})

// document.querySelectorAll(".demButton").forEach((button) => {
//     button.addEventListener("click", function() {
//         useTimer(button)
//     })
// })

// document.querySelectorAll(".demHelpButton").forEach((button) => {
//     button.addEventListener("click", function() {
//         var count = document.getElementById(button.value + "Output")
//         count.value = Number(count.value) + 1
//     })
// })

// Other
document.getElementById("defaultTab").click()