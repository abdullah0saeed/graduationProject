import React, { useState } from "react";
import { Text, TouchableOpacity, ScrollView } from "react-native";

import { sendAttempts } from "../store/globalSlice";
import { useDispatch } from "react-redux";
import { soundEffects } from "../modules";
import { useRoute } from "@react-navigation/native";

// const data = [
//   {
//     dataId: "1",
//     sentence: "I am a boy",
//     choices: ["is", "am", "are"],
//   },
//   {
//     dataId: "2",
//     sentence: "I was playing",
//     choices: ["was", "am", "are"],
//   },
//   {
//     dataId: "3",
//     sentence: "How are you",
//     choices: ["is", "am", "are"],
//   },
//   {
//     dataId: "4",
//     sentence: "She looks good",
//     choices: ["looks", "looked", "is looking"],
//   },
//   {
//     dataId: "5",
//     sentence: "What a great day !",
//     choices: ["an", "a", "are"],
//   },
//   {
//     dataId: "6",
//     sentence: "Look at me",
//     choices: ["in", "over", "at"],
//   },
// ];

export default function MissingWord({ navigation }) {
  const dispatch = useDispatch();
  const route = useRoute();

  const { taskId } = route.params;
  const data = route.params.word_Pic;

  //to store the data obj index
  const [index, setIndex] = useState(0);

  const [selectedWord, setSelectedWord] = useState("");
  const [buttonColor, setButtonColor] = useState("gray");
  const [buttonText, setButtonText] = useState("Check");

  //to store wrong attempts
  const [attempts, setAttempts] = useState([]);
  //store total wrong count
  const [wrong, setWrong] = useState(0);

  function findMissingWord(sentence, words) {
    const sentenceWords = sentence.split(" ");
    const missingWord = sentenceWords.find((word) => words.includes(word));
    return missingWord;
  }

  function handleWordSelection(selected) {
    if (
      selected === findMissingWord(data[index].sentence, data[index].choices)
    ) {
      // Selected word is correct
      setButtonColor("green");
      setButtonText("Correct");

      if (index < data.length - 1) {
        soundEffects(0);
        setTimeout(() => {
          setButtonColor("gray");
          setButtonText("Check");
          setSelectedWord("");
          setIndex(index + 1);
        }, 1000);
      } else {
        soundEffects(2);

        //to send feedback
        let sentData = {};
        // let sentData = [];
        data?.forEach((el, i) => {
          sentData[`data${i + 1}Attempts`] =
            attempts[i] !== (null || undefined) ? attempts[i] : 0;
        });
        dispatch(sendAttempts({ sentData, gameId: "5", taskId }));

        setTimeout(() => {
          navigation.replace("Score", {
            wrong,
            word_Pic: data,
            path: "Missing-Word",
          });
        }, 1000);
      }
    } else {
      // Selected word is incorrect
      setButtonColor("red");
      setButtonText("Wrong");
      soundEffects(1);
      setWrong(wrong + 1);

      //edit the wrong attempts array
      let inCorrect = attempts;
      if (inCorrect[index] == null) {
        inCorrect[index] = 1;
      } else {
        inCorrect[index] = inCorrect[index] + 1;
      }
      setAttempts(inCorrect);

      setTimeout(() => {
        setButtonColor("gray");
        setButtonText("Check");
      }, 1000);
    }
    // setSelectedWord(selected);
  }

  // function to handle word selection
  const selectWord = (word) => {
    setSelectedWord(word);
    setButtonText("Check");
    setButtonColor("gray");
  };

  return (
    <ScrollView
      style={{
        backgroundColor: "#141F23",
        flex: 1,
        padding: 20,
        paddingBottom: 100,
      }}
    >
      <TouchableOpacity
        style={{
          alignSelf: "flex-end",
          backgroundColor: "#6F5AC5",
          color: "white",
          width: 50,
          borderRadius: 10,
          alignItems: "center",
        }}
        onPress={() => {
          //   dispatch(sendAttempts({ questions, gameID: "5" }));
          navigation.replace("TasksMap");
        }}
      >
        <Text style={{ color: "white", fontSize: 40, paddingBottom: 10 }}>
          x
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          color: "white",
          fontSize: 35,
          marginTop: 40,
          marginBottom: 100,
        }}
      >
        {data[index].sentence.replace(
          findMissingWord(data[index].sentence, data[index].choices),
          buttonText === "Correct" ? selectedWord : "______"
        )}
      </Text>
      {data[index].choices.map((word) => (
        <TouchableOpacity
          key={word}
          onPress={() => selectWord(word)}
          style={{
            borderColor: selectedWord === word ? "#3F86A7" : "#3B464F",
            borderWidth: 3,
            borderRadius: 15,
            padding: 20,
            margin: 10,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 22,
              justifyContent: "center",
            }}
          >
            {word}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={() => handleWordSelection(selectedWord)}
        style={{
          backgroundColor: buttonColor,
          padding: 15,
          borderRadius: 15,
          marginTop: 20,
          marginBottom: 40,
          alignItems: "center",
        }}
        disabled={!selectedWord}
      >
        <Text style={{ color: "white", fontSize: 22 }}>{buttonText}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
