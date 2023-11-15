import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { Tooltip } from "./Tooltip";

type Props = {
  onChange: (value: string) => void;
};
const Dictaphone: React.FC<Props> = ({ onChange }) => {
  const commands = [
    {
      command: "Pokémon *",
      callback: (value: string) => onChange(value),
    },
  ];

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    listening,
  } = useSpeechRecognition({ commands });

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser does not support speech recognition");
  }

  // ask for microphone access
  useEffect(() => {
    void navigator.mediaDevices.getUserMedia({ audio: true });
  }, []);

  // if transcript hasn't change within 1000 ms, reset it
  useEffect(() => {
    const timeout = setTimeout(() => {
      resetTranscript();
    }, 1200);
    return () => clearTimeout(timeout);
  }, [resetTranscript, transcript]);

  const tooltipContent = browserSupportsSpeechRecognition
    ? "After activating the microphone, say 'Pokémon' followed by the name of a Pokémon to search for it."
    : "Your browser does not support speech recognition. Please use Google Chrome or Microsoft Edge.";

  return (
    <Tooltip content={tooltipContent}>
      <button
        onClick={() => {
          if (!listening) {
            void SpeechRecognition.startListening({ continuous: true });
          } else {
            void SpeechRecognition.stopListening();
          }
        }}
        className="relative flex w-8 items-center justify-center"
      >
        <FontAwesomeIcon
          icon={listening ? faMicrophone : faMicrophoneSlash}
          className={clsx(
            "transition-colors duration-300",
            transcript.startsWith("Pokémon") ? "text-sky-500" : "text-red-500",
            !listening ? "h-8 w-8" : "h-7 w-7",
          )}
        />
      </button>
    </Tooltip>
  );
};
export default Dictaphone;
