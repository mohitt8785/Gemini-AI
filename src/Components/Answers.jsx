import React from "react";
import ReactMarkdown from "react-markdown";
import { FaRobot, FaUser } from "react-icons/fa";

const Answers = ({ data }) => {
  if (!data?.length) {
    return (
      <p className="text-gray-400 text-center mt-10">
        👋 What's on your mind today?
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((msg, index) => {
        const isUser = msg.sender === "user";
        return (
          <div
            key={index}
            className={`flex items-start ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            {/* AI Icon */}
            {!isUser && (
              <div className="flex-shrink-0 mr-2 mt-2 text-yellow-400">
                <FaRobot size={18} title="AI" />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base leading-relaxed shadow-md
                ${
                  isUser
                    ? "bg-blue-700 text-white rounded-2xl rounded-br-none"
                    : "bg-zinc-700 text-white rounded-2xl rounded-bl-none"
                }`}
            >
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => (
                    <h1
                      {...props}
                      className="text-2xl font-bold text-blue-400 mb-2 text-left"
                    />
                  ),
                  h2: ({ ...props }) => (
                    <h2
                      {...props}
                      className="text-xl font-semibold text-blue-300 mb-2 text-left"
                    />
                  ),
                  p: ({ ...props }) => (
                    <p
                      {...props}
                      className="text-gray-200 m-0 p-0 text-left"
                    />
                  ),
                  strong: ({ ...props }) => (
                    <strong
                      {...props}
                      className="font-bold text-yellow-300"
                    />
                  ),
                  ul: ({ ...props }) => (
                    <ul
                      {...props}
                      className="list-disc ml-6 space-y-1 text-gray-200 text-left"
                    />
                  ),
                  code: ({ ...props }) => (
                    <code
                      {...props}
                      className="bg-zinc-800 text-green-400 px-1 rounded text-xs"
                    />
                  ),
                }}
              >
                {Array.isArray(msg.text) ? msg.text.join("\n") : msg.text}
              </ReactMarkdown>
            </div>

            {/* User Icon */}
            {isUser && (
              <div className="flex-shrink-0 ml-2 mt-2 text-blue-400">
                <FaUser size={20} title="You" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Answers;

