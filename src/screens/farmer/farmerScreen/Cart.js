
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import apiService from "../../../Redux/apiService";
import Icon from "react-native-vector-icons/MaterialIcons";

const Cart = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiService.getCart();
      const items = data?.items || [];
      console.log('📦 Fetched cart items:', items.map(i => ({ id: i._id, name: i.item?.itemName, qty: i.quantity })));
      setCartItems(items);
    } catch (error) {
      console.log('Error:', error.message);
      Alert.alert('Error', 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [fetchCart])
  );

  const total = cartItems.reduce((sum, item) => sum + (item.expectedPrice * item.quantity), 0);

  const handleRemove = async (itemId) => {
    console.log('🗑️ Removing item:', itemId);
    const previousItems = [...cartItems];
    setCartItems(prev => prev.filter(i => i._id !== itemId));
    
    try {
      const response = await apiService.deleteCartItem(itemId);
      console.log('✅ Item deleted successfully');
      
      await new Promise(resolve => setTimeout(resolve, 200));
      await fetchCart();
    } catch (error) {
      console.log('❌ Delete failed:', error.response?.data || error.message);
      
      if (error.response?.status === 404) {
        Alert.alert('Item Not Found', 'This item was already removed. Refreshing...');
      } else {
        Alert.alert('Error', 'Failed to remove item from cart');
        setCartItems(previousItems);
      }
      
      await fetchCart();
    }
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiService.clearCart();
            // Clear the cart items
            setCartItems([]);
          } catch (error) {
            console.log('Error clearing cart:', error);
            Alert.alert('Error', 'Failed to clear cart');
            // Refetch to ensure sync
            fetchCart();
          }
        }
      }
    ]);
  };

  const handleQuantityChange = async (itemId, delta) => {
    const item = cartItems.find(i => i._id === itemId);
    if (!item) {
      console.log('❌ Item not found in local state');
      return;
    }
    
    const newQty = item.quantity + delta;
    
    if (newQty > 8) {
      Alert.alert('Limit Reached', 'Maximum quantity per item is 8');
      return;
    }
    
    if (newQty <= 0) {
      handleRemove(itemId);
      return;
    }

    console.log('🔄 Updating item:', { itemId, currentQty: item.quantity, newQty });
    const previousItems = [...cartItems];
    setCartItems(prev => prev.map(i => i._id === itemId ? {...i, quantity: newQty} : i));

    try {
      const response = await apiService.updateCart({ itemId, quantity: newQty });
      console.log('✅ Update successful');
      
      if (response?.data?.items) {
        setCartItems(response.data.items);
      }
    } catch (error) {
      console.log('❌ Update failed:', error.response?.data || error.message);
      
      if (error.response?.status === 404) {
        Alert.alert('Item Not Found', 'This item is no longer in your cart. Refreshing...');
      } else {
        Alert.alert('Error', 'Failed to update quantity');
      }
      
      setCartItems(previousItems);
      await fetchCart();
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageBox}>
        <Icon name="grass" size={28} color="#3A9D4F" />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.item?.itemName || 'Unknown Item'}
        </Text>
        <Text style={styles.brand} numberOfLines={1}>
          {item.item?.brand || 'No Brand'}
        </Text>
        <Text style={styles.price}>₹{item.expectedPrice?.toFixed(2) || '0.00'}</Text>
      </View>

      <View style={styles.actions}>
        <View style={styles.qtyBox}>
          <TouchableOpacity 
            onPress={() => handleQuantityChange(item._id, -1)}
          >
            <Icon name="remove" size={18} color="#666" />
          </TouchableOpacity>
          <Text style={styles.qty}>{item.quantity}</Text>
          <TouchableOpacity 
            onPress={() => handleQuantityChange(item._id, 1)}
            disabled={item.quantity >= 8}
          >
            <Icon name="add" size={18} color={item.quantity >= 8 ? "#ccc" : "#666"} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleRemove(item._id)}>
          <Icon name="delete" size={20} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        {cartItems.length > 0 ? (
          <TouchableOpacity onPress={handleClearCart}>
            <Icon name="delete-sweep" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      {loading ? (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color="#3A9D4F" />
        </View>
      ) : cartItems.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="shopping-cart" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalPrice}>₹{total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.checkoutBtn}
              onPress={async () => {
                try {
                  setLoading(true);
                  await apiService.placeOrder();
                  setCartItems([]);
                  Alert.alert('Success', 'Order placed successfully!');
                } catch (error) {
                  console.log('Checkout error:', error);
                  Alert.alert('Error', 'Failed to place order. Please try again.');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F9F7",
  },
  header: {
    backgroundColor: "#3A9D4F",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  imageBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#DDF1DF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  brand: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2E7D32",
    marginTop: 4,
  },
  actions: {
    alignItems: "center",
    gap: 8,
  },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
  },
  qty: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    minWidth: 20,
    textAlign: "center",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E7D32",
  },
  checkoutBtn: {
    backgroundColor: "#2E7D32",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});