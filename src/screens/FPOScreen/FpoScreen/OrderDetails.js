import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import apiService from '../../../Redux/apiService';

const OrderDetails = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiService.getAllOrders();
      const orderData = response.data || [];
      setOrders(orderData);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING':
        return '#F59E0B';
      case 'APPROVED':
        return '#10B981';
      case 'REJECTED':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderOrder = ({ item }) => {
    const farmerName = `${item.farmer?.firstName || ''} ${item.farmer?.lastName || ''}`.trim();
    const statusColor = getStatusColor(item.status);
    
    return (
      <View style={styles.orderCard}>
        {/* FARMER INFO */}
        <View style={styles.farmerRow}>
          <Icon name="person-circle" size={20} color="#2563EB" />
          <Text style={styles.farmerName}>{farmerName}</Text>
          <Text style={styles.phone}>({item.farmer?.phone})</Text>
        </View>

        {/* ORDER ID & DATE */}
        <View style={styles.infoRow}>
          <Text style={styles.orderId}>#{item._id.slice(-8).toUpperCase()}</Text>
          <Text style={styles.date}>{formatDate(item.placedAt)}</Text>
        </View>

        {/* ITEMS */}
        <View style={styles.itemsContainer}>
          <Text style={styles.itemsLabel}>Ordered Items:</Text>
          {item.items.map((orderItem, index) => (
            <View key={orderItem._id} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {orderItem.item?.itemName || 'Unknown Item'}
                {orderItem.item?.brand ? ` (${orderItem.item.brand})` : ''}
              </Text>
              <Text style={styles.itemDetails}>
                {orderItem.quantity} {orderItem.item?.unit || 'unit'}(s) × ₹{orderItem.expectedPrice}
              </Text>
            </View>
          ))}
        </View>

        {/* TOTAL & STATUS */}
        <View style={styles.footer}>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status}
            </Text>
          </View>
          <Text style={styles.totalAmount}>Total: ₹{item.totalAmount}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={styles.backBtn} />
      </View>

      {/* ORDER LIST */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: {
    width: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  farmerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  farmerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 6,
  },
  phone: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  orderId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  itemRow: {
    marginBottom: 6,
    paddingLeft: 8,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default OrderDetails;
