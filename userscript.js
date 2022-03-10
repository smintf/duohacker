// ==UserScript==
// @name              Duohacker
// @namespace         https://www.duolingo.com/
// @homepageURL       https://github.com/smintf/duohacker
// @supportURL        https://github.com/smintf/duohacker/issues
// @version           1.0.3
// @description       An autoanswer script for Duolingo.
// @author            Smint <smintoverflow@gmail.com>
// @copyright         Smint
// @match             https://www.duolingo.com/skill*
// @match             https://www.duolingo.com/alphabet*
// @match             https://www.duolingo.com/checkpoint*
// @match             https://www.duolingo.com/stories*
// @license           MIT
// @grant             none
// @run-at            document-end
// ==/UserScript==

// ==OpenUserJS==
// @author smintf
// ==/OpenUserJS==

const DEBUG = true;
let mainInterval;
const dataTestComponentClassName = 'e4VJZ';
const TIME_OUT = 1000;

// Challenge types
const CHARACTER_SELECT_TYPE = 'characterSelect';
const CHARACTER_MATCH_TYPE = 'characterMatch';
const TRANSLATE_TYPE = 'translate';
const LISTEN_TAP_TYPE = 'listenTap';
const NAME_TYPE = 'name';
const COMPLETE_REVERSE_TRANSLATION_TYPE = 'completeReverseTranslation';
const LISTEN_TYPE = 'listen';
const SELECT_TYPE = 'select';
const JUDGE_TYPE = 'judge';
const FORM_TYPE = 'form';
const LISTEN_COMPREHENSION_TYPE = 'listenComprehension';
const READ_COMPREHENSION_TYPE = 'readComprehension';
const CHARACTER_INTRO_TYPE = 'characterIntro';
const DIALOGUE_TYPE = 'dialogue';
const SELECT_TRANSCRIPTION_TYPE = 'selectTranscription';
const SPEAK_TYPE = 'speak';
const SELECT_PRONUNCIATION_TYPE = 'selectPronunciation';

// W.I.P
const ASSIST_TYPE = 'assist'
const TAP_COMPLETE_TYPE = 'tapComplete';
const GAP_FILL_TYPE = 'gapFill';
const CHARACTER_TRACE_TYPE = 'characterTrace';
const CHALLENGE_PUZZLE_TYPE = 'characterPuzzle';
const DEFINITION_TYPE = 'definition';
const MATCH_TYPE = 'match';
const TAP_DESCRIBE_TYPE = 'tapDescribe';
const FREE_RESPONSE_TYPE = 'freeResponse';

// Query DOM keys
const CHALLENGE_CHOICE_CARD = '[data-test="challenge-choice-card"]';
const CHALLENGE_CHOICE = '[data-test="challenge-choice"]';
const CHALLENGE_TRANSLATE_INPUT = '[data-test="challenge-translate-input"]';
const CHALLENGE_LISTEN_TAP = '[data-test="challenge-listenTap"]';
const CHALLENGE_JUDGE_TEXT = '[data-test="challenge-judge-text"]';
const CHALLENGE_TEXT_INPUT = '[data-test="challenge-text-input"]';
const CHALLENGE_TAP_TOKEN = '[data-test="challenge-tap-token"]';
const PLAYER_NEXT = '[data-test="player-next"]';
const PLAYER_SKIP = '[data-test="player-skip"]';
const AUDIO_BUTTON = '[data-test="audio-button"]';
const WORD_BANK = '[data-test="word-bank"]';
const BLAME_INCORRECT = '[data-test="blame-incorrect"]';
const CHARACTER_MATCH = '[data-test="challenge challenge-characterMatch"]';
const STORIES_PLAYER_NEXT = '[data-test="stories-player-continue"]';
const STORIES_CHOICE = '[data-test="stories-choice"]';
const STORIES_ELEMENT = '[data-test="stories-element"]';


// Mouse Click
const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
});

// Gets Challenge Object
function getChallengeObj(theObject) {
    let result = null;
    if (theObject instanceof Array) {
        for (let i = 0; i < theObject.length; i++) {
            result = getChallengeObj(theObject[i]);
            if (result) {
                break;
            }
        }
    }
    else {
        for (let prop in theObject) {
            if (prop == 'challenge') {
                if (typeof theObject[prop] == 'object') {
                    return theObject;
                }
            }
            if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                result = getChallengeObj(theObject[prop]);
                if (result) {
                    break;
                }
            }
        }
    }
    return result;
}


// Gets the Challenge
function getChallenge() {
    const dataTestDOM = document.getElementsByClassName(dataTestComponentClassName)[0];

    if (!dataTestDOM) {
        document.querySelectorAll(PLAYER_NEXT)[0].dispatchEvent(clickEvent);
        return null;
    } else {
        const dataTestAtrr = Object.keys(dataTestDOM).filter(att => /^__reactProps/g.test(att))[0];
        const childDataTestProps = dataTestDOM[dataTestAtrr];
        const { challenge } = getChallengeObj(childDataTestProps);
        return challenge;
    }
}

// pressEnter() function
function pressEnter() {
    const clickEvent = new MouseEvent("click", {
    "view": window,
    "bubbles": true,
    "cancelable": false
    });
    document.querySelector('button[data-test="player-next"]').dispatchEvent(clickEvent);
    }

// pressEnter() function but for stories
function pressEnterStories() {
    const clickEvent = new MouseEvent("click", {
    "view": window,
    "bubbles": true,
    "cancelable": false
    });
    document.querySelector('button[data-test="stories-player-continue"]').dispatchEvent(clickEvent);
    }

function dynamicInput(element, msg) {
    let input = element;
    let lastValue = input.value;
    input.value = msg;
    let event = new Event('input', { bubbles: true });
    event.simulated = true;
    let tracker = input._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
}

// Solves the Challenge
function classify() {
    const challenge = getChallenge();
    if (!challenge) return;
    if (DEBUG) console.log(`${challenge.type}`, challenge);
    switch (challenge.type) {
        case GAP_FILL_TYPE:
        case SELECT_TYPE:
        case SELECT_PRONUNCIATION_TYPE:
        case READ_COMPREHENSION_TYPE:
        case LISTEN_COMPREHENSION_TYPE:
        case CHARACTER_SELECT_TYPE:
        case FORM_TYPE: {
            const { choices, correctIndex } = challenge;
            if (DEBUG) console.log('READ_COMPREHENSION, LISTEN_COMPREHENSION, CHARACTER_SELECT_TYPE, GAP_FILL_TYPE, SELECT_PRONUNCIATION_TYPE', { choices, correctIndex });
            document.querySelectorAll(CHALLENGE_CHOICE)[correctIndex].dispatchEvent(clickEvent);
            return { choices, correctIndex };
        }

        case TAP_COMPLETE_TYPE: {
            const { choices, correctIndices } = challenge;
            const tokens = document.querySelectorAll(WORD_BANK);
            if (DEBUG) console.log('TAP_COMPLETE_TYPE', { choices, correctIndices, tokens });
            correctIndices.forEach((index) => {
                for(let x = 0; x < correctIndices.length; x++) {
                    console.log('Value of CorrectIndices[', x , ']',  correctIndices[i]);
                    let hmm = correctIndices[x]
                    tokens[hmm].dispatchEvent(clickEvent);
                }                
            })
            return { choices, correctIndices };
        }

        case MATCH_TYPE:
        {
            const { pairs } = challenge;
            const tokens = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
            if (DEBUG) console.log('CHARACTER_MATCH_TYPE', { tokens, pairs });
            pairs.forEach((pair) => {
                for(let i = 0; i < tokens.length; i++) {
                    if(tokens[i].innerText === pair.fromToken || tokens[i].innerText === pair.learningToken) {
                        tokens[i].dispatchEvent(clickEvent);
                    }
                }
            })
            return { pairs };
        }
        case CHARACTER_MATCH_TYPE: {
            const { pairs } = challenge;
            const tokens = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
            if (DEBUG) console.log('CHARACTER_MATCH_TYPE', { tokens, pairs });
            pairs.forEach((pair) => {
                for(let i = 0; i < tokens.length; i++) {
                    if(tokens[i].innerText === pair.transliteration || tokens[i].innerText === pair.character) {
                        tokens[i].dispatchEvent(clickEvent);
                    }
                }
            })
            return { pairs };
        }

        case TRANSLATE_TYPE: {
            const { correctTokens, correctSolutions } = challenge;
            if (DEBUG) console.log('TRANSLATE_TYPE', { correctTokens, correctSolutions });
            if (correctTokens) {
                const tokens = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
                let ignoreTokeIndexes = [];
                for (let correctTokenIndex in correctTokens) {
                    for (let tokenIndex in tokens) {
                        const token = tokens[tokenIndex];
                        if (ignoreTokeIndexes.includes(tokenIndex)) continue;
                        if (token.innerText === correctTokens[correctTokenIndex]) {
                            token.dispatchEvent(clickEvent);
                            ignoreTokeIndexes.push(tokenIndex);
                            if(DEBUG) console.log(`correctTokenIndex [${correctTokens[correctTokenIndex]}] - tokenIndex [${token.innerText}]`);
                            break;
                        };
                    }
                }
            } else if (correctSolutions) {
                let textInputElement = document.querySelectorAll(CHALLENGE_TRANSLATE_INPUT)[0];
                dynamicInput(textInputElement, correctSolutions[0]);
            }

            return { correctTokens };
        }

        case NAME_TYPE: {
            const { correctSolutions } = challenge;
            if (DEBUG) console.log('NAME_TYPE', { correctSolutions });
            let textInputElement = document.querySelectorAll(CHALLENGE_TEXT_INPUT)[0];
            let correctSolution = correctSolutions[0];
            dynamicInput(textInputElement, correctSolution);
            return { correctSolutions };
        }

        case COMPLETE_REVERSE_TRANSLATION_TYPE: {
            const { displayTokens } = challenge;
            if (DEBUG) console.log('COMPLETE_REVERSE_TRANLATION_TYPE', { displayTokens });
            const { text } = displayTokens.filter(token => token.isBlank)[0];
            let textInputElement = document.querySelectorAll(CHALLENGE_TEXT_INPUT)[0];
            dynamicInput(textInputElement, text);
            return { displayTokens };
        }

        case LISTEN_TAP_TYPE: {
            const { correctTokens } = challenge;
            if (DEBUG) console.log('LISTEN_TAP_TYPE', { correctTokens });
            const tokens = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
            for (let wordIndex in correctTokens) {
                tokens.forEach((token) => {
                    if (token.innerText === correctTokens[wordIndex]) {
                        token.dispatchEvent(clickEvent);
                    };
                });
            }
            return { correctTokens };
        }

        case LISTEN_TYPE: {
            const { prompt } = challenge;
            if (DEBUG) console.log('LISTEN_TYPE', { prompt });
            let textInputElement = document.querySelectorAll(CHALLENGE_TRANSLATE_INPUT)[0];
            dynamicInput(textInputElement, prompt);
            return { prompt };
        }

        case JUDGE_TYPE: {
            const { correctIndices } = challenge;
            if (DEBUG) console.log('JUDGE_TYPE', { correctIndices });
            document.querySelectorAll(CHALLENGE_JUDGE_TEXT)[correctIndices[0]].dispatchEvent(clickEvent);
            return { correctIndices };
        }

        case DIALOGUE_TYPE:
        case CHARACTER_INTRO_TYPE: {
            const { choices, correctIndex } = challenge;
            if (DEBUG) console.log('CHARACTER_INTRO_TYPE, DIALOGUE_TYPE', { choices, correctIndex });
            document.querySelectorAll(CHALLENGE_JUDGE_TEXT)[correctIndex].dispatchEvent(clickEvent);
            return { choices, correctIndex };
        }

        case SELECT_TRANSCRIPTION_TYPE: {
            const { choices, correctIndex } = challenge;
            if (DEBUG) console.log('SELECT_TRANSCRIPTION_TYPE', { choices, correctIndex });
            document.querySelectorAll(CHALLENGE_JUDGE_TEXT)[correctIndex].dispatchEvent(clickEvent);
            return { choices, correctIndex };
        }

        case SPEAK_TYPE: {
            const { prompt } = challenge;
            if (DEBUG) console.log('SPEAK_TYPE', { prompt });
            document.querySelectorAll(PLAYER_SKIP)[0].dispatchEvent(clickEvent);
            return { prompt };
        }

        default:
            break;
    }
}

// Stops the userscript when an answer is incorrect
function breakWhenIncorrect() {
    const isBreak = document.querySelectorAll(BLAME_INCORRECT).length > 0;
    if (isBreak) {
        console.log('Incorrect, stopped');
        clearInterval(mainInterval);
    };
}

// Main Function
function main() {
    try {
        let isPlayerNext = document.querySelectorAll(PLAYER_NEXT)[0].textContent.toUpperCase();
        if (isPlayerNext.valueOf() !== 'CONTINUE') {
            classify();
            breakWhenIncorrect();
            pressEnter();
        }
        setTimeout(pressEnter, 150);
    } catch (e) {
        console.log(e);
    }
}

// Stories Function
function stories() {
    try {
        let isPlayerNext = document.querySelectorAll(STORIES_PLAYER_NEXT)[0].textContent.toUpperCase();
        if (isPlayerNext.valueOf() !== 'CONTINUE') {
            classify();
            pressEnterStories();
        }
        setTimeout(pressEnterStories, 50);
    } catch (e) {
        console.log(e);
    }
}

// Calls main()
function solveChallenge() {
    // Check if its a Skill / Alphabet / Checkpoint URL
    if (/[sac][klh][ipe][lhc][lak]/ig.test(window.location.href) == true) {
        if (DEBUG) console.log('Skill URL Detected');
        mainInterval = setInterval(main, TIME_OUT);
    }
    // Check if its a Stories URL
    if (/stories/ig.test(window.location.href) == true) {
        if (DEBUG) console.log('Stories URL Detected');
        mainInterval = setInterval(stories, TIME_OUT);
    }
    console.log(`to stop the script run "clearInterval(${mainInterval})"`);
}

(solveChallenge)();
1