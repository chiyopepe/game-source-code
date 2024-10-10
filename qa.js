"use strict";

// Questions array - 15 questions in total
const questions = [
    "What’s something I always overthink, even when I don’t need to?",
    "What do you think is my biggest source of insecurity?",
    "How do you think I handle conflict in relationships?",
    "If I were in a room full of strangers, how do you think I’d behave?",
    "What do you think I value more: stability or excitement?",
    "What’s a belief or principle you think I’d never compromise on?",
    "How do you think I handle vulnerability?",
    "If I had to choose between being happy or being successful, which would I prioritize?",
    "What do you think I'm most afraid of losing?",
    "If I were to stop pursuing my goals, what do you think would be the reason?",
    "What’s the biggest misconception people have about me?",
    "How do you think I react when I feel misunderstood?",
    "What’s something I do that reflects my true personality?",
    "Do you think I’m motivated more by fear of failure or desire for success?",
    "What’s one emotion that drives most of my decisions?"
];

// To store player's name and their responses
let playerName = '';
let responses = [];
let currentQuestionIndex = 0;
let gameStarted = false;
let nameEntered = false;

// Get elements from HTML
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer-input');
const submitButton = document.getElementById('submit-answer');
const responsesContainer = document.getElementById('responses-container');
const responsesList = document.getElementById('responses-list');

// Initial prompt to ask for the player's name
let initialPrompt = "What is your name?";
questionElement.innerText = initialPrompt;

// Function to handle the flow of questions and responses
function handleNextQuestion() {
    const answer = answerInput.value.trim();

    // First, ask for the player's name
    if (!nameEntered) {
        if (answer) {
            playerName = answer;  // Store player's name
            nameEntered = true;  // Mark that name has been entered
            questionElement.innerText = `Hello ${playerName} 🙈, ready to play this game which dictates our friendship? 🤩🤩🤩? (yes/no)`;
            answerInput.value = "";  // Clear the input field
        } else {
            alert("Please enter your name!");
        }
    }
    // If the game hasn't started, ask if they want to play
    else if (!gameStarted) {
        if (answer.toLowerCase() === "yes") {
            gameStarted = true;
            askQuestion();  // Start the game
        } else if (answer.toLowerCase() === "no") {
            questionElement.innerText = `Okay then, ${playerName} 😔🥲, so much for being friends huh!`;
            submitButton.style.display = "none";  // Hide the button
            answerInput.style.display = "none";   // Hide the input
        } else {
            questionElement.innerText = `Why give invalid answers other than yes or no, ${playerName}? 😡 Please answer yes or no!`;
        }
        answerInput.value = "";  // Clear input
    }
    // Once the game has started, ask the questions and store the responses
    else {
        if (answer) {
            responses.push(answer);
            answerInput.value = "";  // Clear the input for the next question
            currentQuestionIndex++;  // Move to the next question

            // If there are more questions, ask the next one
            if (currentQuestionIndex < questions.length) {
                askQuestion();
            } else {
                // No more questions, display the responses and submit to Google Form
                showResponses();
            }
        } else {
            alert("Please provide an answer!");
        }
    }
}

// Function to ask the next question
function askQuestion() {
    questionElement.innerText = questions[currentQuestionIndex];
}

// Function to submit answers to Google Form
function submitToGoogleForm() {
    const googleFormURL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdPMEJxo90ASVLNs_tXEg-1OvR7ggXa6y6u53K64ATSTG34TQ/formResponse"; // Replace with your Google Form URL
    const formData = new FormData();

    // Entry IDs from Google Form
    const entryIds = {
        playerName: 'entry.1276896003', // Replace with your actual name field entry ID
        questionEntries: [
            'entry.247258606', // Replace with actual question entry IDs
            'entry.306068110',
            'entry.508249029',
            'entry.1737353478', 
            'entry.455021194',
            'entry.1025816348',
            'entry.1120289929', 
            'entry.1435628285',
            'entry.1299340505',
            'entry.1391599714',
            'entry.1468072961',
            'entry.911673917',
            'entry.2118026512',
            'entry.1455496201',
            'entry.99542310'
        ]
    };

    // Append player's name
    formData.append(entryIds.playerName, playerName);

    // Append each question's answer
    responses.forEach((response, index) => {
        formData.append(entryIds.questionEntries[index], response);
    });

    fetch(googleFormURL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // This disables CORS for Google Form submission
    }).then(() => {
        console.log('Responses submitted to Google Form!');
    }).catch(error => {
        console.error('Error submitting to Google Form:', error);
    });
}

// Function to display all responses
function showResponses() {
    submitToGoogleForm(); // Submit to Google Form

    questionElement.style.display = "none";  // Hide the question
    answerInput.style.display = "none";      // Hide the input
    submitButton.style.display = "none";     // Hide the button
    responsesContainer.style.display = "block";  // Show the responses

    // Add each response to the list
    questions.forEach((question, index) => {
        const li = document.createElement("li");
        li.innerText = `Q${index + 1}: ${question}\nYour Answer: ${responses[index]}`;
        responsesList.appendChild(li);
    });
}

// Event listener for the submit button
submitButton.addEventListener('click', handleNextQuestion);

// Allow "Enter" keypress to trigger question handling
answerInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleNextQuestion();
    }
});
