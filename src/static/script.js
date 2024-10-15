let playStep;  
let isPlaying = false;  // Tracks if sequence is playing
let step = 0;  // Current step in the sequencer
let bpm = 170; // Tempo

// Initialize the sequencer array with 8 steps / 8th notes 
let sequencer = {
    Kick: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    cymbal1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    snare1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    oHatSnareRoll: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    kickRoll: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    snare2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    oHat2SnareR2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    oHat3SnareR3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    crash: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    snare3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

// EQ AREA
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let bufferCache = {};

// Low EQ Setup
let lowEQ = audioContext.createBiquadFilter();
lowEQ.type = 'lowshelf';
lowEQ.frequency.setValueAtTime(300, audioContext.currentTime);
lowEQ.gain.setValueAtTime(0, audioContext.currentTime);
lowEQ.connect(audioContext.destination); // Connect to destination

// Function to load sounds and decode them
function loadSound(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data));
}

// Load sound files and store them in bufferCache
Promise.all([
    loadSound('static/Kick.wav').then(buffer => { bufferCache.Kick = buffer; }),
    loadSound('static/cymbal1.wav').then(buffer => { bufferCache.cymbal1 = buffer; }),
    loadSound('static/snare1.wav').then(buffer => { bufferCache.snare1 = buffer; }),
    loadSound('static/oHatSnareRoll.wav').then(buffer => { bufferCache.oHatSnareRoll = buffer; }),
    loadSound('static/kickRoll.wav').then(buffer => { bufferCache.kickRoll = buffer; }),
    loadSound('static/snare2.wav').then(buffer => { bufferCache.snare2 = buffer; }),
    loadSound('static/oHat2SnareR2.wav').then(buffer => { bufferCache.oHat2SnareR2 = buffer; }),
    loadSound('static/oHat3SnareR3.wav').then(buffer => { bufferCache.oHat3SnareR3 = buffer; }),
    loadSound('static/crash.wav').then(buffer => { bufferCache.crash = buffer; }),
    loadSound('static/snare3.wav').then(buffer => { bufferCache.snare3 = buffer; }),
]);

function playSoundWithEQ(sound) {
    if (!bufferCache[sound]) return;  // Return if sound not loaded

    const source = audioContext.createBufferSource();
    source.buffer = bufferCache[sound];
    source.connect(lowEQ);  // Connect to low EQ
    source.start(0);
}

function updateEQ() {
    const lowGainValue = parseFloat(document.getElementById('low-eq').value);
    lowEQ.gain.setValueAtTime(lowGainValue, audioContext.currentTime);
    console.log("Low EQ Gain:", lowGainValue); // Debug log
}

function toggleStep(sound, stepIndex) {
    sequencer[sound][stepIndex] = sequencer[sound][stepIndex] === 1 ? 0 : 1;  // Toggle step state
    const stepButton = document.querySelector(`.step[data-sound="${sound}"][data-step="${stepIndex}"]`);
    stepButton.classList.toggle('active', sequencer[sound][stepIndex] === 1);  // Add/remove 'active' class
}

function playSequence() {
    if (isPlaying) return;  // Prevent starting multiple sequences
    isPlaying = true;  // Set isPlaying to true

    let interval = (60 / bpm) * 500;  // Set the timing based on bpm
    step = 0;  // Start at the first step

    playStep = setInterval(() => {
        // Play sounds based on the current step
        if (sequencer.Kick[step] === 1) playSoundWithEQ('Kick');
        if (sequencer.cymbal1[step] === 1) playSoundWithEQ('cymbal1');
        if (sequencer.snare1[step] === 1) playSoundWithEQ('snare1');
        if (sequencer.oHatSnareRoll[step] === 1) playSoundWithEQ('oHatSnareRoll');
        if (sequencer.kickRoll[step] === 1) playSoundWithEQ('kickRoll');
        if (sequencer.snare2[step] === 1) playSoundWithEQ('snare2');
        if (sequencer.oHat2SnareR2[step] === 1) playSoundWithEQ('oHat2SnareR2');
        if (sequencer.oHat3SnareR3[step] === 1) playSoundWithEQ('oHat3SnareR3');
        if (sequencer.crash[step] === 1) playSoundWithEQ('crash');
        if (sequencer.snare3[step] === 1) playSoundWithEQ('snare3');

        const currentStepElement = document.querySelector(`.step[data-step="${step}"]`)
        currentStepElement.classList.add('current-step');

        // Remove highlight from the previous step
        if (step > 0) {
            const prevStepElement = document.querySelector(`.step[data-step="${step - 1}"]`);
            if (prevStepElement) {
                prevStepElement.classList.remove('current-step');
            }
        } else {
            // Handle wrap-around
            const lastStepElement = document.querySelector(`.step[data-step="7"]`);
            if (lastStepElement) {
                lastStepElement.classList.remove('current-step');
            }
        }

        step++;  // Move to the next step
        if (step >= 16) {
            step = 0;  // Reset to the first step
        }
    }, interval);
}

function clearSequence() {
    for (const sound in sequencer) {
        sequencer[sound].fill(0);  // Reset all steps for each sound
    }
    // Update the UI to reflect the cleared sequence
    const stepButtons = document.querySelectorAll('.step');
    stepButtons.forEach((button) => {
        button.classList.remove('active');  // Remove 'active' class from all step buttons
    });
}


// Stop the sequence
function stopSequence() {
    if (playStep) {
        clearInterval(playStep);
        playStep = null;  // Clear the interval reference
    }
    isPlaying = false;  // Set isPlaying to false
}

function increaseBPM() {
    bpm += 5; // Increase BPM by 5
    updateBPMDisplay(); // Update the display after changing BPM
}

function decreaseBPM() {
    bpm = Math.max(bpm - 5, 0); // Decrease BPM by 5, ensuring it doesn't go below 0
    updateBPMDisplay(); // Update the display after changing BPM
}

function updateBPMDisplay() {
    document.getElementById('bpm-display').textContent = `BPM: ${bpm}`; // Update the BPM display on the UI
}

// Event listeners for play and stop buttons
document.querySelector("#play-sequence-button").addEventListener("click", playSequence);
document.querySelector("#stop-sequence-button").addEventListener("click", stopSequence);
document.getElementById('clear-sequence-button').addEventListener('click', clearSequence);
document.querySelector("#increment-bpm-button").addEventListener("click", increaseBPM);
document.getElementById('low-eq').addEventListener('input', updateEQ);

// Event listeners for toggling steps in the sequencer
const stepButtons = document.querySelectorAll('.step');  // Get all step buttons
stepButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const sound = button.getAttribute('data-sound');  // Get the sound type
        const stepIndex = button.getAttribute('data-step');  // Get the step index
        toggleStep(sound, stepIndex);  // Toggle the step   
    });
});
