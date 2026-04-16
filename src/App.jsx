import "./App.css";
import { useState } from "react";
import { URL, API_KEY } from "./constants";
import Answers from "./Components/Answers";
import { FaBars, FaTimes } from "react-icons/fa";

const App = () => {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const payload = {
    contents: [
      {
        parts: [{ text: question }],
      },
    ],
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    setResult((prev) => [...prev, { sender: "user", text: question }]);

    try {
      const response =  await fetch(URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-goog-api-key": API_KEY,
  },
  body: JSON.stringify(payload),
});

      const ResponseData = await response.json();
      const FinalData =
        ResponseData.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response";

      const FinalAns = FinalData.split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      setResult((prev) => [...prev, { sender: "ai", text: FinalAns }]);
    } catch (error) {
      console.error(error);
      setResult((prev) => [
        ...prev,
        { sender: "ai", text: ["Something went wrong! ❌"] },
      ]);
    }

    setQuestion("");
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-5 h-screen text-center bg-zinc-950 text-white relative overflow-hidden">
      {/* ☰ Toggle Button for Mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-6 left-2 md:hidden z-50 bg-zinc-900 p-2 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition"
      >
        {sidebarOpen ? <FaTimes size={10} /> : <FaBars size={20} />}
      </button>

      {/* 🌐 Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-3/4 sm:w-1/2 md:w-auto 
        bg-zinc-950 backdrop-blur-xl 
        border-r border-zinc-800 
        shadow-[inset_-2px_0_10px_rgba(255,255,255,0.05)] 
        transform transition-transform duration-300 ease-in-out z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <h2 className="text-xl font-semibold mb-5 text-blue-400 tracking-wide border-b border-zinc-300 p-3">
          AI Gemini Chat
        </h2>
        <ul className="space-y-4 text-zinc-400 font-medium">
          <li className="hover:text-blue-400 hover:translate-x-1 transition cursor-pointer">
            New Chat
          </li>
          <li className="hover:text-blue-400 hover:translate-x-1 transition cursor-pointer">
            History
          </li>
          <li className="hover:text-blue-400 hover:translate-x-1 transition cursor-pointer">
            Settings
          </li>
        </ul>
      </aside>

      {/* 💬 Chat Section */}
      <main className="flex-1 col-span-4 flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 transition-all duration-300">
        {/* Chat Output */}
        <div className="flex-1 overflow-y-auto bg-zinc-900 rounded-xl shadow-inner border border-zinc-800 p-4 sm:p-6 mb-6">
          <Answers data={result} />
        </div>

        {/* Input Box */}
        <div className="bg-zinc-800 w-full sm:w-3/4 md:w-1/2 mx-auto rounded-full border border-zinc-700 flex items-center p-2 pr-3 h-14 sm:h-16 shadow-lg">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()}
            className="w-full h-full px-4 text-sm sm:text-base bg-transparent outline-none placeholder:text-gray-400"
            placeholder="Ask me anything..."
          />
          <button
            onClick={askQuestion}
            className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm sm:text-base transition"
          >
            Ask
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
