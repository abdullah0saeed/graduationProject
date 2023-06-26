import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { fetchData, sendAttempts } from "../store/globalSlice";
import tw from "tailwind-react-native-classnames";
import { useRoute } from "@react-navigation/native";

import { soundEffects } from "../modules";

export default function Arrange({ navigation }) {
  const route = useRoute();
  const { word_Pic, taskId } = route.params;

  const { url } = useSelector((state) => state.global);
  const state = useSelector((state) => state);
  const [selectedWords, setSelectedWords] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinalCorrect, setFinalCorrect] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [letterCounts, setLetterCounts] = useState({});
  const [shuffledWordList, setShuffledWordList] = useState([]);
  const [disabledLetters, setDisabledLetters] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [questions, setQuestions] = useState([]);
  // const [selectedIndexs, setSelectedIndexs] = useState([]);

  const dispatch = useDispatch();
  const handleDisableClick = useCallback((word, index) => {
    setDisabledLetters((prevState) => ({
      ...prevState,
      [`${word}-${index}`]: !prevState[word],
    }));
    setSelectedWords((prev) => [...prev, word]);
  }, []);

  const shuffleArray = (array) => {
    // Randomly shuffle array
    let currentIndex = array?.length;
    let temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  useEffect(() => {
    if (currentSentenceIndex < word_Pic.length) {
      setShuffledWordList(
        shuffleArray(word_Pic[currentSentenceIndex]?.definitionInEn.split(""))
      );
    }
  }, [currentSentenceIndex]);

  if (isFinalCorrect) {
    soundEffects(2);
  }
  useEffect(() => {
    //do fetch
    if (isFinalCorrect) {
      soundEffects(2);
      dispatch(sendAttempts({ sentData: questions, gameId: "2", taskId }));
    }
  }, [isFinalCorrect]);
  useEffect(() => {
    if (attempts === 3) {
      setQuestions((prev) => {
        const updatedQuestions = [...prev];
        const questionIndex = updatedQuestions.findIndex(
          (q) => q.question_id === word_Pic[currentSentenceIndex].dataId
        );
        if (questionIndex === -1) {
          updatedQuestions.push({
            question_id: word_Pic[currentSentenceIndex].dataId,
            attempts: attempts,
          });
        } else {
          updatedQuestions[questionIndex].attempts++;
        }
        return updatedQuestions;
      });
      setCurrentSentenceIndex((prev) => prev + 1);
      ToastAndroid.show(`Your Attempts ended`, ToastAndroid.SHORT);
      setAttempts(0);
    }
  }, [attempts]);
  const checkAnswer = () => {
    const selectedSentence = selectedWords.join("");
    const currentSentence = word_Pic[currentSentenceIndex]?.definitionInEn;
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      const questionIndex = updatedQuestions.findIndex(
        (q) => q.question_id === word_Pic[currentSentenceIndex].dataId
      );
      if (questionIndex === -1) {
        updatedQuestions.push({
          question_id: word_Pic[currentSentenceIndex].dataId,
          attempts: attempts,
        });
      } else {
        updatedQuestions[questionIndex].attempts++;
      }
      return updatedQuestions;
    });
    if (selectedSentence === currentSentence) {
      // setQuestions(prev => [...prev, { question_id: word_Pic[currentSentenceIndex]._id, attempts: attempts }])
      if (currentSentenceIndex < word_Pic.length) {
        setIsCorrect(true);
        soundEffects(0);
      }
      setAttempts(0);
    } else {
      setSelectedWords([]);
      setLetterCounts({});
      soundEffects(1);
      setAttempts((prev) => prev + 1);
    }

    setDisabledLetters({});
  };

  const playAgain = () => {
    setSelectedWords([]);
    setIsCorrect(false);
    setFinalCorrect(false);
    setCurrentSentenceIndex(0);
    dispatch(fetchData());
    setDisabledLetters({});
    setAttempts(0);
  };

  const currentSentence = word_Pic[currentSentenceIndex];
  // const DefintioninEn = currentSentence.DefintioninEn;

  // Shuffle word list and set state variable
  useEffect(() => {
    // setShuffledWordList
    currentSentenceIndex < word_Pic.length &&
      shuffleArray(word_Pic[currentSentenceIndex]?.definitionInEn?.split(""));
  }, [currentSentenceIndex]);

  return (
    <View style={[tw` bg-blue-300`, { flex: 1 }]}>
      <TouchableOpacity
        style={tw`ml-3 mt-2 bg-red-400 w-2/12 flex justify-center items-center rounded-3xl border-2 border-red-600`}
        onPress={() => {
          dispatch(sendAttempts({ sentData: questions, gameId: "2", taskId }));
          playAgain();
          navigation.replace("TasksMap");
        }}
      >
        <Text style={tw`text-3xl text-center font-bold text-white`}>x</Text>
      </TouchableOpacity>
      {isCorrect && (
        <View style={tw`flex justify-center mt-32`}>
          <Text
            style={tw`text-center text-4xl font-bold  bg-green-200 rounded-3xl`}
          >
            Congratulations! You got it right.
          </Text>
          <TouchableOpacity
            style={tw`mt-24 self-center bg-blue-700 w-5/6 h-12 flex justify-center rounded-lg`}
            onPress={() => {
              if (currentSentenceIndex === word_Pic.length - 1)
                setFinalCorrect(true);
              setCurrentSentenceIndex((current) => current + 1);
              setSelectedWords([]);
              setAttempts(0);
              setIsCorrect(false);
            }}
          >
            <Text style={tw`text-2xl font-extrabold text-center text-white`}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {isFinalCorrect && currentSentenceIndex >= word_Pic.length && (
        <View style={tw`flex justify-center mt-32`}>
          <Text
            style={tw`text-center text-4xl font-bold  bg-green-200 rounded-3xl`}
          >
            Congratulations! You completed the game.
          </Text>
          <TouchableOpacity
            onPress={playAgain}
            style={tw`mt-24 self-center bg-blue-700 w-5/6 h-12 flex justify-center rounded-lg`}
          >
            <Text style={tw`text-2xl font-extrabold text-center text-white`}>
              Play Again
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {!isCorrect && !isFinalCorrect && (
        <>
          <Image
            source={{
              uri: `${url}${word_Pic[currentSentenceIndex]?.imageUrl}`,
            }}
            style={tw`w-32 h-32 mt-7 self-center`}
          />
          <View
            style={[
              tw`flex flex-row justify-center content-center mt-12 flex-wrap`,
            ]}
          >
            {shuffledWordList.map((word, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  handleDisableClick(word, index);
                  soundEffects(3);
                }}
                disabled={disabledLetters[`${word}-${index}`]}
                style={[
                  styles.letterButton,
                  tw`bg-blue-100 `,

                  disabledLetters[`${word}-${index}`] &&
                    styles.disabledLetterButton,
                ]}
              >
                <Text style={styles.letterText}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={tw`flex flex-row justify-center bg-blue-100 w-5/6 self-center h-12 rounded-lg items-center mt-8`}
          >
            {selectedWords.map((word, index) => (
              <Text key={index} style={tw`text-2xl font-extrabold`}>
                {word}
              </Text>
            ))}
          </View>
          <TouchableOpacity
            onPress={checkAnswer}
            style={tw`mt-24 self-center bg-blue-900 w-5/6 h-12 flex justify-center rounded-xl`}
          >
            <Text
              style={tw`text-center flex justify-center items-center text-xl font-bold text-white`}
            >
              Check Answer
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  letterButton: {
    // backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    margin: 8,
    minWidth: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledLetterButton: {
    // backgroundColor: '#A0A0A0',
    backgroundColor: "#007AFF",
  },
  letterText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
});
