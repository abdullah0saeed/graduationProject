import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";

import { sendAttempts } from "../store/globalSlice";
import { useDispatch } from "react-redux";
import { soundEffects } from "../modules";
import Board from "../components/Board";

export default function MissingWord({ navigation }) {
  const dispatch = useDispatch();
  const route = useRoute();

  const { taskId } = route.params;
  const data = route.params.word_Pic;

  const [correct, setCorrect] = useState(false);
  const [changBg, setChangeBg] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState();

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

  function handleWordSelection(selected, i) {
    setSelectedIndex(i);
    setChangeBg(true);
    if (
      selected === findMissingWord(data[index].sentence, data[index].choices)
    ) {
      // Selected word is correct
      // setButtonColor("green");
      // setButtonText("Correct");
      setCorrect(true);

      if (index < data.length - 1) {
        soundEffects(0);
        setTimeout(() => {
          // setButtonColor("gray");
          // setButtonText("Check");
          setCorrect(false);
          setChangeBg(false);
          setSelectedWord("");
          setSelectedIndex("");
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
            taskId,
          });
        }, 1000);
      }
    } else {
      // Selected word is incorrect
      // setButtonColor("red");
      // setButtonText("Wrong");
      setCorrect(false);
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
        // setButtonColor("gray");
        // setButtonText("Check");
        setChangeBg(false);
        setSelectedIndex("");
      }, 1000);
    }
    // setSelectedWord(selected);
  }

  // function to handle word selection
  // const selectWord = (word) => {
  //   setSelectedWord(word);
  //   setButtonText("Check");
  //   setButtonColor("gray");
  // };

  return (
    <Board>
      <View
        style={{
          alignItems: "center",
          display: "flex",
          transform: [{ rotate: "90deg" }],
          width: "100%",
          height: "60%",
          position: "relative",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 28,
            position: "absolute",
            top: "4%",
          }}
        >
          {data[index].sentence.replace(
            findMissingWord(data[index].sentence, data[index].choices),
            correct ? selectedWord : "______"
          )}
        </Text>
        <View style={styles.choicesContainer}>
          {data[index].choices.map((word, i) => (
            <TouchableOpacity
              key={word}
              onPress={() => {
                setSelectedWord(word);
                handleWordSelection(word, i);
              }}
              style={[
                {
                  borderColor:
                    selectedIndex === i && correct ? "#3F86A7" : "#3B464F",
                  borderWidth: 3,
                  borderRadius: 15,
                  padding: 20,
                  alignItems: "center",
                  marginHorizontal: 3,
                  opacity: 0.8,
                },
                tw`${
                  selectedIndex === i && changBg && correct
                    ? "bg-green-400"
                    : selectedIndex === i && changBg && !correct
                    ? "bg-red-400"
                    : "bg-black"
                }`,
              ]}
            >
              <Text
                style={{
                  color: selectedIndex === i && changBg ? "#000" : "#fff",
                  fontSize: 22,
                  justifyContent: "center",
                }}
              >
                {word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* <TouchableOpacity
          onPress={() => handleWordSelection(selectedWord)}
          style={{
            backgroundColor: buttonColor,
            padding: 15,
            borderRadius: 15,
            position: "absolute",
            bottom: "-10%",
            right: "-20%",
          }}
          disabled={!selectedWord}
        >
          <Text style={{ color: "white", fontSize: 22 }}>{buttonText}</Text>
        </TouchableOpacity> */}
      </View>
    </Board>
  );
}

const styles = StyleSheet.create({
  choicesContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: "17%",
  },
});
