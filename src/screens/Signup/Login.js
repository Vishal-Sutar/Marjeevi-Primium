import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { login } from "../../Redux/AuthSlice";
import Images from "../../assets/Images/Images";

const Login = () => {
  // 🔹 Hooks
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();

  // 🔹 Role handling
  const roleId = route.params?.roleId || "farmer";

  const roleName =
    roleId === "farmer"
      ? t("role_farmer")
      : roleId === "staff"
      ? t("role_staff")
      : roleId === "fpo"
      ? t("role_fpo")
      : t("role_user");

  // 🔹 State
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Mobile number validation (India – 10 digits)
  const isValidMobile = /^\d{10}$/.test(phone);

  /**
   * Handle Login
   */
  const handleContinue = async () => {


    // 1️⃣ Validate mobile number
    if (!isValidMobile) {
      Alert.alert(
        t("invalid_mobile_title"),
        t("invalid_mobile_message")
      );
      return;
    }

    // 2️⃣ Validate password
    if (!password) {
      Alert.alert(t("error"), t("password_required"));
      return;
    }

    try {
      // 3️⃣ Dispatch login API
      const response = await dispatch(
        login({
          phone: phone,
          role: roleId, // ✅ IMPORTANT
          password: password,
        })
      ).unwrap(); 
  console.log(response);
  
      console.log("Login success:", response);

      // 4️⃣ Navigate after successful login
      // navigation.navigate("Home");

    } catch (error) {
      console.log("Login failed - Full error:", error);
      console.log("Login failed - Error type:", typeof error);
      
      // Extract error message properly
      let errorMessage = t("something_went_wrong");
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error) {
        errorMessage = String(error);
      }

      Alert.alert(
        t("error"),
        errorMessage
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔹 HEADER */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Icon name="phone-portrait-outline" size={28} color="#fff" />
        </View>

        <Text style={styles.headerTitle}>
          {t("login_title", { role: roleName })}
        </Text>

        <Text style={styles.headerSubtitle}>
          {t("login_subtitle")}
        </Text>
      </View>

      {/* 🔹 FORM */}
      <View style={styles.form}>
        {/* MOBILE */}
        <Text style={styles.label}>{t("mobile_number")}</Text>

        <View style={styles.inputContainer}>
          <Icon name="call-outline" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            placeholder={t("mobile_placeholder")}
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            style={[
              styles.inputWithIcon,
              phone.length > 0 && !isValidMobile && styles.errorInput,
            ]}
          />
        </View>

        {/* PASSWORD */}
        <Text style={styles.label}>{t("password")}</Text>

        <View style={styles.passwordContainer}>
          <Icon name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            placeholder={t("enter_password")}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={[
            styles.loginBtn,
            !isValidMobile && styles.disabledBtn,
          ]}
          disabled={!isValidMobile}
          onPress={handleContinue}
        >
          <Text style={styles.loginText}>
            {t("login")}
          </Text>
        </TouchableOpacity>

        {/* GOOGLE LOGIN */}
        {/* <TouchableOpacity style={styles.googleBtn}>
          <Image
            source={Images.GoogleScreen}
            style={styles.googleIcon}
            resizeMode="contain"
          />
          <Text style={styles.googleText}>
            {t("login_with_google")}
          </Text>
        </TouchableOpacity> */}

        {/* REGISTER */}
        <View style={styles.registerRow}>
          <Text>{t("no_account")} </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Screen1")}
          >
            <Text style={styles.registerText}>
              {t("register_as", { role: roleName })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    backgroundColor: "#E9F9F1",
    paddingVertical: 40,
    alignItems: "center",
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#065F46",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#047857",
    marginTop: 4,
  },

  form: {
    padding: 22,
  },

  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 15,
    padding: 14,
    color:"black",
    marginBottom: 16,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 15,
    marginBottom: 16,
  },

  inputIcon: {
    paddingLeft: 14,
  },

  inputWithIcon: {
    flex: 1,
    padding: 14,
    color: "black",
  },

  errorInput: {
    borderColor: "red",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 15,
    marginBottom: 16,
  },

  passwordInput: {
    flex: 1,
    padding: 14,
    paddingLeft: 0,
    color: "black",
  },

  eyeIcon: {
    padding: 14,
  },

  loginBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
     marginBottom: 16,
     
  },

  disabledBtn: {
    backgroundColor: "#A7F3D0",
  },

  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  orText: {
    marginHorizontal: 10,
    color: "#9CA3AF",
  },

  googleBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 15,
    paddingVertical: 14,
  },

  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },

  googleText: {
    fontSize: 15,
    fontWeight: "500",
  },

  checkboxRow: {
    flexDirection: "row",
    marginTop: 18,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    marginRight: 10,
  },

  checkboxChecked: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },

  checkMark: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginTop: 3,
  },

  checkboxText: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
    lineHeight: 18,
  },

  link: {
    color: "#16A34A",
    fontWeight: "600",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  registerText: {
    color: "#16A34A",
    fontWeight: "600",
  },
});
