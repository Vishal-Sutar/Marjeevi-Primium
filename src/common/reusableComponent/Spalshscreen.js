import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import Images from "../../assets/Images/Images";

const Splashscreen = () => {
  const [loading, setLoading] = useState(true);
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const textFadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      // First: Image animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      // Then: Text animation
      Animated.parallel([
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* ANIMATED IMAGE */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={Images.firstScreen}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ANIMATED TEXT CONTENT */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: textFadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.welcome}>WELCOME!</Text>
        <Text style={styles.toText}>To</Text>
        <Text style={styles.title}>Marjeevi Pragatisheel FPO</Text>
      </Animated.View>

      {/* ANIMATED LOADING TEXT */}
      {loading && (
        <Animated.View style={{ opacity: textFadeAnim }}>
          <Text style={styles.loading}>Loading...</Text>
        </Animated.View>
      )}
    </View>
  );
};

export default Splashscreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9F1",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  imageContainer: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },

  splashImage: {
    width: "100%",
    height: "100%",
  },

  content: {
    alignItems: "center",
    marginTop: 30,
  },

  welcome: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1FA637",
    marginBottom: 10,
    letterSpacing: 2,
  },

  toText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1FA637",
    textAlign: "center",
  },

  loading: {
    marginTop: 40,
    fontSize: 16,
    color: "#1FA637",
    fontWeight: "500",
  },
});

