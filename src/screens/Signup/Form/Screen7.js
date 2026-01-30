import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { pick, types } from "@react-native-documents/picker";

import apiService from "../../../Redux/apiService";
import Icon from "react-native-vector-icons/Ionicons";

const Screen7 = () => {
  // 🔹 Hooks
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // 🔹 Payload from previous screen
  const { payload, themeColor = "#2E7D32" } = route.params || {};

  // 🔹 Redux state
  const { isLoading } = useSelector((state) => state.auth);

  // 🔹 Document states
  const [soilCard, setSoilCard] = useState(null);
  const [labReport, setLabReport] = useState(null);
  const [govDoc, setGovDoc] = useState(null);

  // 🔹 Form validation - documents are optional
  const isFormValid = true;

  /**
   * 📎 Pick document
   */
  const pickDocument = async (setter) => {
    try {
      const result = await pick({
        type: [types.pdf, types.allFiles],
        allowMultiSelection: false,
      });

      const file = result[0];

      setter({
        uri: file.uri || file.fileCopyUri,
        name: file.name || file.fileName,
        type: file.type || file.mime,
        size: file.size,
      });
    } catch (error) {
      if (error.code === "DOCUMENT_PICKER_CANCELED") {
        // User cancelled the picker
        return;
      } else {
        console.log("DOCUMENT PICK ERROR 👉", error);
        Alert.alert(t("error"), t("file_pick_failed"));
      }
    }
  };

  /**
   * ✅ Submit final registration
   */
  const handleSubmit = async () => {
    const finalPayload = {
      ...payload,
      role: "Farmer",
    };

    // Add documents only if they are uploaded
    if (soilCard || labReport || govDoc) {
      finalPayload.documents = {
        ...(soilCard && { soilHealthCard: soilCard.uri }),
        ...(labReport && { labReport: labReport.uri }),
        ...(govDoc && { governmentDocument: govDoc.uri }),
      };
    }

    try {
      const response = await apiService.FarmerRegister(finalPayload);

      console.log("BACKEND SUCCESS RESPONSE 👉", response);

      if (response) {
        Alert.alert("Success", "Registration completed successfully!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login")
          }
        ]);
      }
    } catch (error) {
      console.log("BACKEND ERROR 👉", error);
      
      if (error.response?.status === 409 || error.message?.includes("already exists")) {
        Alert.alert(
          "User Already Exists",
          "This phone number is already registered. Please login or use a different phone number.",
          [
            { text: "Go to Login", onPress: () => navigation.navigate("Login") },
            { text: "Cancel", style: "cancel" }
          ]
        );
      } else {
        Alert.alert(t("error"), error.response?.data?.message || t("backend_error"));
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 🔹 HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.stepText}>
            {t("step_7_of_7")}
          </Text>
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { backgroundColor: themeColor }]} />
        </View>
      </View>

      {/* 🔹 CARD */}
      <View style={styles.card}>
        <View style={[styles.iconWrapper, { backgroundColor: `${themeColor}20` }]}>
          <Icon name="document-text-outline" size={20} color={themeColor} />
        </View>
        
        <Text style={styles.cardTitle}>
          {t("document_upload")}
        </Text>

        <Text style={styles.cardSub}>
          {t("upload_supporting_documents")} (Optional)
        </Text>

        {/* Soil Health Card */}
        <View style={styles.uploadContainer}>
          <TouchableOpacity
            style={[
              styles.uploadBox,
              soilCard && styles.uploadBoxActive,
            ]}
            onPress={() => pickDocument(setSoilCard)}
          >
            <Text style={styles.uploadText}>
              {soilCard ? soilCard.name : t("upload_soil_card")}
            </Text>
          </TouchableOpacity>
          {soilCard && (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => setSoilCard(null)}
            >
              <Icon name="close-circle" size={20} color="#D32F2F" />
            </TouchableOpacity>
          )}
        </View>

        {/* Lab Report */}
        <View style={styles.uploadContainer}>
          <TouchableOpacity
            style={[
              styles.uploadBox,
              labReport && styles.uploadBoxActive,
            ]}
            onPress={() => pickDocument(setLabReport)}
          >
            <Text style={styles.uploadText}>
              {labReport ? labReport.name : t("upload_lab_report")}
            </Text>
          </TouchableOpacity>
          {labReport && (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => setLabReport(null)}
            >
              <Icon name="close-circle" size={20} color="#D32F2F" />
            </TouchableOpacity>
          )}
        </View>

        {/* Government Document */}
        <View style={styles.uploadContainer}>
          <TouchableOpacity
            style={[
              styles.uploadBox,
              govDoc && styles.uploadBoxActive,
            ]}
            onPress={() => pickDocument(setGovDoc)}
          >
            <Text style={styles.uploadText}>
              {govDoc ? govDoc.name : t("upload_gov_document")}
            </Text>
          </TouchableOpacity>
          {govDoc && (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => setGovDoc(null)}
            >
              <Icon name="close-circle" size={20} color="#D32F2F" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 🔹 COMPLETE BUTTON */}
      <TouchableOpacity
        style={[
          styles.completeBtn,
          { backgroundColor: themeColor },
          isLoading && styles.completeBtnDisabled,
        ]}
        disabled={isLoading}
        onPress={handleSubmit}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.completeText}>
            {t("complete_registration")}
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

export default Screen7;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F5",
  },

  /* HEADER */
  header: {
    padding: 16,
    backgroundColor: "#F4F6F5",
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    fontSize: 22,
    color: "#333",
    lineHeight: 22,
  },

  stepText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },

  progressBarBg: {
    height: 4,
    width: "100%",
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },

  progressBarFill: {
    height: 4,
    width: "100%",
    borderRadius: 2,
  },

  /* CARD */
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  icon: {
    fontSize: 18,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  cardSub: {
    fontSize: 12,
    color: "#666",
    marginBottom: 14,
  },

  /* UPLOAD */
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  uploadBox: {
    flex: 1,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C8E6C9",
    borderRadius: 12,
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },

  removeBtn: {
    marginLeft: 8,
    padding: 4,
  },

  uploadBoxActive: {
    backgroundColor: "#E8F5E9",
    borderColor: "#2E7D32",
  },

  uploadIcon: {
    fontSize: 16,
    marginRight: 6,
    color: "#2E7D32",
  },

  uploadText: {
    fontSize: 13,
    color: "#2E7D32",
    fontWeight: "600",
  },

  /* INFO */
  infoBox: {
    backgroundColor: "#EEF5EE",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },

  infoText: {
    fontSize: 12,
    color: "#2E7D32",
    textAlign: "center",
  },

  /* COMPLETE */
  completeBtn: {
    backgroundColor: "#2E7D32",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  completeBtnDisabled: {
    opacity: 0.5,
  },

  completeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
