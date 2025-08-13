import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const contextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };
  /*
  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    const response = await runChat(input);
    let responseArray = response.split("**");
    let newResponse;
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        // newResponse += "<b>" + responseArray[i] + "</b>";
        newResponse += `<b style="font-weight:450;">${responseArray[i]}</b>`;
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");
    setResultData(newResponse2);
    setLoading(false);
    setInput("");
  };

  */

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await runChat(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompt((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await runChat(input);
    }

    // Bold formatting for **text**
    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += `<b style="font-weight:450;">${responseArray[i]}</b>`;
      }
    }

    // ...existing code...
    // Headings, code blocks, and line breaks
    newResponse = newResponse
      .split("\n")
      .map((line) => {
        // Blue heading with even less spacing for ###
        if (line.startsWith("###")) {
          return `<h3 style="font-size:1.2em;font-weight:600;color:#4b90ff;margin:1px 0 1px 0;">${line.replace(
            /^###\s*/,
            ""
          )}</h3>`;
        }
        // Blue heading with even less spacing for ##
        if (line.startsWith("##")) {
          return `<h2 style="font-size:1.4em;font-weight:700;color:#4b90ff;margin:2px 0 2px 0;">${line.replace(
            /^##\s*/,
            ""
          )}</h2>`;
        }
        // Blue heading with even less spacing for #
        if (line.startsWith("#")) {
          return `<h1 style="font-size:1.7em;font-weight:700;color:#4b90ff;margin:2px 0 2px 0;">${line.replace(
            /^#\s*/,
            ""
          )}</h1>`;
        }
        // Format code blocks
        if (line.trim().startsWith("```")) {
          return (
            "<pre style='background:#f0f0f0;padding:8px;border-radius:6px;margin:4px 0;'>" +
            line.replace(/```[a-z]*\s*/g, "") +
            "</pre>"
          );
        }
        // Bullet for single * at line start
        if (line.trim().startsWith("* ")) {
          return `• ${line.trim().slice(2)}`;
        }
        // Escape curly braces in code lines
        return line.replace(/{/g, "&#123;").replace(/}/g, "&#125;");
      })
      .join("<br/>");
    // ...existing code...
    let newResponseArray = newResponse.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompt,
    setPrevPrompt,
    onSent,
    input,
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default contextProvider;
