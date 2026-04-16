import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { FaCopy, FaCheck } from "react-icons/fa";
import "./Answers.css";

const Answers = ({ data, darkMode = true }) => {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    const textToCopy = Array.isArray(text) ? text.join("\n") : text;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!data?.length) {
    return null;
  }

  return (
    <div className={`messages-list ${darkMode ? "dark" : "light"}`}>
      {data.map((msg, index) => {
        const isUser = msg.sender === "user";
        const uniqueId = `${index}-${msg.sender}`;

        return (
          <div
            key={index}
            className={`message-wrapper ${isUser ? "user-message" : "ai-message"}`}
          >
            {!isUser && (
              <div className="avatar ai-avatar">
                <span>🤖</span>
              </div>
            )}

            <div className="message-content">
              <div
                className={`message-bubble ${msg.isError ? "error" : ""
                  }`}
              >
                <ReactMarkdown
                  components={{
                    h1: ({ ...props }) => (
                      <h1 className="markdown-h1" {...props} />
                    ),
                    h2: ({ ...props }) => (
                      <h2 className="markdown-h2" {...props} />
                    ),
                    h3: ({ ...props }) => (
                      <h3 className="markdown-h3" {...props} />
                    ),
                    p: ({ ...props }) => (
                      <p className="markdown-p" {...props} />
                    ),
                    strong: ({ ...props }) => (
                      <strong className="markdown-strong" {...props} />
                    ),
                    em: ({ ...props }) => (
                      <em className="markdown-em" {...props} />
                    ),
                    ul: ({ ...props }) => (
                      <ul className="markdown-ul" {...props} />
                    ),
                    ol: ({ ...props }) => (
                      <ol className="markdown-ol" {...props} />
                    ),
                    li: ({ ...props }) => (
                      <li className="markdown-li" {...props} />
                    ),
                    code: ({ ...props }) => (
                      <code className="markdown-code" {...props} />
                    ),
                    pre: ({ ...props }) => (
                      <pre className="markdown-pre" {...props} />
                    ),
                    a: ({ ...props }) => (
                      <a className="markdown-a" {...props} />
                    ),
                    blockquote: ({ ...props }) => (
                      <blockquote className="markdown-blockquote" {...props} />
                    ),
                  }}
                >
                  {Array.isArray(msg.text) ? msg.text.join("\n") : msg.text}
                </ReactMarkdown>
              </div>

              {!isUser && (
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(msg.text, uniqueId)}
                  title="Copy message"
                >
                  {copiedId === uniqueId ? (
                    <>
                      <FaCheck size={13} />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <FaCopy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {isUser && (
              <div className="avatar user-avatar">
                <span>👤</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Answers;