
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/MaterialIcons";
import AwesomeAlert from 'react-native-awesome-alerts';
import apiService from "../../../Redux/apiService";

const MyListing = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  useEffect(() => {
    fetchListings();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchListings();
    }, [])
  );

  const fetchListings = async () => {
    try {
      const response = await apiService.getUserCropListings();
      setListings(response.data || []);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      setAlertConfig({
        title: "Error",
        message: "Failed to load your listings. Please try again.",
        showCancelButton: false,
        showConfirmButton: true,
        confirmText: "OK",
        confirmButtonColor: "#3A9D4F",
        onConfirmPressed: () => setShowAlert(false)
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setAlertConfig({
      title: "Delete Listing",
      message: "Are you sure you want to delete this listing?",
      showCancelButton: true,
      showConfirmButton: true,
      cancelText: "Cancel",
      confirmText: "Delete",
      confirmButtonColor: "#D32F2F",
      cancelButtonColor: "#666",
      onCancelPressed: () => setShowAlert(false),
      onConfirmPressed: async () => {
        setShowAlert(false);
        try {
          await apiService.deleteCropListing(id);
          setListings((prev) => prev.filter((item) => item._id !== id));
          setAlertConfig({
            title: "Success",
            message: "Listing deleted successfully",
            showCancelButton: false,
            showConfirmButton: true,
            confirmText: "OK",
            confirmButtonColor: "#3A9D4F",
            onConfirmPressed: () => setShowAlert(false)
          });
          setShowAlert(true);
        } catch (error) {
          console.error("Failed to delete listing:", error);
          setAlertConfig({
            title: "Error",
            message: "Failed to delete listing. Please try again.",
            showCancelButton: false,
            showConfirmButton: true,
            confirmText: "OK",
            confirmButtonColor: "#3A9D4F",
            onConfirmPressed: () => setShowAlert(false)
          });
          setShowAlert(true);
        }
      }
    });
    setShowAlert(true);
  };

  // ✅ FIXED: Image upload function for CreateListing navigation
  const handleCreateListing = () => {
    navigation.navigate("CreateListing");
  };

  const renderItem = ({ item }) => {
    const statusStyle = styles[`status${item.status || "pending"}`];

    return (
      <View style={styles.card}>
        {/* TOP ROW */}
        <View style={styles.row}>
          {item.cropImages && item.cropImages.length > 0 ? (
            <Image
              source={{ uri: item.cropImages[0].url }}
              style={styles.cropImage}
              resizeMode="cover"
              defaultSource={require("../../../assets/Images/home.png")} // ✅ Fallback
            />
          ) : (
            <View style={styles.imageBox}>
              <Icon name="grass" size={28} color="#3A9D4F" />
            </View>
          )}

          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {item.cropName || item.name}
            </Text>
            <Text style={styles.subText} numberOfLines={1}>
              {item.variety || "Variety"}
            </Text>
            <Text style={styles.subText}>
              {item.quantity}kg • ₹{item.price}/kg
            </Text>
          </View>

          <View style={[styles.status, statusStyle]}>
            <Text style={styles.statusText}>{item.status || "Pending"}</Text>
          </View>
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate("EditListing", { listing: item })}
          >
            <Icon name="edit" size={14} color="#2E7D32" style={styles.btnIcon} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item._id)}
          >
            <Icon name="delete" size={14} color="#D32F2F" style={styles.btnIcon} />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t("listing.my_listings")}</Text>
          <Text style={styles.headerSub}>
            {t("listing.total", { count: listings.length })}
          </Text>
        </View>

        {/* ADD BUTTON */}
        <TouchableOpacity style={styles.addBtn} onPress={handleCreateListing}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3A9D4F" />
          <Text style={styles.loadingText}>Loading listings...</Text>
        </View>
      ) : listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No listings yet</Text>
          <Text style={styles.emptySub}>Create your first crop listing</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true} // ✅ Performance
        />
      )}
      
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertConfig.title}
        message={alertConfig.message}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={alertConfig.showCancelButton}
        showConfirmButton={alertConfig.showConfirmButton}
        cancelText={alertConfig.cancelText}
        confirmText={alertConfig.confirmText}
        confirmButtonColor={alertConfig.confirmButtonColor}
        cancelButtonColor={alertConfig.cancelButtonColor}
        onCancelPressed={alertConfig.onCancelPressed}
        onConfirmPressed={alertConfig.onConfirmPressed}
        titleStyle={styles.alertTitle}
        messageStyle={styles.alertMessage}
      />
    </View>
  );
};

// ✅ FIXED STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F9F7",
  },

  /* HEADER */
  header: {
    backgroundColor: "#3A9D4F",
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  headerSub: {
    fontSize: 12,
    color: "#E0F2E9",
    marginTop: 4,
  },

  /* LIST */
  listContainer: {
    padding: 16,
    paddingBottom: 20,
  },

  /* CARD */
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#CDEED9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#DDF1DF",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cropImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },

  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  subText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  /* STATUS */
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusApproved: {
    backgroundColor: "#E8F5E9",
  },
  statusPending: {
    backgroundColor: "#FFF3E0",
  },
  statusSold: {
    backgroundColor: "#E3F2FD",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  /* ACTIONS */
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 10,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDECEA",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  btnIcon: {
    marginRight: 4,
  },
  editText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "600",
  },
  deleteText: {
    fontSize: 12,
    color: "#D32F2F",
    fontWeight: "600",
  },

  /* ADD BUTTON */
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    fontSize: 22,
    color: "#2E7D32",
    fontWeight: "700",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  alertMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
});

export default MyListing;
