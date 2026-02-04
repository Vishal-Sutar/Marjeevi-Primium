import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import apiService from "../../../Redux/apiService";
import Icon from "react-native-vector-icons/MaterialIcons";
import Images from "../../../assets/Images/Images";
import { useTranslation } from "react-i18next";
import { useNavigation, useFocusEffect } from "@react-navigation/native";



const MarketPlace = () => {
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { t } = useTranslation();

  // const CATEGORIES = ["All", "Seeds", "Fertilizers", "Tools", "Pesticides"];

  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCartCount();
    }, [])
  );

  const fetchCartCount = async () => {
    try {
      const response = await apiService.getCart();
      const items = response?.data?.items || [];
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.log('Cart count error:', error.message);
    }
  };

  const fetchMarketplaceItems = async () => {
    try {
      setLoading(true);
      const response = await apiService.GetMarketplaceItems();
      console.log('Marketplace API response:', response);
      setProducts(response?.data || []);
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    const searchLower = search.toLowerCase();
    return products.filter(item => {
      const name = (item.itemName || item.productName || '').toLowerCase();
      const brand = (item.brand || '').toLowerCase();
      return name.includes(searchLower) || brand.includes(searchLower);
    });
  }, [search, products]);

  const handleAddToCart = async (item) => {
    try {
      await apiService.addToCart({
        itemId: item.itemId,
        quantity: 1,
        expectedPrice: item.price,
      });
      Alert.alert('Success', 'Item added to cart');
      fetchCartCount();
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

 const renderItem = ({ item }) => {
    const imageUrl = item.productImage?.url;
    
    return (
      <View style={styles.card}>
        <View style={styles.imageBox}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.productImage}
              onError={() => console.log('Image load error for:', item.itemName)}
            />
          ) : (
            <Icon name="grass" size={28} color="#3A9D4F" />
          )}
        </View>

        <Text style={styles.productName}>{item.itemName || 'N/A'}</Text>
        <Text style={styles.brand}>{item.brand || 'N/A'}</Text>

        <Text style={styles.price}>
          ₹{item.price || 0}
        </Text>

        <TouchableOpacity 
          style={styles.cartBtn}
          onPress={() => handleAddToCart(item)}
        >
          <Icon name="shopping-cart" size={14} color="#fff" style={styles.cartBtnIcon} />
          <Text style={styles.cartBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.backBtn}>
           <TouchableOpacity
            onPress={() => navigation.goBack()}
           >
             <Text style={styles.backIcon}>‹</Text>
           </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.headerTitle}>  {t("marketplace.title")}</Text>
            <Text style={styles.headerSub}>
             {t("marketplace.subtitle")}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.cartWrapper}
            onPress={() => navigation.navigate('Cart')}
          >
            <Icon name="shopping-cart" size={20} color="#fff" />
            {cartCount > 0 && (
              <View style={styles.cartDot}>
                <Text style={styles.cartCount}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Image
          style={styles.searchIcon}
          source={Images.Search}
          />
          <TextInput
            placeholder={t("marketplace.search")}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* CATEGORY TABS */}
      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {CATEGORIES.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setSelectedCategory(item)}
            style={[
              styles.categoryChip,
              selectedCategory === item && styles.categoryActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextActive,
              ]}
            >
              {t(`marketplace.category.${item.toLowerCase()}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}

      {/* PRODUCTS LIST */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3A9D4F" />
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyText}>No products available</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item, index) => item.itemId || index.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MarketPlace;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F9F7",
  },

  /* HEADER */
  header: {
    backgroundColor: "#3A9D4F",
    padding: 16,
    paddingBottom: 26,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 22,
    color: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  headerSub: {
    fontSize: 12,
    color: "#E0F2E9",
    marginTop: 2,
  },

  cartWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cartIcon: {
    fontSize: 18,
    color: "#fff",
  },
  cartDot: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  cartCount: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },

  /* SEARCH */
  searchBox: {
    backgroundColor: "#fff",
    borderRadius: 25,
    marginTop: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    color: "#000",
  },

  /* CATEGORY */
  categoryRow: {
    marginTop: 14,
    paddingLeft: 16,
  },
 /* CATEGORY */
categoryContainer: {
  flexDirection: "row",     // ⭐ required for horizontal
  paddingHorizontal: 16,
  paddingTop: 14,
   paddingBottom: 15,
},

categoryChip: {
  width: 80,               // ✅ SAME WIDTH
  height: 44,              // ✅ SAME HEIGHT
  backgroundColor: "#fff",
  marginRight: 10,

  borderRadius: 22,
  borderWidth: 1,
  borderColor: "#E0E0E0",

  justifyContent: "center",
  alignItems: "center",
},

categoryActive: {
  backgroundColor: "#3A9D4F",
  borderColor: "#3A9D4F",
},

categoryText: {
  fontSize: 12,
  color: "#555",
},

categoryTextActive: {
  color: "#fff",
  fontWeight: "600",
},


  /* PRODUCT CARD */
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  imageBox: {
    backgroundColor: "#DDF1DF",
    height: 90,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
  },
  brand: {
    fontSize: 11,
    color: "#777",
    marginVertical: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2E7D32",
  },
  unit: {
    fontSize: 10,
    color: "#777",
  },
  stock: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
  },
  cartBtn: {
    marginTop: 8,
    backgroundColor: "#2E7D32",
    borderRadius: 20,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cartBtnIcon: {
    marginRight: 4,
  },
  cartBtnText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
});
