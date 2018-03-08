/**
 * Circuit Playground Virtual Jump Rope
 *
 * Loosely based on https://www.bandainamco-am.com/game.php?gameid=7
 *
 * Jump over the green dot by using a gator clip on A7
*/
const MAX_ROPE = 10;
const START_TIME = 300;
const PAD_INDEX = 4;
const pad = input.pinA1;
let ropeIndex = -1;
let score = 0;
let inAir = true;
let isRunning = false;


function reset() {
    score = 0;
    ropeIndex = -1;
    light.stopAllAnimations();
    isRunning = false;
    light.setAll(Colors.Black);
    light.setPixelColor(PAD_INDEX, Colors.Green);
}

function fail() {
    light.setAll(Colors.Red);
    music.playSoundUntilDone(music.sounds(Sounds.Wawawawaa));
    reset();
}

function swingRope() {
    light.setAll(Colors.Black);
    light.setPixelColor(PAD_INDEX, Colors.Green);
    // Loop around
    if (ropeIndex >= MAX_ROPE) {
        ropeIndex = -1;
        // Give a point on each rotation
        score++;
    }
    ropeIndex++;
    if (!inAir && (ropeIndex === PAD_INDEX)) {
        return fail();
    // Wiggle room of 2 spots
    } else if (inAir && (Math.abs(PAD_INDEX - ropeIndex) >= 3)) {
        return fail();
    }
    light.setPixelColor(ropeIndex, Colors.Orange);
    // Decrease pause as scores get higher
    loops.pause(START_TIME - (score * 50));
}

pad.onEvent(ButtonEvent.Down, () => {
    inAir = false;
    if (!isRunning) {
        isRunning = true;
    }
})

pad.onEvent(ButtonEvent.Up, () => {
    inAir = true;
    music.playSound(music.sounds(Sounds.JumpUp));
});

loops.forever(() => {
    if (isRunning) {
        swingRope();
    }
});
