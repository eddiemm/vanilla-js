const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

var minutes = 0, seconds = 0, hundreths = 0;
var timerIntervalId = 0;
var testTextArrayPtr = 0;
var fastestTimes;
var originTextPtr = 0;
var testTextArray = originText.split("");
var highScores = [];
var wordsInTest = originText.split(" ");
var start;
var errorCount = 0;
// TEXTAREA 
// clear the textarea after refreshing browser
window.onload = function(){
    testArea.value = "";
};
// add a maximum length to the textarea equal to the length of the test text
testArea.setAttribute("maxlength", originText.length);


// TIMER   
// Run a standard minute/second/hundredths timer:
// initialise timer
function runTimer(){
    // the timer will only repeated run/begin if the interval ID is the reset value which is 0
    // if this condition is wasnt here, the timer would run repeatedly after reset
    // in other words, only run timer if the timer has not been initialised, 0 means not initialised
    if(timerIntervalId === 0){
        // this variable holds a function (run) which is invoked repeatedly every (10) milliseconds
        // why 10 ms? 
        // 1 s == 1000 ms, hundreth of a second: 1 s/100 = 1000 ms/100 = 10 ms
        start = Date.now();
        console.log(start);
        timerIntervalId = setInterval(run, 10);
    }
}
// Start the timer:
// this is the function which will run every 10 ms
function run(){
    // clear wpm and errors
    document.getElementById("wpmNumber").innerHTML = "";
    document.getElementById("errorsNumber").innerHTML = "";
    // referenced this stackoverflow link to fix a slow timer:
    // https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
    // we need to use the system time to calculate the difference in time from one
    // run of this function to the next in miliseconds. 
    var timeDifference = Date.now() - start;
    console.log("seconds" + Math.floor(timeDifference/10));
    
    // time difference is in milliseconds, so divide by 10 to get hundreths of a second
    hundreths = Math.floor(timeDifference/10);
    
    // increment seconds after hundreths reaches 100
    // reset hundreths back to 0
    if(hundreths >= 100){
        // get the current time for the next time  this function runs
        start = Date.now();
        seconds++;
        hundreths = 0;
    }   
    
    // increment minutes when seconds equals 60 and reset seconds to 0
    // 60 seconds = 1 m
    if(seconds === 60){
        minutes++;
        seconds = 0;
    }

    // using ternary operator to add leading 0 when time is single digit
    // Add leading zero to numbers 9 or below (purely for aesthetics):
    theTimer.textContent = (minutes<10 ? "0" + minutes: minutes) + ":" 
                            + (seconds<10 ? "0" + seconds: seconds) + ":" 
                            + (hundreths<10 ? "0" + hundreths: hundreths);    
}


// Match the text entered with the provided text on the page:
// function takes the key pressed as argument
function checkCharacters(key){
    // keypress event returns a character code which we convert to its ascii code
    let asciiCode = key.keyCode;    

    // if the character converted from the current ascii code does not match
    // the current index in the test string array
    if(String.fromCharCode(asciiCode) !== testTextArray[originTextPtr]){ 
        // make border red
        testWrapper.classList.add("wrong");
        errorCount++;
        // remove blue border
        testWrapper.classList.remove("correct");
        // increment the pointer to the test string array
        ++originTextPtr;
    } else if(String.fromCharCode(asciiCode) === testTextArray[originTextPtr]){ 
        // if the character do match then remove red border
        // and add the blue border
        testWrapper.classList.add("correct");
        testWrapper.classList.remove("wrong");
        // increment the pointer to the test string array
        ++originTextPtr;
    }    

    // reset the pointer to be the last index of the test if the user 
    // continues to press incorrect keys
    if(originTextPtr > testTextArray.length){
        originTextPtr = testTextArray.length;
    }
}


// Reset everything
function resetEverything(){
    // clear the current timer interval
    clearInterval(timerIntervalId);
    // set the tier interval back to 0 to indicate a timer which has not been init.
    timerIntervalId = 0;
    minutes = 0;
    seconds = 0;
    hundreths = 0;
    
    // reset the timer text to 0 time
    theTimer.textContent = "00:00:00";
    // reset the textarea to be empty
    testArea.value = "";
    //reset error count to 0
    errorCount = 0;
    // remove and border notification colors
    testWrapper.classList.remove("correct");
    testWrapper.classList.remove("wrong");
    testWrapper.classList.remove("done");
    // resest test text pointer back to 0 index for next test
    originTextPtr = 0;
    // re-enable the textarea
    testArea.removeAttribute("disabled");
}


// this function ends the test once the value from the text field matches the test
// text exactly
function finishTest(){
    // stop clock
    clearInterval(timerIntervalId);
    // change border to green
    testWrapper.classList.remove("correct");
    testWrapper.classList.remove("wrong");
    testWrapper.classList.add("done");
    // disable test area text
    testArea.setAttribute("disabled", "true");
    // temporarily store time in high score array
    // time is stored in milliseconds for easy sorting in top scores array
    highScores.push((minutes*60000)+(seconds*1000)+(hundreths*10));
    // update the high scores array with the current time
    updateHighScores(highScores);
}


// function checks if the textarea value matches exaclty by characters and length
function checkFinish(){
    if(testArea.value === originText && testArea.value.length == testTextArray.length){
        // wpm formula retrieved from: https://www.speedtypingonline.com/typing-equations
        // (# characters typed/5 characters per word)/ minutes
        document.getElementById("wpmNumber").innerHTML = Math.floor((testTextArray.length/5)/( minutes + (seconds/60) + ( (hundreths*10) /1000) /60));
        document.getElementById("errorsNumber").innerHTML = errorCount;
        finishTest();
    }
}


// functions updates the high scores table
function updateHighScores(highScoresArray){
    // sort high score array in ascending order
    highScores.sort();
    for(let i = 0; i < highScoresArray.length; i++){
        // if high score in array not defined yet set to 0 but do not display
        if(highScores[i] === undefined){
            highScores[i] = 0;
        } else if(highScores[i] !== 0 && i !== 5){
            // if there is no current time and the current index is not the 6th element in the array
            // 6th element not necessary since we are only displaying top 5 scores
            document.getElementById("s"+i).innerHTML = highScores[i] + " ms";
        }
    }
    // remove the 6th element from the high scores array to keep from saving
    // too many times
    if(highScores.length > 5){
        highScores.pop();
    }    
}


// Event listeners for keyboard input and the reset button:
// lister for input
// input fires when a textarea has been changed
testArea.addEventListener("input", runTimer, false);
// listen for keypress
// keypress fires when an alphabetic, numeric, or punctuational character has been pressed
testArea.addEventListener("keypress", checkCharacters, false);
// listen for keydown
// keydown fires when a key is pressed down
// this is needed for backspace since keypress will not return the backspace
// character keycode which is 8
testArea.addEventListener("keydown", function(key){
    // if the character is backspace and the test text array is not at the head
    if(key.keyCode === 8 && originTextPtr > 0){
        // move the test text array pointer back one
        originTextPtr--;
        // if backspace causes pointer to reach beginning of input, then border becomes default color
        if(originTextPtr == 0){
            testWrapper.classList.remove("wrong");
            testWrapper.classList.remove("correct");
        }   
    }
}, false);
// listen for keyup
// fires when a key upstroke is detected.
// this is used to check if the test has been completed
testArea.addEventListener("keyup", checkFinish, false);
// listen for click
// fires when a click is detected
// resets the test
resetButton.addEventListener("click", resetEverything, false);