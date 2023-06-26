import * as Speech from "expo-speech";

export default function text2speech(text) {
  Speech.speak(text, {
    rate: 0.4,
    quality: "Enhanced",
    language: "en-US",
  });
}
