import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";
import { API_BASE_URL } from "../../../config";
import { getAccessToken } from "../../../Redux/Storage";

/* ---------------- SCREEN ---------------- */

const UpdateProfile = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
    const route = useRoute();
  const { profileData } = route.params;

  /* 🔹 Dummy prefilled data (replace with backend later) */
  const [form, setForm] = useState({
    firstName: profileData?.firstName || "",
    lastName: profileData?.lastName || "",
    emailId: profileData?.emailId || "",
    phone: profileData?.phone || "",
    gender: profileData?.gender || "",
    shopName: profileData?.shopName || "",
    gstNumber: profileData?.gstNumber || "",
    village: profileData?.village || "",
    district: profileData?.district || "",
    state: profileData?.state || "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageNew, setProfileImageNew] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showGender, setShowGender] = useState(false);

  const GENDERS = ["male", "female"];

  useEffect(() => {
    if (profileData?.profileImage) {
      let imageUri = null;
      if (typeof profileData.profileImage === "object" && profileData.profileImage.url) {
        imageUri = profileData.profileImage.url;
      } else if (
        typeof profileData.profileImage === "string" &&
        profileData.profileImage !== "null" &&
        profileData.profileImage !== "undefined"
      ) {
        imageUri = profileData.profileImage;
      }
      setProfileImage(imageUri);
    }
  }, [profileData]);

  const pickImage = async () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 0.7, maxWidth: 400, maxHeight: 400, includeBase64: true },
      async (response) => {
        if (response.didCancel || response.errorCode) return;

        const asset = response.assets[0];
        setProfileImageNew(asset);
        setUploading(true);

        try {
          const token = await getAccessToken();

          const apiResponse = await fetch(
            `${API_BASE_URL}/api/user/update-profile`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                profileImage: `data:${asset.type};base64,${asset.base64}`,
              }),
            },
          );

          if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            throw new Error(
              errorData.message || `HTTP error! status: ${apiResponse.status}`,
            );
          }

          const data = await apiResponse.json();
          console.log("Upload successful:", data);

          setProfileImage(asset.uri);
          setProfileImageNew(null);
          Alert.alert("Success", "Profile image updated successfully");
        } catch (error) {
          console.error("Upload error:", error.message);
          Alert.alert("Error", error.message || "Failed to update profile");
        } finally {
          setUploading(false);
        }
      },
    );
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };
  

  const handleUpdate = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.emailId ||
      !form.phone ||
      !form.shopName ||
      !form.gstNumber
    ) {
      Alert.alert(t("error"), t("fill_required_fields"));
      return;
    }

    try {
      const token = await getAccessToken();
      
      const apiResponse = await fetch(
        `${API_BASE_URL}/api/user/update-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${apiResponse.status}`,
        );
      }

      Alert.alert(t("success"), t("profile_updated"));
      navigation.goBack();

    } catch (error) {
      console.log("Upload error:", error.message);
      Alert.alert(t("error"), "Failed to update profile");
    }
  };

  /* ---------------- AVATAR ---------------- */

  const renderAvatar = () => {
    if (uploading) {
      return (
        <View style={styles.avatarFallback}>
          <ActivityIndicator color="#fff" />
        </View>
      );
    }

    if (profileImageNew?.uri || profileImage) {
      return <Image source={{ uri: profileImageNew?.uri || profileImage }} style={styles.avatar} />;
    }

    return (
      <View style={styles.avatarFallback}>
        <Text style={styles.avatarLetter}>
          {form.firstName?.charAt(0).toUpperCase() || "U"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          {/* BACK BUTTON */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#2563EB" />
          </TouchableOpacity>

          {/* AVATAR */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {renderAvatar()}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={16} color="#2563EB" />
            </View>
          </TouchableOpacity>

          <Text style={styles.title}>{t("update_profile")}</Text>
          <Text style={styles.subtitle}>
            {t("update_profile_sub")}
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          {/* FIRST NAME */}
          <Text style={styles.label}>{t("first_name")}</Text>
          <TextInput
            style={styles.input}
            value={form.firstName}
            onChangeText={v => handleChange("firstName", v)}
          />

          {/* LAST NAME */}
          <Text style={styles.label}>{t("last_name")}</Text>
          <TextInput
            style={styles.input}
            value={form.lastName}
            onChangeText={v => handleChange("lastName", v)}
          />

          {/* EMAIL */}
          <Text style={styles.label}>{t("email")}</Text>
          <TextInput
            style={styles.input}
            value={form.emailId}
            keyboardType="email-address"
            onChangeText={v => handleChange("emailId", v)}
          />

          {/* PHONE */}
          <Text style={styles.label}>{t("phone_number")}</Text>
          <TextInput
            style={styles.input}
            value={form.phone}
            keyboardType="number-pad"
            maxLength={10}
            onChangeText={v => handleChange("phone", v)}
          />

          {/* GENDER */}
          <Text style={styles.label}>{t("gender")}</Text>
          <TouchableOpacity
            style={styles.select}
            onPress={() => setShowGender(!showGender)}
          >
            <Text style={styles.selectText}>
              {form.gender || t("select_gender")}
            </Text>
            <Text style={styles.arrow}>⌄</Text>
          </TouchableOpacity>

          {showGender && (
            <View style={styles.dropdown}>
              {GENDERS.map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.option}
                  onPress={() => {
                    handleChange("gender", item);
                    setShowGender(false);
                  }}
                >
                  <Text style={styles.optionText}>
                    {t(item)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* SHOP NAME */}
          <Text style={styles.label}>{t("shop_name")}</Text>
          <TextInput
            style={styles.input}
            value={form.shopName}
            onChangeText={v => handleChange("shopName", v)}
          />

          {/* GST */}
          <Text style={styles.label}>{t("gst_number")}</Text>
          <TextInput
            style={styles.input}
            value={form.gstNumber}
            onChangeText={v => handleChange("gstNumber", v)}
          />

          {/* VILLAGE */}
          <Text style={styles.label}>{t("village")}</Text>
          <TextInput
            style={styles.input}
            value={form.village}
            onChangeText={v => handleChange("village", v)}
          />

          {/* DISTRICT */}
          <Text style={styles.label}>{t("district")}</Text>
          <TextInput
            style={styles.input}
            value={form.district}
            onChangeText={v => handleChange("district", v)}
          />

          {/* STATE */}
          <Text style={styles.label}>{t("state")}</Text>
          <TextInput
            style={styles.input}
            value={form.state}
            onChangeText={v => handleChange("state", v)}
          />

          {/* UPDATE BUTTON */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleUpdate}
            activeOpacity={0.85}
          >
            <Text style={styles.submitText}>
              {t("update_profile")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProfile;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    paddingBottom: 30,
  },

  header: {
    backgroundColor: "#dae6f5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 30,
  },

  backButton: {
    alignSelf: "flex-start",
    padding: 8,
    marginBottom: 2,
  },

  avatarContainer: {
    marginTop: 4,
    marginBottom: 8,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
  },

  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarLetter: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  cameraIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },

  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  form: {
    padding: 16,
  },

  label: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 6,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  select: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  selectText: {
    fontSize: 13,
    color: "#6B7280",
  },

  arrow: {
    fontSize: 16,
    color: "#9CA3AF",
  },

  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 14,
  },

  option: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: "#E5E7EB",
  },

  optionText: {
    fontSize: 13,
  },

  submitBtn: {
    backgroundColor: "#2563EB",
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
});
