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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from 'lottie-react-native';
import bg1 from "../../../assets/Images/bg1.png";
import HelloRobot from "../../../animations/HelloRobot.json";
import { API_BASE_URL } from "../../../config";

// Constants
const MAX_DAILY_CHATS = 5;
const API_TIMEOUT = 30000;

// User-specific storage keys
const getUserChatCountKey = (userId) => `dailyChatCount_${userId}`;
const getUserDateKey = (userId) => `lastChatDate_${userId}`;

export default function ChatBox() {
  // State management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [botTyping, setBotTyping] = useState(false);
  const [dailyChatCount, setDailyChatCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const isSendingRef = useRef(false);
  const isInitializedRef = useRef(false);

  // ==================== Utility Functions ====================
  
  const formatTime = useCallback((time) => {
    return moment(time, "YYYY-MM-DD HH:mm:ss").fromNow();
  }, []);
  
  const formatDateSeparator = useCallback((time) => {
    const msgDate = moment(time, "YYYY-MM-DD HH:mm:ss").startOf("day");
    const today = moment().startOf("day");
    const diffDays = today.diff(msgDate, "days");
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return moment(time, "YYYY-MM-DD HH:mm:ss").format("DD MMM YYYY");
  }, []);

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
  }, [formatDateSeparator]);

  const scrollToEnd = useCallback((animated = true) => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated });
    }, 100);
  }, []);

  // ==================== Chat Limit Management ====================
  
  const loadChatLimit = useCallback(async (currentUserId) => {
    try {
      if (!currentUserId) {
        setDailyChatCount(0);
        return;
      }

      const userChatCountKey = getUserChatCountKey(currentUserId);
      const userDateKey = getUserDateKey(currentUserId);
      
      const storedDate = await AsyncStorage.getItem(userDateKey);
      const storedCount = await AsyncStorage.getItem(userChatCountKey);
      const today = moment().format("YYYY-MM-DD");

      if (storedDate === today && storedCount) {
        setDailyChatCount(parseInt(storedCount, 10));
      } else {
        // New day or no stored data - count today's messages from history
        try {
          const { data } = await axios.get(
            `${API_BASE_URL}/api/chat/chatHistory/${currentUserId}`,
            { timeout: API_TIMEOUT }
          );
          
          if (data.status === "success" && data.data.chat_history) {
            const todaysUserMessages = data.data.chat_history.filter(item => 
              item.role === "user" && 
              moment(item.time, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD") === today
            );
            
            const count = todaysUserMessages.length;
            setDailyChatCount(count);
            await AsyncStorage.setItem(userChatCountKey, count.toString());
          }
        } catch (error) {
          console.error("Error counting today's messages:", error);
          setDailyChatCount(0);
        }
        
        await AsyncStorage.multiSet([
          [userDateKey, today],
          [userChatCountKey, "0"]
        ]);
      }
    } catch (error) {
      console.error("Error loading chat limit:", error);
      setDailyChatCount(0);
    }
  }, []);

  const incrementChatCount = useCallback(async () => {
    if (!userId) return;
    
    const newCount = dailyChatCount + 1;
    setDailyChatCount(newCount);
    
    try {
      const userChatCountKey = getUserChatCountKey(userId);
      await AsyncStorage.setItem(userChatCountKey, newCount.toString());
    } catch (error) {
      console.error("Error saving chat count:", error);
    }
  }, [dailyChatCount, userId]);

  // ==================== API Calls ====================
  
  const fetchChatHistory = useCallback(async (id) => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/chat/chatHistory/${id}`,
        { timeout: API_TIMEOUT }
      );
      
      if (data.status === "success" && data.data.chat_history) {
        const history = data.data.chat_history
          .slice()
          .reverse()
          .map((item, index) => ({
            id: `history-${index}-${Date.now()}`,
            text: item.message,
            sender: item.role === "assistant" ? "bot" : "user",
            time: item.time,
            type: "message"
          }));
        
        setMessages(history);
        return history.length > 0;
      }
      return false;
    } catch (err) {
      console.error("Error fetching chat history:", err.message);
      return false;
    }
  }, []);

  const sendMessageToBot = useCallback(async (messageText) => {
    if (!messageText?.trim() || !userId) {
      console.warn("Missing message or userId");
      return;
    }

    setBotTyping(true);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chat/chatBot`,
        {
          user_id: userId,
          query: messageText.trim(),
          language: "English"
        },
        { 
          headers: { "Content-Type": "application/json" },
          timeout: API_TIMEOUT
        }
      );
      
      const botText = response.data?.answer || 
                      response.data?.response || 
                      "Sorry, I couldn't understand that. Please try again.";
      
      const newBotMsg = {
        id: `bot-${Date.now()}`,
        text: botText,
        sender: "bot",
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
        type: "message"
      };
      
      setMessages((prev) => [...prev, newBotMsg]);
      scrollToEnd();
      
    } catch (err) {
      console.error("Bot API error:", err.message);
      
      let botText = "I'm having trouble connecting. Please check your internet and try again.";
      
      if (err.code === 'ECONNABORTED') {
        botText = "Request timed out. Please try again.";
      }
      
      const errMsg = {
        id: `bot-error-${Date.now()}`,
        text: botText,
        sender: "bot",
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
        type: "message"
      };
      
      setMessages((prev) => [...prev, errMsg]);
      scrollToEnd();
    } finally {
      setBotTyping(false);
    }
  }, [userId, scrollToEnd]);

  // ==================== Message Handling ====================
  
  const sendMessage = useCallback(async () => {
    // Prevent duplicate sends
    if (isSendingRef.current) return;
    
    const messageText = input.trim();
    if (!messageText) return;

    // Check daily limit BEFORE processing
    if (dailyChatCount >= MAX_DAILY_CHATS) {
      const limitMsg = {
        id: `limit-${Date.now()}`,
        text: `You've reached your daily limit of ${MAX_DAILY_CHATS} questions. Your limit will reset tomorrow! 🌅`,
        sender: "bot",
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
        type: "message"
      };
      setMessages((prev) => [...prev, limitMsg]);
      setInput("");
      scrollToEnd();
      return;
    }

    if (!userId) {
      const errMsg = {
        id: `error-${Date.now()}`,
        text: "Unable to send message. Please restart the app.",
        sender: "bot",
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
        type: "message"
      };
      setMessages((prev) => [...prev, errMsg]);
      return;
    }

    // Lock sending
    isSendingRef.current = true;

    // Add user message
    const newUserMsg = {
      id: `user-${Date.now()}`,
      text: messageText,
      sender: "user",
      time: moment().format("YYYY-MM-DD HH:mm:ss"),
      type: "message"
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    scrollToEnd();

    // Increment count
    await incrementChatCount();

    // Send to bot
    setTimeout(() => {
      sendMessageToBot(messageText);
      isSendingRef.current = false;
    }, 150);
  }, [input, userId, dailyChatCount, sendMessageToBot, incrementChatCount, scrollToEnd]);

  // ==================== User Initialization ====================
  
  const createWelcomeMessage = useCallback((name) => ({
    id: "welcome-1",
    text: `Hello ${name}! 👋\nWelcome to KrishiGyan AI 🌾\n\nI'm your smart farming assistant — here to help you with crop planning, weather updates, government schemes, and agri-tech insights.\n\nHow may I help you today?`,
    sender: "bot",
    time: moment().format("YYYY-MM-DD HH:mm:ss"),
    type: "message"
  }), []);

  const initializeUser = useCallback(async () => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    try {
      let foundUserId = null;
      let foundUserName = "User";

      // Try multiple storage keys
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        foundUserId = userData.id || userData._id;
        foundUserName = userData.name || userData.username || userData.fullName || "User";
      } else {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const userObj = JSON.parse(userString);
          foundUserId = userObj.id || userObj._id;
          foundUserName = userObj.name || userObj.username || userObj.fullName || "User";
        } else {
          const directId = await AsyncStorage.getItem("userId");
          if (directId && !directId.startsWith('temp_') && !directId.startsWith('user_')) {
            foundUserId = directId;
          }
        }
      }

      setUserId(foundUserId);
      setUserName(foundUserName);

      // Load chat history if user exists
      if (foundUserId) {
        const hasHistory = await fetchChatHistory(foundUserId);
        
        // Add welcome message only if no history
        if (!hasHistory) {
          setTimeout(() => {
            setMessages([createWelcomeMessage(foundUserName)]);
          }, 300);
        }
      } else {
        // No user - show welcome message
        setMessages([createWelcomeMessage(foundUserName)]);
      }
      
    } catch (error) {
      console.error("Error initializing user:", error);
      setUserName("User");
      setMessages([createWelcomeMessage("User")]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchChatHistory, createWelcomeMessage]);

  // ==================== Effects ====================
  
  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      await initializeUser();
    };
    init();
  }, [initializeUser]);

  // Load chat limit when userId changes
  useEffect(() => {
    if (userId) {
      loadChatLimit(userId);
    }
  }, [userId, loadChatLimit]);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      scrollToEnd();
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      // Optional: handle keyboard hide
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [scrollToEnd]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      scrollToEnd(true);
    }
  }, [messages.length, isLoading, scrollToEnd]);

  // ==================== Render Functions ====================
  
  const renderItem = useCallback(({ item }) => {
    if (item.type === "separator") {
      return (
        <View style={styles.separator}>
          <Text style={styles.separatorText}>{item.text}</Text>
        </View>
      );
    }

    const isUser = item.sender === "user";

    return (
      <View style={[styles.message, isUser ? styles.userMsg : styles.botMsg]}>
        <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.botMessageText]}>
          {item.text}
        </Text>
        {item.time && (
          <Text style={[styles.timeText, isUser && styles.userTimeText]}>
            {formatTime(item.time)}
          </Text>
        )}
      </View>
    );
  }, [formatTime]);

  const keyExtractor = useCallback((item) => item.id, []);

  // ==================== UI Render ====================
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f6f73" />
        <Text style={styles.loadingText}>Loading chat...</Text>
      </View>
    );
  }

  const canSendMessage = input.trim().length > 0 && dailyChatCount < MAX_DAILY_CHATS && !botTyping;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ImageBackground source={bg1} style={styles.background} resizeMode="cover">
            
            {/* Messages List */}
            <FlatList
              ref={flatListRef}
              data={getMessagesWithSeparators(messages)}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
              removeClippedSubviews={Platform.OS === 'android'}
              maxToRenderPerBatch={10}
              windowSize={10}
            />

            {/* Bot Typing Indicator */}
            {botTyping && (
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color="#2f6f73" style={styles.typingSpinner} />
                <Text style={styles.typingText}>Bot is typing...</Text>
              </View>
            )}

            {/* Daily Limit Warning */}
            {dailyChatCount >= MAX_DAILY_CHATS && (
              <View style={styles.limitWarning}>
                <Text style={styles.limitWarningText}>
                  📊 Daily limit reached ({dailyChatCount}/{MAX_DAILY_CHATS})
                </Text>
                <Text style={styles.limitWarningSubtext}>
                  Resets tomorrow at midnight
                </Text>
              </View>
            )}

            {/* Floating Lottie Animation */}
            <View style={styles.floatingAnimation} pointerEvents="none">
              <LottieView
                source={HelloRobot}
                autoPlay
                loop
                style={styles.lottieIcon}
              />
            </View>

            {/* Input Container */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  value={input}
                  onChangeText={setInput}
                  placeholder={
                    dailyChatCount >= MAX_DAILY_CHATS 
                      ? "Daily limit reached..." 
                      : "Ask about farming, crops, weather..."
                  }
                  placeholderTextColor="#999"
                  multiline
                  maxLength={500}
                  editable={dailyChatCount < MAX_DAILY_CHATS && !botTyping}
                  onSubmitEditing={sendMessage}
                  blurOnSubmit={false}
                  returnKeyType="send"
                />

                <TouchableOpacity 
                  onPress={sendMessage} 
                  style={[
                    styles.sendButton,
                    !canSendMessage && styles.sendButtonDisabled
                  ]}
                  disabled={!canSendMessage}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>

              {/* Chat Counter */}
              <View style={styles.chatCounter}>
                <Text style={styles.chatCounterText}>
                  {dailyChatCount}/{MAX_DAILY_CHATS} chats today
                </Text>
              </View>
            </View>

          </ImageBackground>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ==================== Styles ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  separator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  separatorText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  message: {
    padding: 14,
    marginVertical: 4,
    borderRadius: 20,
    maxWidth: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  userMsg: {
    backgroundColor: '#2f6f73',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMsg: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  botMessageText: {
    color: '#1a1a1a',
  },
  timeText: {
    fontSize: 10,
    marginTop: 6,
    opacity: 0.6,
    alignSelf: 'flex-end',
    color: '#666',
  },
  userTimeText: {
    color: '#ffffff',
    opacity: 0.8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginLeft: 16,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  typingSpinner: {
    marginRight: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  limitWarning: {
    backgroundColor: 'rgba(255, 152, 0, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  limitWarningText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  limitWarningSubtext: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.9,
  },
  floatingAnimation: {
    position: 'absolute',
    right: 5,
    bottom: 120,
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieIcon: {
    width: 140,
    height: 140,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    marginRight: 10,
    fontSize: 15,
    maxHeight: 100,
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#1a1a1a',
  },
  sendButton: {
    backgroundColor: '#2f6f73',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
    minWidth: 70,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sendButtonDisabled: {
    backgroundColor: '#b0b0b0',
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  chatCounter: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  chatCounterText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
});