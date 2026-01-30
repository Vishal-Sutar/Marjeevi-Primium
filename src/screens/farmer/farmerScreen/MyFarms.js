import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import apiService from "../../../Redux/apiService";
import { getUserData } from "../../../Redux/Storage";

const MyFarms = ({ navigation }) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showActions, setShowActions] = useState(false);

  /* ================= FETCH FARMS ================= */
  const fetchFarms = async () => {
    try {
      setLoading(true);
      const user = await getUserData();
      const response = await apiService.getFarmsByUserId(user?.id);
      setFarms(response?.data || []);
    } catch (error) {
      console.error("Fetch farms error:", error);
      Alert.alert("Error", "Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchFarms);
    return unsubscribe;
  }, [navigation]);

  /* ================= DELETE FARM ================= */
  const handleDelete = async (farmId) => {
    Alert.alert(
      "Delete Farm",
      "Are you sure you want to delete this farm?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiService.deleteFarmById(farmId);
              Alert.alert("Success", "Farm deleted successfully");
              fetchFarms();
            } catch {
              Alert.alert("Error", "Failed to delete farm");
            }
          },
        },
      ]
    );
  };

  const openActions = (farm) => {
    setSelectedFarm(farm);
    setShowActions(true);
  };

  /* ================= FARM CARD ================= */
  const renderFarmCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.farmName}>{item.farmName}</Text>
          <Text style={styles.farmArea}>
            {item.farmArea} {item.unit}
          </Text>
        </View>

        <TouchableOpacity onPress={() => openActions(item)}>
          <Icon name="more-vert" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Farms</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* CONTENT */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : farms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No farms added yet</Text>
        </View>
      ) : (
        <FlatList
          data={farms}
          renderItem={renderFarmCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* ACTIONS MODAL */}
      <Modal
        visible={showActions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActions(false)}
        >
          <View style={styles.actionsModal}>
            <View style={styles.actionsHeader}>
              <Text style={styles.actionsTitle}>Actions</Text>
              <TouchableOpacity onPress={() => setShowActions(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                setShowActions(false);
                navigation.navigate("FarmDetails", {
                  farmId: selectedFarm._id,
                });
              }}
            >
              <Icon name="visibility" size={22} color="#666" />
              <Text style={styles.actionText}>View details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                setShowActions(false);
                navigation.navigate("EditFarm", { farm: selectedFarm });
              }}
            >
              <Icon name="edit" size={22} color="#666" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                setShowActions(false);
                handleDelete(selectedFarm._id);
              }}
            >
              <Icon name="delete" size={22} color="#f44336" />
              <Text style={[styles.actionText, { color: "#f44336" }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddFarm")}
      >
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default MyFarms;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  loader: {
    flex: 1,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },

  listContainer: {
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  farmName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  farmArea: {
    fontSize: 14,
    color: "#666",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  actionsModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  actionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 16,
  },
  actionText: {
    fontSize: 16,
    color: "#333",
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
