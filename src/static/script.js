function playSound(sound) {
    
    let audio;

    if (sound === 'kick') {

        audio = new Audio("static/kick.wav");
    }

    if(audio) {
        audio.play();
    }
}






let drumPattern = [1,0,1,0,1,0,1,0];

let bpm = 120;

function playPattern() {
    let interval = (60/bpm) * 500;
    let step = 0;

    const playStep = setInterval(() => {

        let sound = drumPattern[step];
        if (sound === 1) {
            playSound('kick')
        }
        step++;

        if (step >= drumPattern.length) {
            clearInterval(playStep); 
            
        }

    }, interval);
}

document.querySelector("#play-button").addEventListener("click", playPattern);

document.querySelectorAll(".drum-pad").forEach(button => {
    button.addEventListener("click", function() {
        const sound = this.getAttribute("data-sound");
        playSound(sound);
    });
});