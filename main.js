const audioCtx = new AudioContext()

const Note_Details = [
    { note: "AA", key: "A", frequency: 500, active: false },
    { note: "SS", key: "S", frequency: 475, active: false },
    { note: "DD", key: "D", frequency: 450, active: false },
    { note: "FF", key: "F", frequency: 425, active: false },
    { note: "GG", key: "G", frequency: 400, active: false },
    { note: "HH", key: "H", frequency: 375, active: false },
    { note: "JJ", key: "J", frequency: 350, active: false },
    { note: "KK", key: "K", frequency: 325, active: false },
    { note: "LL", key: "L", frequency: 300, active: false },
    { note: "SE", key: "Semicolon", frequency: 275, active: false },
    { note: "WW", key: "W", frequency: 250, active: false },
    { note: "EE", key: "E", frequency: 225, active: false },
    { note: "TT", key: "T", frequency: 200, active: false },
    { note: "YY", key: "Y", frequency: 175, active: false },
    { note: "UU", key: "U", frequency: 150, active: false },
    { note: "OO", key: "O", frequency: 125, active: false },
    { note: "PP", key: "P", frequency: 100, active: false },
]

function findNoteFromKeyboardKey(key) {
    //Doing this ternary as semiColon key code is Semicolon and it does not follow the same pattern
    return Note_Details.find((note) => note.key === "Semicolon" ? note.key === key : `Key${note.key}` === key)
}

document.addEventListener("keydown", (e) => {

    //To stop the key propogation and execute it for once
    if (e.repeat === true) return

    //Only defined Keys if other than defined then return
    const notePlayed = findNoteFromKeyboardKey(e.code)
    if (notePlayed === undefined) return

    //Currently Played note is active now
    notePlayed.active = true

    playNote()

})

function playNote() {

    console.log('Playing Notes dear')

    //Adding active class to active notes for UI experience
    Note_Details.forEach((note) => {
        const element = document.querySelector(`[data-note=${note.note}`)
        element.classList.toggle("active", note.active === true)

        //stop playing note so that new one is played and prev is closed
        if (note.oscillator !== undefined) {
            note.oscillator.stop()
            note.oscillator.disconnect()
        }

    })

    const activeNotes = Note_Details.filter((note) => note.active === true)

    //Setting Volume 1, 0.5, 0.25% if I dont do that 
    //volume for two nodes would be 200% (100% per note)
    const volume = 1 / activeNotes.length

    activeNotes.forEach((note) => {
        startNote(note, volume)
    })

}

function startNote(noteDetails, gain) {

    //Volume
    const gainNode = audioCtx.createGain()
    gainNode.gain.value = gain

    //noteDetails { note: "LL", key: "L", frequency: 325, active: false },
    //Produce the sound
    const oscillator = audioCtx.createOscillator()
    oscillator.type = "sine"
    oscillator.frequency.value = noteDetails.frequency // value in hertz
    oscillator.connect(gainNode).connect(audioCtx.destination) //connect speakers
    oscillator.start()

    //To make ocillator acceible globally saving it in object
    noteDetails.oscillator = oscillator

    //After this keyup event follows up
}

document.addEventListener("keyup", (e) => {

    const notePlayed = findNoteFromKeyboardKey(e.code)
    if (notePlayed === undefined) return

    notePlayed.active = false
    playNote()

})

function stopNote() {
    console.log('Stopped Playing')
}