import "./App.css";
import { useState } from "react";
import { URL, API_KEY } from "./constants";
import Answers from "./Components/Answers";

const App = () => {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([])

  const payload = {
    contents: [
      {
        parts: [{ text: question }],
      },
    ],
  };

  const askQuestion = async () => {

    if (!question.trim()) return;

    // Step 1: user ka question add karo
    setResult((prev) => [...prev, { sender: "user", text: question }]);

    let response = await fetch(`${URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    let ResponseData = await response.json();
    let FinalData = ResponseData.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    // Split by new line
    let FinalAns = FinalData.split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== ""); // empty lines hata do

    setResult((prev) => [...prev, { sender: "ai", text: FinalAns }]);
    setQuestion("")
  };
  console.log(result);


  return (
    <div className="grid grid-cols-5 h-screen text-center">
      {/* Sidebar */}
      <div className="col-span-1 bg-zinc-800"></div>
      {/* Main Chat Section */}
      <div className="col-span-4 p-10">
        <div className="container h-[75vh] overflow-y-auto p-4 space-y-4 bg-zinc-900 rounded-lg shadow-inner">
          <div className="text-zinc-300">
            <Answers data={result} />

          </div>
        </div>
        <div className="bg-zinc-800 w-1/2 p-1 pr-5 text-white m-auto rounded-4xl border border-zinc-600 flex h-16">
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                askQuestion()
              }
            }}
            className="w-full h-full p-3 outline-none"
            placeholder="Ask me anythink "
          />
          <button onClick={askQuestion}>Ask</button>
        </div>
      </div>
    </div>
  );
};

export default App;
