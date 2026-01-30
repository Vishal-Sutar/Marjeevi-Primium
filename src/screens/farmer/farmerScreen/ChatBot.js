import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  FlatList,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from 'lottie-react-native';
import bg1 from "../../../assets/Images/bg1.png";
import HelloRobot from "../../../animations/HelloRobot.json";
import { API_BASE_URL } from "../../../config";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [botTyping, setBotTyping] = useState(false);

  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  const formatTime = (time) => moment(time, "YYYY-MM-DD HH:mm:ss").fromNow();
  
  const formatDateSeparator = (time) => {
    const msgDate = moment(time, "YYYY-MM-DD HH:mm:ss").startOf("day");
    const today = moment().startOf("day");
    const diffDays = today.diff(msgDate, "days");
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return moment(time, "YYYY-MM-DD HH:mm:ss").format("DD MMM YYYY");
  };

  const getMessagesWithSeparators = useCallback((msgs) => {
    let lastDate = null;
    const result = [];
    msgs.forEach((msg) => {
      const msgDay = moment(msg.time, "YYYY-MM-DD HH:mm:ss").startOf("day").format();
      if (lastDate !== msgDay) {
        result.push({
          id: `sep-${msg.id}`,
          type: "separator",
          text: formatDateSeparator(msg.time),
        });
        lastDate = msgDay;
      }
      result.push({ ...msg, type: "message" });
    });
    return result;
  }, []);

  const fetchChatHistory = useCallback(async (id) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/chat/chatHistory/${id}`);
      if (data.status === "success" && data.data.chat_history) {
        const history = data.data.chat_history
          .slice()
          .reverse()
          .map((item, index) => ({
            id: `history-${index}`,
            text: item.message,
            sender: item.role === "assistant" ? "bot" : "user",
            time: item.time,
          }));
        setMessages((prev) => [...prev, ...history]);
      }
    } catch (err) {
      console.error("Error fetching chat history:", err.response?.status, err.message);
    }
  }, []);

  // Load user data and initialize welcome message
  useEffect(() => {
    (async () => {
      try {
        const userDataString = await AsyncStorage.getItem("userData");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const id = userData.id || userData._id;
          const name = userData.name || userData.username || userData.fullName;
          setUserId(id);
          setUserName(name || "User");
          
          // Load chat history first
          await fetchChatHistory(id);
          
          // Add welcome message only if no history exists
          setTimeout(() => {
            setMessages((prev) => {
              if (prev.length === 0) {
                const welcomeMsg = {
                  id: "welcome-1",
                  text: `Hello ${name || "User"}! 👋\nWelcome to KrishiGyan AI 🌾\nI'm your smart farming assistant — here to help you with crop planning, weather updates, government schemes, and agri-tech insights.\nHow may I help you today?`,
                  sender: "bot",
                  time: moment().format("YYYY-MM-DD HH:mm:ss"),
                };
                return [welcomeMsg];
              }
              return prev;
            });
          }, 500);
          return;
        }
        
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const userObj = JSON.parse(userString);
          const id = userObj.id || userObj._id;
          const name = userObj.name || userObj.username || userObj.fullName;
          setUserId(id);
          setUserName(name || "User");
          
          await fetchChatHistory(id);
          
          setTimeout(() => {
            setMessages((prev) => {
              if (prev.length === 0) {
                const welcomeMsg = {
                  id: "welcome-1",
                  text: `Hello ${name || "User"}! 👋\nWelcome to KrishiGyan AI 🌾\nI'm your smart farming assistant — here to help you with crop planning, weather updates, government schemes, and agri-tech insights.\nHow may I help you today?`,
                  sender: "bot",
                  time: moment().format("YYYY-MM-DD HH:mm:ss"),
                };
                return [welcomeMsg];
              }
              return prev;
            });
          }, 500);
          return;
        }
        
        const directId = await AsyncStorage.getItem("userId");
        if (directId && !directId.startsWith('temp_') && !directId.startsWith('user_')) {
          setUserId(directId);
          setUserName("User");
          
          await fetchChatHistory(directId);
          
          setTimeout(() => {
            setMessages((prev) => {
              if (prev.length === 0) {
                const welcomeMsg = {
                  id: "welcome-1",
                  text: `Hello User! 👋\nWelcome to KrishiGyan AI 🌾\nI'm your smart farming assistant — here to help you with crop planning, weather updates, government schemes, and agri-tech insights.\nHow may I help you today?`,
                  sender: "bot",
                  time: moment().format("YYYY-MM-DD HH:mm:ss"),
                };
                return [welcomeMsg];
              }
              return prev;
            });
          }, 500);
        } else {
          setUserName("User");
          
          const welcomeMsg = {
            id: "welcome-1",
            text: `Hello User! 👋\nWelcome to KrishiGyan AI 🌾\nI'm your smart farming assistant — here to help you with crop planning, weather updates, government schemes, and agri-tech insights.\nHow may I help you today?`,
            sender: "bot",
            time: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          setMessages([welcomeMsg]);
        }
        
      } catch (error) {
        console.error("Error retrieving user ID:", error);
        setUserName("User");
        
        const welcomeMsg = {
          id: "welcome-1",
          text: `Hello User! 👋\nWelcome to KrishiGyan AI 🌾\nI'm your smart farming assistant — here to help you with crop planning, weather updates, government schemes, and agri-tech insights.\nHow may I help you today?`,
          sender: "bot",
          time: moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        setMessages([welcomeMsg]);
      }
    })();
  }, [fetchChatHistory]);

  // Keyboard handling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setIsKeyboardVisible(true);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Send Message to Bot
  const sendMessageToBot = useCallback(async (messageText) => {
    if (!messageText?.trim() || !userId) {
      console.log("Missing message or userId:", { messageText, userId });
      return;
    }

    setBotTyping(true);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chat/chatBot`,
        { user_id: userId, query: messageText.trim(), language: "English" },
        { 
          headers: { "Content-Type": "application/json" },
          timeout: 30000
        }
      );
      
      setBotTyping(false);
      
      const botText = response.data?.answer || response.data?.response || "Sorry, I couldn't understand that.";
      
      const newBotMsg = {
        id: Date.now().toString() + "-bot",
        text: botText,
        sender: "bot",
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      setMessages((prev) => [...prev, newBotMsg]);
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
      
    } catch (err) {
      setBotTyping(false);
      console.error("Bot API error:", err.response?.status, err.message);
      
      let botText = "I'm having trouble connecting. Please try again.";
      
      if (messageText.toLowerCase().includes('hello') || messageText.toLowerCase().includes('hi')) {
        botText = "Hello! I'm KrishiGyan AI. I'm having connection issues, but I'm here to help with farming questions.";
      }
      
      const errMsg = {
        id: Date.now().toString() + "-bot",
        text: botText,
        sender: "bot",
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      setMessages((prev) => [...prev, errMsg]);
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [userId]);

  // Send Text Message
  const sendMessage = useCallback(async () => {
    const messageText = input.trim();
    if (!messageText) return;
    
    // Check message limit (5 chats = 10 messages total)
    const userMessages = messages.filter(msg => msg.sender === "user").length;
    if (userMessages >= 5) {
      const limitMsg = {
        id: Date.now().toString() + "-limit",
        text: "You've reached your daily limit of 5 questions. Please try again tomorrow.",
        sender: "bot",
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      setMessages((prev) => [...prev, limitMsg]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return;
    }
    
    if (!userId) {
      const errMsg = {
        id: Date.now().toString() + "-error",
        text: "Unable to send message. Please restart the app.",
        sender: "bot",
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      setMessages((prev) => [...prev, errMsg]);
      return;
    }

    const newUserMsg = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      time: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      sendMessageToBot(messageText);
    }, 100);
  }, [input, userId, sendMessageToBot, messages]);

  const renderItem = useCallback(({ item }) => {
    if (item.type === "separator") {
      return (
        <View style={styles.separator}>
          <Text style={styles.separatorText}>{item.text}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.message, item.sender === "user" ? styles.userMsg : styles.botMsg]}>
        <Text style={[
          styles.messageText,
          item.sender === "user" ? styles.userMessageText : styles.botMessageText
        ]}>
          {item.text}
        </Text>
        {item.time && <Text style={styles.timeText}>{formatTime(item.time)}</Text>}
      </View>
    );
  }, []);

  return (
    <View style={styles.fullScreenContainer}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
      >
        <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
          <ImageBackground source={bg1} style={styles.background} resizeMode="cover">
            
            <FlatList
              ref={flatListRef}
              data={getMessagesWithSeparators(messages)}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
            />

            {botTyping && (
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>Bot is typing...</Text>
              </View>
            )}

            <View style={styles.floatingButton}>
              <LottieView
                source={HelloRobot}
                autoPlay
                loop
                style={styles.lottieIcon}
              />
            </View>

          </ImageBackground>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <View
        style={[
          styles.inputContainerWrapper,
          { paddingBottom: isKeyboardVisible ? 10 : 20 }
        ]}
      >
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            multiline
            maxLength={1000}
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
            returnKeyType="send"
          />

          <TouchableOpacity 
            onPress={sendMessage} 
            style={[styles.sendButton, { opacity: input.trim() ? 1 : 0.5 }]}
            disabled={!input.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: { flex: 1 },
  keyboardAvoidingView: { flex: 1 },
  safeArea: { flex: 1 },
  background: { flex: 1 },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  separator: { alignItems: "center", marginVertical: 12 },
  separatorText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  message: {
    padding: 14,
    marginVertical: 4,
    borderRadius: 20,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userMsg: {
    backgroundColor: "#2f6f73",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botMsg: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: { color: "#ffffff", fontWeight: "500" },
  botMessageText: { color: "#333333" },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
    alignSelf: "flex-end",
    color: "#ffffff",
  },
  typingIndicator: {
    flexDirection: "row",
    alignSelf: "flex-start",
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginVertical: 8,
    marginLeft: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typingText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  floatingButton: {
    position: "absolute",
    right: 5,
    bottom: 100,
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  lottieIcon: {
    width: 150,
    height: 150,
  },
  inputContainerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  sendButton: {
    backgroundColor: "#2f6f73",
    padding: 14,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 60,
    minHeight: 48,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});