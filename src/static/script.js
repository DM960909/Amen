let playStep;  
let isPlaying = false;  // tracks if sequende playing var
let step = 0;  // Current step in the sequencer
let bpm = 150; //bosh 
// Initialize the sequencer array with 8 steps / 8th notes 
let sequencer = {
    kick: [0, 0, 0, 0, 0, 0, 0, 0],
    snare: [0, 0, 0, 0, 0, 0, 0, 0],
    hihat: [0, 0, 0, 0, 0, 0, 0, 0]
};

function playSound(sound) {
    const audio = new Audio(`static/${sound}.wav`);
    audio.play();
}

// Function to toggle the active state
function toggleStep(sound, stepIndex) {
    sequencer[sound][stepIndex] = sequencer[sound][stepIndex] === 1 ? 0 : 1;  // Toggle step state

    const stepButton = document.querySelector(`.step[data-sound="${sound}"][data-step="${stepIndex}"]`);
    stepButton.classList.toggle('active', sequencer[sound][stepIndex] === 1);
}

// Function to play the sequence
function playSequence() {
    if (isPlaying) return;  // Prevent starting multiple sequences

    let interval = (60 / bpm) * 500;  // Set the timing based on bpm = bpm var 
    isPlaying = true;  // Set isPlaying to true

    playStep = setInterval(() => {
        // Play sounds based on the current step and the active state
        if (sequencer.kick[step] === 1) {
            playSound('kick');
        }
        if (sequencer.snare[step] === 1) {
            playSound('snare');
        }
        if (sequencer.hihat[step] === 1) {
            playSound('hihat');
        }

        step++;  // Move to the next step
        if (step >= 8) {
            step = 0;  // loop set when at end 
        }
    }, interval);
}

// stop the sequence
function stopSequence() {
    if (playStep) {
        clearInterval(playStep);
        playStep = null;  // Clear the interval reference
    }
    isPlaying = false;  // Set isPlaying to false
}

// Event listeners for buttons
document.querySelector("#play-sequence-button").addEventListener("click", playSequence);
document.querySelector("#stop-sequence-button").addEventListener("click", stopSequence);


const stepButtons = document.querySelectorAll('.step');  // Get all step buttons

stepButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const sound = button.getAttribute('data-sound');  // Get the sound type (kick, snare, hihat)
        const stepIndex = button.getAttribute('data-step');  // Get the step index
        toggleStep(sound, stepIndex);  // Toggle the step   
    });
});
