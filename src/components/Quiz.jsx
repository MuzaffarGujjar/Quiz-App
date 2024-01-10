import axios from "axios";
import React, { useEffect, useState } from "react";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);

    const decodeEntities = (html) => {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = html;
        return textarea.value;
    };

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await axios.get(
                    "https://opentdb.com/api.php?amount=10"
                );
                const formattedQuestion = response.data.results.map((question) => ({
                    ...question,
                    question: decodeEntities(question.question),
                    incorrect_answers: question.incorrect_answers.map(decodeEntities),
                    correct_answers: decodeEntities(question.correct_answers),
                }));

                setQuestions(formattedQuestion);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchQuestions();
    }, []);

    const handleClick = (answer) => {
        if (answer === questions[currentQuestion].correct_answers) {
            setScore(score + 1);
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowScore(true);
        }
    };

    return (
        <div className="min-h-screen mx-auto p-4 text-center bg-gradient-to-r from-red-400 to-pink-500">
            <div className="min-h-screen flex flex-col justify-center">
                <h1 className="text-4xl font-bold mb-4">Quiz App</h1>
                {questions.length > 0 ? (
                    showScore ? (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Your score: {score} / {questions.length}
                            </h2>

                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                onClick={() => window.location.reload()}
                            >
                                Restart Quiz
                            </button>
                        </div>
                    ) : (
                        <div className="bg-slate-100 mx-52 rounded-md p-5">
                            <h2 className="text-xl font-semibold mb-4">
                                Question {currentQuestion + 1} / {questions.length}
                            </h2>
                            <p className="text-lg mb-4 font-semibold"> {questions[currentQuestion].question} </p>

                            <div className="grid grid-cols-2 gap-4 mx-44">
                                {questions[currentQuestion].incorrect_answers.map(
                                    (option, index) => (
                                        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" key={index} onClick={() => handleClick(option)}>
                                            {option}
                                        </button>
                                    )
                                )}
                                <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                    onClick={() =>
                                        handleClick(questions[currentQuestion].correct_answers)
                                    }
                                >
                                    {questions[currentQuestion].correct_answers}
                                </button>
                            </div>
                        </div>
                    )
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default Quiz;