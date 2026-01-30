import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import MapView, { Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialIcons";
import apiService from "../../../Redux/apiService";

const FarmDetails = ({ route, navigation }) => {
  const { farmId } = route.params;
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmDetails = async () => {
      try {
        const response = await apiService.getFarmByFarmId(farmId);
        setFarm(response?.data);
      } catch (error) {
        console.error("Fetch farm details error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmDetails();
  }, [farmId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      </View>
    );
  }

  const coordinates = farm?.geojson?.geometry?.coordinates?.[0]?.map(coord => ({
    latitude: coord[1],
    longitude: coord[0],
  })) || [];

  const region = coordinates.length > 0 ? {
    latitude: coordinates[0].latitude,
    longitude: coordinates[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Farm Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {region && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            mapType="satellite"
          >
            {coordinates.length >= 3 && (
              <Polygon
                coordinates={coordinates}
                strokeColor="#FF0000"
                fillColor="rgba(255,0,0,0.3)"
                strokeWidth={2}
              />
            )}
          </MapView>
        )}

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Farm Name</Text>
            <Text style={styles.value}>{farm?.farmName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Area</Text>
            <Text style={styles.value}>{farm?.farmArea} {farm?.unit}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Markers</Text>
            <Text style={styles.value}>{coordinates.length} points</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

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
  map: {
    height: 300,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});

export default FarmDetails;
