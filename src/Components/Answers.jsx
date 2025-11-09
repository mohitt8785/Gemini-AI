import React from "react";
import ReactMarkdown from "react-markdown";
import { FaRobot, FaUser } from "react-icons/fa";

const Answers = ({ data }) => {
    if (!data?.length) {
        return (
            <p className="text-gray-400 text-center">
                What's on the agenda today?
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
                        className={`flex items-start ${isUser ? "justify-end" : "justify-start"}`}
                    >
                        {!isUser && (
                            <div className="flex-shrink-0 mr-2 mt-3 text-yellow-400">
                                <FaRobot size={18} title="AI" />
                            </div>
                        )}
                        <div
                            className={`max-w-[70%] px-4 py-3 text-sm leading-relaxed shadow
                                ${isUser
                                    ? "bg-zinc-800 text-white rounded-2xl rounded-br-none"
                                    : "bg-zinc-600 text-white rounded-2xl rounded-bll9-none"
                                }`}
                        >
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => (
                                        console.log(node), <br />,
                                        <h1
                                            {...props}
                                            className="text-2xl font-bold text-blue-400 mb-2 text-left"
                                        />
                                    ),
                                    h2: ({ node, ...props }) => (
                                        <h2
                                            {...props}
                                            className="text-xl font-semibold text-blue-300 mb-2 text-left"
                                        />
                                    ),
                                    h3: ({ node, ...props }) => (
                                        <h3
                                            {...props}
                                            className="text-lg font-semibold text-blue-200 mb-2 text-left"
                                        />
                                    ),
                                    p: ({ node, ...props }) => (
                                        <p
                                            {...props}
                                            className="text-gray-200 m-0 p-0 text-left"
                                        />
                                    ),
                                    strong: ({ node, ...props }) => (
                                        <strong
                                            {...props}
                                            className="font-bold text-yellow-300"
                                        />
                                    ),
                                    ul: ({ node, ...props }) => (
                                        <ul
                                            {...props}
                                            className="list-disc ml-6 space-y-1 text-gray-200 text-left"
                                        />
                                    ),
                                    ol: ({ node, ...props }) => (
                                        <ol
                                            {...props}
                                            className="list-decimal ml-6 space-y-1 text-gray-200 text-left"
                                        />
                                    ),
                                    li: ({ node, ...props }) => (
                                        <li
                                            {...props}
                                            className="text-gray-200 text-left"
                                        />
                                    ),
                                    code: ({ node, ...props }) => (
                                        <code
                                            {...props}
                                            className="bg-zinc-700 text-green-400 px-1 rounded text-xs "
                                        />
                                    ),
                                    pre: ({ node, ...props }) => (
                                        <pre
                                            {...props}
                                            className="bg-zinc-900 p-3 rounded mb-2 overflow-x-auto"
                                        />
                                    ),
                                }}
                            >
                                {Array.isArray(msg.text) ? msg.text.join("\n") : msg.text}
                            </ReactMarkdown>
                        </div>
                        {isUser && (
                            <div className="flex-shrink-0 ml-2 mt-3 text-blue-400">
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