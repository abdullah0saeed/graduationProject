import { Audio } from "expo-av";

const sounds = [
  require("../../assets/sounds/correct.mp3"),
  require("../../assets/sounds/wrong.mp3"),
  require("../../assets/sounds/done.mp3"),
  require("../../assets/sounds/touch.mp3"),
];

export default async function soundEffects(i) {
  const sound = new Audio.Sound();
  try {
    await sound.loadAsync(sounds[i]);
    await sound
      .playAsync()
      .then(async (playbackStatus) => {
        setTimeout(() => {
          sound.unloadAsync();
        }, playbackStatus.playableDurationMillis);
      })
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error);
  }
}
