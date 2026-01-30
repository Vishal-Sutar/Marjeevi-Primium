export const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      select_language: "Select Language",
      continue: "Continue",
      home_title: "Home Screen",
      profile: "Profile",

      next: "Next",
      skip: "Skip",
      app_name: "App Name",

      buy_sell_title: "BUY & SELL",
      buy_sell_subtitle: "BUY & Sell with verified prices",
      buy_sell_card_subtitle: "with verified prices",

      lang_en_sub: "Practice farming in your language",
      lang_hi_sub: "Practice farming in Hindi",


  /* ROLE SCREEN */
      role_welcome: "Welcome!",
      role_subtitle: "Choose your role to continue",
      role_farmer: "Farmer",
      role_farmer_desc: "Sell crops, buy inputs, manage farm",
      role_staff: "Procurement Staff",
      role_staff_desc: "Purchase crops, quality checks, stock",
      role_fpo: "FPO",
      role_fpo_desc: "Manage farmers, schemes",
      role_footer: "Your role helps us personalize your experience",

      /* LOGIN */
      login_title: "{{role}} Login",
      login_subtitle: "Enter your mobile number to continue",
      mobile_number: "Mobile Number",
      mobile_placeholder: " Enter 10-digit mobile number",
      login_with_otp: "Login with OTP",
      login_with_google: "Login with Google",
      no_account: "Don’t have an account?",
      register_as: "Register as {{role}}",

      invalid_mobile_title: "Invalid Mobile",
      invalid_mobile_message: "Enter a valid 10-digit mobile number",


    
      /* SCREEN 1 */
      step_1_of_2: "Step 1 of 2",
      personal_details: "Personal Details",
      full_name: "Full Name",
      enter_full_name: "Enter your full name",
      mobile_number: "Mobile Number",
      mobile_placeholder_short: "0000000000",
      password: "Password",
      enter_password: "Enter password",
      gender: "Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      village: "Village",
      enter_village: "Enter village name",

      error: "Error",
      fill_required_fields: "Please fill all required fields",

      /* SCREEN 2 */
      step_2_of_3: "Step 2 of 3",
      address_details: "Address Details",
      state: "State",
      district: "District",
      select_state: "Select State",
      select_district: "Select District",
      gps_address: "GPS Address",
      no_address_detected: "No address detected",
      current_location: "📍 Current Location",
      latitude: "Latitude",
      longitude: "Longitude",
      detect_gps: "Detect GPS Location",

      location_failed: "Failed to get location",
      location_found: "Location Found",
      address_not_available: "Address not available for this location",
      permission_denied: "Permission denied",
      location_permission_required: "Location permission is required",
      location_error: "Location Error",
      turn_on_location: "Please turn ON location services",
      open_settings: "Open Settings",

      /* STATES & DISTRICTS */
      states: [
        "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
        "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
        "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
        "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
        "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
        "Uttarakhand","West Bengal","Delhi",
      ],

      districts: [
        "Pune","Mumbai","Nashik","Nagpur","Aurangabad","Kolhapur","Solapur",
      ],

      /* SCREEN 3 */
step_3_of_4: "Step 3 of 4",
farmer_category: "Farmer Category",
select_farmer_category: "Select your farming category",
select_farmer_category_alert: "Please select farmer category",

farmer_small: "Small Farmer",
farmer_small_sub: "1–2 hectares",

farmer_marginal: "Marginal Farmer",
farmer_marginal_sub: "Less than 1 hectare",

farmer_medium: "Medium Farmer",
farmer_medium_sub: "2–10 hectares",

/* SCREEN 4 */
step_4_of_5: "Step 4 of 5",
crops_grown: "Crops Grown",
current_year: "Year 1 (Current)",

crop_name: "Crop Name",
select_crop: "Select Crop",

season: "Season",
kharif: "Kharif",
rabi: "Rabi",
zaid: "Zaid",

quantity_optional: "Quantity Produced (Optional)",
quantity_placeholder: "e.g. 500 kg",

select_crop_season: "Please select crop and season",

kharif: "Kharif",
rabi: "Rabi",
zaid: "Zaid",

/* CROPS */
crop_rice: "Rice",
crop_wheat: "Wheat",
crop_maize: "Maize",
crop_cotton: "Cotton",
crop_sugarcane: "Sugarcane",
crop_soybean: "Soybean",
crop_groundnut: "Groundnut",

/* SCREEN 5 */
step_5_of_6: "Step 5 of 6",
land_details: "Land Details",

plot_id: "Plot ID",
plot_placeholder: "e.g., PLOT-001",

area_hectares: "Area (hectares)",
area_placeholder: "e.g., 2.5",

irrigation_type: "Irrigation Type",
soil_type: "Soil Type",

select_type: "Select Type",
select_soil: "Select Soil",

fill_land_details: "Please fill all land details",

/* IRRIGATION */
irrigation_canal: "Canal",
irrigation_borewell: "Borewell",
irrigation_rainfed: "Rainfed",
irrigation_drip: "Drip",

/* SOIL */
soil_black: "Black Soil",
soil_red: "Red Soil",
soil_alluvial: "Alluvial Soil",
soil_sandy: "Sandy Soil",

/* SCREEN 6 */
step_6_of_7: "Step 6 of 7",

bank_details: "Bank Details",
bank_optional_note: "Optional – for direct payments",

bank_name: "Bank Name",
bank_name_placeholder: "e.g., State Bank of India",

ifsc_code: "IFSC Code",
ifsc_placeholder: "e.g., SBIN0001234",

account_number: "Account Number",
account_placeholder: "Enter account number",


/* SCREEN 7 */
step_7_of_7: "Step 7 of 7",

document_upload: "Document Upload",
upload_supporting_documents: "Upload supporting documents",

upload_soil_card: "Upload Soil Health Card",
upload_lab_report: "Upload Lab Report",
upload_gov_document: "Upload Government Scheme Document",

complete_registration: "Complete Registration",

/* ALERTS */
success: "Success",
data_sent_success: "Data successfully sent to backend ✅",
backend_error: "Backend error, check console",


/* OTP SCREEN */
verify_email: "Verify your Email",
otp_sent_to: "We sent an OTP to:",
enter_4_digit_otp: "Please enter 4 digit OTP",

submit: "Submit",
resend_otp: "Resend OTP",
otp_resent: "OTP resent (dummy)",

/* STAFF LOGIN */
employee_login: "Employee Login",
employee_login_sub: "Access your employee account",

password: "Password",
otp: "OTP",
employee_id: "Employee ID",
mobile: "Mobile",

enter_employee_id: "Please enter Employee ID",
enter_employee_id_ph: "Enter employee ID",
enter_mobile_ph: "Enter mobile number",
enter_valid_mobile: "Please enter valid mobile number",
enter_password: "Please enter password",

login: "Login",
login_with_otp: "Login with OTP",
login_success: "Login Success",

login_type: "Login Type",
id_type: "ID Type",

forgot_password: "Forgot Password?",
no_account: "Don’t have an account?",
register_employee: "Register as Employee",

error: "Error",

/* EMPLOYEE REGISTRATION */
back_to_login: "Back to Login",

employee_registration: "Employee Registration",
employee_registration_sub: "Create your employee account",

first_name: "First Name",
last_name: "Last Name",
mobile_number: "Mobile Number",
email: "Email",

enter_first_name: "Enter first name",
enter_last_name: "Enter last name",
enter_mobile_number: "Enter mobile number",
enter_email: "Enter email",

state: "State",
district: "District",
village: "Village",

select_state: "Select state",
select_district: "Select district",
select_village: "Select village",

joining_date: "Joining Date",
joining_date_ph: "DD/MM/YYYY",

register: "Register",

error: "Error",
success: "Success",
fill_required_fields: "Please fill all required fields",
employee_registered_success: "Employee registered successfully",


/* FPO LOGIN */
fpo_login: "FPO Login",
fpo_login_subtitle: "Login with GST number or mobile",

gst_number: "GST Number",
enter_gst: "Enter GST Number",

mobile_number: "Mobile Number",
enter_mobile: "Enter 10-digit mobile number",

login: "Login",
please_wait: "Please wait...",

dont_have_account: "Don't have an account?",
register_as_fpo: "Register as FPO",

login_failed: "Login Failed",
invalid_credentials: "Invalid credentials",

/* FPO REGISTRATION */
fpo_registration: "FPO Registration",
fpo_registration_sub: "Create your retailer account",

back_to_login: "Back to Login",

first_name: "First Name",
enter_first_name: "Enter your first name",

last_name: "Last Name",
enter_last_name: "Enter your last name",

email: "Email",
enter_email: "Enter your email",

phone_number: "Phone Number",
enter_phone: "Enter your phone number",

state: "State",
select_state: "Select state",

district: "District",
select_district: "Select district",

village: "Village",
select_village: "Select village",

gst_number: "GST Number",
enter_gst: "Enter GST number",

register: "Register",

error: "Error",
success: "Success",
fill_required_fields: "Please fill all required fields",
registration_submitted: "Registration submitted successfully",


states: [
        "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
        "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
        "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
        "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
        "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
        "Uttarakhand","West Bengal","Delhi",
      ],

      districts: [
        "Pune","Mumbai","Nashik","Nagpur",
        "Aurangabad","Kolhapur","Solapur",
      ],

      villages: [
        "Village A","Village B","Village C",
        "Village D","Village E",
      ],

 "hello_farmer": "Hello, Farmer",
  "welcome_back": "Welcome back to Farmer Portal",
  "quick_actions": "rs",
  "recent_activities": "Recent Activities",
  "see_all": "See All",
  "create_listing": "Create Listing",
  "buy_inputs": "Buy Inputs",
  "my_profile": "My Profile",
  "documents": "Documents",
  "my_farm": "My Farm",
  "my_crop": "My Crop",
  "crop_doctor": "Crop Doctor",
  "chatbot": "AI Assistant",

  //Documents

  "documents": "Documents",
  "manage_documents": "Manage your farming documents",
  "soil_health_card": "Soil Health Card",
  "soil_health_desc": "Upload your soil health card for better recommendations",
  "lab_reports": "Lab Reports",
  "lab_reports_desc": "Crop quality and soil test reports",
  "gov_documents": "Government Scheme Documents",
  "gov_documents_desc": "PM-KISAN, scheme enrollment certificates",
  "upload_document": "Upload Document",
  "reupload": "Re-upload",
  "view": "View",
  "why_upload": "Why upload documents?",
  "why_upload_desc": "Your documents help us verify your profile and provide better crop recommendations.",


  
  "marketplace": {
    "title": "Marketplace",
    "subtitle": "Buy quality inputs for your farm",
    "search": "Search products...",
    "add_to_cart": "Add to Cart",

    "categories": ["All", "Seeds", "Fertilizers", "Tools", "Pesticides"],

    "category": {
      "all": "All",
      "seeds": "Seeds",
      "fertilizers": "Fertilizers",
      "tools": "Tools",
      "pesticides": "Pesticides"
    },

    "products": [
      {
        "id": "1",
        "name": "Hybrid Tomato Seeds",
        "brand": "AgroVet Supplies",
        "price": "₹450",
        "unit": "per packet",
        "category": "Seeds",
        "icon": "🌱"
      },
      {
        "id": "2",
        "name": "Organic Fertilizer",
        "brand": "GreenGrow Industries",
        "price": "₹850",
        "unit": "per 50kg bag",
        "category": "Fertilizers",
        "icon": "🌾"
      }
    ]
  },

  "bank_details": "Bank Details",
  "documents": "Documents",
  "logout": "Logout",
  "edit": "Edit",
  "delete": "Delete",

  "listing": {
    "my_listings": "My Listings",
    "total": "{{count}} total listings",
    "status": {
      "approved": "Approved",
      "pending": "Pending",
      "sold": "Sold"
    }
  },
  "common": {
    "edit": "Edit",
    "delete": "Delete",
    "amount": "Amount",
    "date": "Date",
    "save": "Save Entry"
  },

  "create_listing": {
    "title": "Create Listing",
    "crop_info": "Crop Information",
    "crop_name": "Crop Name",
    "variety": "Variety",
    "quantity": "Quantity (kg)",
    "price": "Price (₹/kg)",
    "location": "Location",
    "enter_location": "Enter location",
    "use_location": "Use current location",
    "upload_images": "Upload Images",
    "add": "Add",
    "submit": "Submit Listing",
    "fill_required": "Please fill all required fields",
    "submitted": "Listing submitted successfully"
},

  "profile": {
    "role_farmer": "Farmer",
    "edit_profile": "Edit Profile",
    "logout": "Logout",
    "menu": {
      "personal_details": "Personal Details",
      "address_details": "Address Details",
      "farmer_category": "Farmer Category",
      "crops_grown": "Crops Grown",
      "land_details": "Land Details",
      "bank_details": "Bank Details",
      "uploaded_documents": "Uploaded Documents",
      "help_support": "Help & Support"
    }
  },

  "farmer_tabs": {
    "home": "Home",
    "marketplace": "Marketplace",
    "listings": "My Listings",
    "profile": "My Profile"
  },

  "fpo_dashboard": "FPO Dashboard",
  "manage_farmers": "Manage farmers and operations",

  "total_farmers": "Total Farmers",
  "active_fields": "Active Fields",
  "pending_payments": "Pending Payments",

  "quick_actions": "Quick Action",
  "crop_statistics": "Crop Statistics",

  "add_farmer": "Add Farmer",
  "order_details": "Order Details",
  "farmer_listing": "Farmer Listing",
  "ledger": "Ledger",

  "wheat": "Wheat",
  "rice": "Rice",
  "cotton": "Cotton",
  "others": "Others",



  //Ladger


  "ledger": "Ledger",
  "ledger_date": "{{date}}",

  "pending_payments": "Pending Payments",
  "completed_today": "Completed Today",
  "paid_this_month": "Total Paid This Month",

  "download_ledger": "Download Ledger",
  "urgent": "Urgent",
  "due": "Due",
  "today": "Today",
  "mark_paid": "Mark as Paid",


  "farmer_management": "Farmer Management",
  "farmer_management_sub": "Master records & verification",
  "search_farmers": "Search farmers...",

  "filter": {
    "all": "All",
    "verified": "Verified",
    "pending": "Pending"
  },

  "status": {
    "verified": "Verified",
    "pending": "Pending"
  },

  "fields": "fields",
  "view_details": "View Details",

// Inventory

 "inventory": {
    "title": "Inventory & Inputs",
    "add_product": "Add Product",
    "brand": "Brand",
    "mrp": "MRP",
    "update": "Update",
    "status": {
      "in": "In Stock",
      "low": "Low Stock"
    }
  },

  "profile": {
    "edit": "Edit Profile",
    "account_details": "Account Details",
    "account": {
      "phone": "Phone",
      "email": "Email",
      "location": "Location"
    },
    "features": {
      "field_crop_mapping": {
        "title": "Field & Crop Mapping",
        "sub": "Land and crop overview"
      },
      "schemes_subsidies": {
        "title": "Schemes & Subsidies",
        "sub": "Government programs"
      }
    },
    "settings": {
      "notifications": "Notifications",
      "language": "Language",
      "privacy": "Privacy & Security",
      "help": "Help & Support",
      "logout": "Logout"
    },
    "app_name": "KrishiGyan FPO App"
  },
  "roles": {
    "fpo": "FPO"
  },
 "field_mapping": {
    "title": "Field & Crop Mapping",
    "subtitle": "Land and crop overview",
    "area": "Area",
    "crop": "Crop",
    "status": "Status",
    "status_growing": "Growing",
    "status_harvesting": "Harvesting"
  },

  // schemessubside

"schemes": {
    "title": "Schemes & Subsidies",
    "subtitle": "Government programs",
    "enrolled": "Enrolled",
    "amount": "Subsidy Amount"
  },

  // FPO tabs

   "tabs": {
    "home": "Home",
    "farmers": "Farmers",
    "inventory": "Inventory",
    "profile": "Profile"
  },


  // Employee tabs

   "tabs": {
    "home": "Home",
    "farmers": "Farmers",
    "buy": "Buy",
    "stock": "Stock",
    "profile": "Profile"
  },

  // employee home page
  
  "home": {
    "title": "Today's Dashboard",
    "subtitle": "Procurement Staff Portal",
    "add_listing": "View Listing",
    "recent_procurements": "Recent Procurements"
  },
  "stats": {
    "today_procurements": "Today's Procurements",
    "pending_quality": "Pending Quality Checks",
    "pending_payments": "Pending Payments"
  },
  "common": {
    "amount": "Amount",
    "date": "Date"
  },
  "status": {
    "completed": "Completed"
  },


  "purchase": {
    "title": "Purchase Records",
    "add": "Add Purchase"
  },
  "filters": {
    "all": "All",
    "completed": "Completed",
    "pending": "Pending",
    "quality": "Quality Check"
  },
  "status": {
    "completed": "Completed",
    "pending": "Pending",
    "quality": "Quality Check"
  },
  "common": {
    "amount": "Amount",
    "date": "Date"
  }
,

"stock": {
    "title": "Stock Management",
    "add_product": "Add Product",
    "brand": "Brand",
    "mrp": "MRP",
    "in_stock": "In Stock",
    "expiry": "Expiry",
    "summary": {
      "low_stock": "Low Stock",
      "total_products": "Total Products",
      "near_expiry": "Near Expiry",
      "out_of_stock": "Out of Stock"
    },
    "status": {
      "in_stock": "In Stock",
      "low_stock": "Low Stock",
      "out_stock": "Out of Stock"
    }
  },
  "common": {
    "update": "Update"
  },
  "farmers": {
    "title": "Farmers",
    "search": "Search farmers...",
    "verified": "Verified",
    "fields": "fields"
  },

   "profile": {
     "name": "Profile",
  "role": "Procurement Staff",
    "account_details": "Account Details",
    "settings_title": "Settings",
    "logout": "Logout",
    "logout_title": "Logout",
    "logout_confirm": "Are you sure you want to logout?",
    "account": {
      "phone": "Phone Number",
      "email": "Email Address",
      "location": "Location"
    },
  "roles": {
    "procurement_staff": "Procurement Staff"
  },
    "settings": {
      "notifications": "Notifications",
      "language": "Language",
      "privacy": "Privacy & Security",
      "help": "Help & Support"
    }
  },
  "common": {
    "cancel": "Cancel"
  },

  
  "add_product": {
    "title": "Add Product",
    "product_name": "Product Name",
    "product_name_placeholder": "e.g. Organic Wheat Flour",
     "description": "Description",
    "description_placeholder": "Enter product description",
    "brand": "Brand / Source",
    "select_source": "Select source",
    "mrp": "MRP",
    "mrp_placeholder": "₹ 0.00",
    "quantity": "Quantity",
    "unit": "Unit",
    "select": "Select",
    "purchase_date": "Purchase Date",
    "expiry_date": "Expiry Date",
    "date_placeholder": "mm/dd/yyyy",
    "save": "Save Product"
  },

"back": "Back",
  "back_to_login": "Back to Login",

  "error": "Error",
  "success": "Success",
  "info": "Info",
  "ok": "OK",
  "fill_required_fields": "Please fill all required fields",

  "first_name": "First Name",
  "last_name": "Last Name",
  "email": "Email",
  "phone_number": "Phone Number",
  "password": "Password",
  "enter_first_name": "Enter first name",
  "enter_last_name": "Enter last name",
  "enter_email": "Enter email",
  "enter_phone": "Enter phone number",
  "enter_password": "Enter password",

  "gender": "Gender",
  "male": "Male",
  "female": "Female",
  "select_gender": "Select gender",

  "state": "State",
  "district": "District",
  "village": "Village",
  "select_state": "Select state",
  "select_district": "Select district",
  "select_village": "Select village",

  "gst_number": "GST Number",
  "enter_gst": "Enter GST number",

  "shop_name": "FPO / Shop Name",

  "register": "Register",
  "update_profile": "Update Profile",
  "update_profile_sub": "Update your personal information",
  "profile_updated": "Profile updated successfully",

  "fpo_registration": "FPO Registration",
  "fpo_registration_sub": "Create your FPO account",

  "add_product": {
    "title": "Add Product",
    "product_name": "Product Name",
    "product_name_placeholder": "Enter product name",
    "description": "Description",
    "description_placeholder": "Enter product description",
    "brand": "Brand",
    "select_source": "Enter brand",
    "mrp": "MRP",
    "mrp_placeholder": "Enter MRP",
    "quantity": "Quantity",
    "unit": "Unit",
    "select": "Select",
    "purchase_date": "Purchase Date",
    "expiry_date": "Expiry Date",
    "date_placeholder": "DD/MM/YYYY",
    "save": "Save"
  },

  "profile": {
    "edit": "Edit Profile",
    "account_details": "Account Details",
    "app_name": "KrishiYan App",

    "account": {
      "phone": "Phone",
      "email": "Email",
      "location": "Location"
    },

    "features": {
      "field_crop_mapping": {
        "title": "Field Crop Mapping",
        "sub": "Manage your field mapping"
      },
      "schemes_subsidies": {
        "title": "Schemes & Subsidies",
        "sub": "View available schemes"
      }
    },

    "settings": {
      "notifications": "Notifications",
      "language": "Language",
      "privacy": "Privacy Policy",
      "help": "Help & Support",
      "logout": "Logout"
    }
  },

  "roles": {
    "fpo": "FPO",
    "employee": "Employee"
  },

  "states": [
    "Maharashtra",
    "Gujarat",
    "Madhya Pradesh",
    "Andhra Pradesh"
  ],

  "districts": [
    "Pune",
    "Nagpur",
    "Nashik"
  ],

  "villages": [
    "Village A",
    "Village B",
    "Village C"
  ],

"purchase": {
    "title": "Purchase Records",
    "add": "Add Purchase",
    "add_title": "Add Purchase Entry",
    "add_subtitle": "Record new procurement",
    "farmer": "Select Farmer",
    "choose_farmer": "Choose farmer",
    "crop": "Select Crop",
    "choose_crop": "Choose crop",
    "rate": "Rate Per Kg (₹)",
    "quantity": "Quantity (kg)",
    "date": "Procurement Date",
    "center": "Procurement Center",
    "godown": "Godown",
    "vehicle": "Vehicle",
    "remarks": "Remarks"
  }

    },
  },



  hi: {
    translation: {
      welcome: "स्वागत है",
      select_language: "भाषा चुनें",
      continue: "जारी रखें",
      home_title: "होम स्क्रीन",
      profile: "प्रोफ़ाइल",

      next: "आगे",
      skip: "छोड़ें",
      app_name: "ऐप नाम",

      buy_sell_title: "खरीदें और बेचें",
      buy_sell_subtitle: "सत्यापित कीमतों के साथ खरीदें और बेचें",
      buy_sell_card_subtitle: "सत्यापित कीमतों के साथ",

      lang_en_sub: "अपनी भाषा में खेती का अभ्यास करें",
      lang_hi_sub: "हिंदी में खेती का अभ्यास करें",


 /* ROLE SCREEN */
      role_welcome: "स्वागत है!",
      role_subtitle: "जारी रखने के लिए अपनी भूमिका चुनें",
      role_farmer: "किसान",
      role_farmer_desc: "फसल बेचें, इनपुट खरीदें, खेती प्रबंधित करें",
      role_staff: "खरीद कर्मचारी",
      role_staff_desc: "फसल खरीद, गुणवत्ता जांच, स्टॉक",
      role_fpo: "एफपीओ",
      role_fpo_desc: "किसानों और योजनाओं का प्रबंधन",
      role_footer: "आपकी भूमिका हमें अनुभव बेहतर बनाने में मदद करती है",
      /* LOGIN */
      login_title: "{{role}} लॉगिन",
      login_subtitle: "जारी रखने के लिए अपना मोबाइल नंबर दर्ज करें",
      mobile_number: "मोबाइल नंबर",
      mobile_placeholder: " 10 अंकों का मोबाइल नंबर दर्ज करें",
      login_with_otp: "ओटीपी से लॉगिन करें",
      login_with_google: "गूगल से लॉगिन करें",
      no_account: "खाता नहीं है?",
      register_as: "{{role}} के रूप में पंजीकरण करें",

      invalid_mobile_title: "अमान्य मोबाइल",
      invalid_mobile_message: "कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें",


      step_1_of_2: "चरण 1 / 2",
      personal_details: "व्यक्तिगत जानकारी",
      full_name: "पूरा नाम",
      enter_full_name: "अपना पूरा नाम दर्ज करें",
      mobile_number: "मोबाइल नंबर",
      mobile_placeholder_short: "0000000000",
      password: "पासवर्ड",
      enter_password: "पासवर्ड दर्ज करें",
      gender: "लिंग",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य",
      village: "गांव",
      enter_village: "गांव का नाम दर्ज करें",

      error: "त्रुटि",
      fill_required_fields: "कृपया सभी आवश्यक फ़ील्ड भरें",

      step_2_of_3: "चरण 2 / 3",
      address_details: "पता विवरण",
      state: "राज्य",
      district: "जिला",
      select_state: "राज्य चुनें",
      select_district: "जिला चुनें",
      gps_address: "जीपीएस पता",
      no_address_detected: "कोई पता नहीं मिला",
      current_location: "📍 वर्तमान स्थान",
      latitude: "अक्षांश",
      longitude: "देशांतर",
      detect_gps: "जीपीएस लोकेशन पता करें",

      location_failed: "लोकेशन प्राप्त करने में विफल",
      location_found: "लोकेशन मिली",
      address_not_available: "इस लोकेशन के लिए पता उपलब्ध नहीं",
      permission_denied: "अनुमति अस्वीकृत",
      location_permission_required: "लोकेशन अनुमति आवश्यक है",
      location_error: "लोकेशन त्रुटि",
      turn_on_location: "कृपया लोकेशन चालू करें",
      open_settings: "सेटिंग्स खोलें",

      /* STATES & DISTRICTS */
      states: [
        "आंध्र प्रदेश","अरुणाचल प्रदेश","असम","बिहार","छत्तीसगढ़",
        "गोवा","गुजरात","हरियाणा","हिमाचल प्रदेश","झारखंड",
        "कर्नाटक","केरल","मध्य प्रदेश","महाराष्ट्र","मणिपुर",
        "मेघालय","मिज़ोरम","नागालैंड","ओडिशा","पंजाब","राजस्थान",
        "सिक्किम","तमिलनाडु","तेलंगाना","त्रिपुरा","उत्तर प्रदेश",
        "उत्तराखंड","पश्चिम बंगाल","दिल्ली",
      ],

      districts: [
        "पुणे","मुंबई","नाशिक","नागपुर","औरंगाबाद","कोल्हापुर","सोलापुर",
      ],

      /* SCREEN 3 */
step_3_of_4: "चरण 3 / 4",
farmer_category: "किसान श्रेणी",
select_farmer_category: "अपनी खेती की श्रेणी चुनें",
select_farmer_category_alert: "कृपया किसान श्रेणी चुनें",

farmer_small: "छोटा किसान",
farmer_small_sub: "1–2 हेक्टेयर",

farmer_marginal: "सीमांत किसान",
farmer_marginal_sub: "1 हेक्टेयर से कम",

farmer_medium: "मध्यम किसान",
farmer_medium_sub: "2–10 हेक्टेयर",


/* SCREEN 4 */
step_4_of_5: "चरण 4 / 5",
crops_grown: "उगाई गई फसलें",
current_year: "वर्ष 1 (वर्तमान)",

crop_name: "फसल का नाम",
select_crop: "फसल चुनें",

season: "मौसम",
kharif: "खरीफ",
rabi: "रबी",
zaid: "जायद",

quantity_optional: "उत्पादन मात्रा (वैकल्पिक)",
quantity_placeholder: "उदाहरण: 500 किलो",

select_crop_season: "कृपया फसल और मौसम चुनें",

kharif: "खरीफ",
rabi: "रबी",
zaid: "जायद",


/* CROPS */
crop_rice: "चावल",
crop_wheat: "गेहूं",
crop_maize: "मक्का",
crop_cotton: "कपास",
crop_sugarcane: "गन्ना",
crop_soybean: "सोयाबीन",
crop_groundnut: "मूंगफली",

/* SCREEN 5 */
step_5_of_6: "चरण 5 / 6",
land_details: "भूमि विवरण",

plot_id: "प्लॉट आईडी",
plot_placeholder: "उदाहरण: PLOT-001",

area_hectares: "क्षेत्रफल (हेक्टेयर)",
area_placeholder: "उदाहरण: 2.5",

irrigation_type: "सिंचाई का प्रकार",
soil_type: "मिट्टी का प्रकार",

select_type: "प्रकार चुनें",
select_soil: "मिट्टी चुनें",

fill_land_details: "कृपया भूमि की सभी जानकारी भरें",

/* IRRIGATION */
irrigation_canal: "नहर",
irrigation_borewell: "बोरवेल",
irrigation_rainfed: "वर्षा आधारित",
irrigation_drip: "ड्रिप सिंचाई",

/* SOIL */
soil_black: "काली मिट्टी",
soil_red: "लाल मिट्टी",
soil_alluvial: "जलोढ़ मिट्टी",
soil_sandy: "रेतीली मिट्टी",


/* SCREEN 6 */
step_6_of_7: "चरण 6 / 7",

bank_details: "बैंक विवरण",
bank_optional_note: "वैकल्पिक – सीधे भुगतान के लिए",

bank_name: "बैंक का नाम",
bank_name_placeholder: "उदाहरण: स्टेट बैंक ऑफ इंडिया",

ifsc_code: "आईएफएससी कोड",
ifsc_placeholder: "उदाहरण: SBIN0001234",

account_number: "खाता संख्या",
account_placeholder: "खाता संख्या दर्ज करें",


/* SCREEN 7 */
step_7_of_7: "चरण 7 / 7",

document_upload: "दस्तावेज़ अपलोड",
upload_supporting_documents: "समर्थन दस्तावेज़ अपलोड करें",

upload_soil_card: "मिट्टी स्वास्थ्य कार्ड अपलोड करें",
upload_lab_report: "लैब रिपोर्ट अपलोड करें",
upload_gov_document: "सरकारी योजना दस्तावेज़ अपलोड करें",

complete_registration: "पंजीकरण पूरा करें",

/* ALERTS */
success: "सफलता",
data_sent_success: "डेटा सफलतापूर्वक बैकएंड को भेजा गया ✅",
backend_error: "बैकएंड त्रुटि, कंसोल जांचें",


/* OTP SCREEN */
verify_email: "अपने ईमेल की पुष्टि करें",
otp_sent_to: "हमने OTP भेजा है:",
enter_4_digit_otp: "कृपया 4 अंकों का OTP दर्ज करें",

submit: "सबमिट करें",
resend_otp: "OTP पुनः भेजें",
otp_resent: "OTP पुनः भेजा गया (डमी)",


/* STAFF LOGIN */
employee_login: "कर्मचारी लॉगिन",
employee_login_sub: "अपने कर्मचारी खाते में प्रवेश करें",

password: "पासवर्ड",
otp: "ओटीपी",
employee_id: "कर्मचारी आईडी",
mobile: "मोबाइल",

enter_employee_id: "कृपया कर्मचारी आईडी दर्ज करें",
enter_employee_id_ph: "कर्मचारी आईडी दर्ज करें",
enter_mobile_ph: "मोबाइल नंबर दर्ज करें",
enter_valid_mobile: "कृपया सही मोबाइल नंबर दर्ज करें",
enter_password: "कृपया पासवर्ड दर्ज करें",

login: "लॉगिन",
login_with_otp: "ओटीपी से लॉगिन करें",
login_success: "लॉगिन सफल",

login_type: "लॉगिन प्रकार",
id_type: "आईडी प्रकार",

forgot_password: "पासवर्ड भूल गए?",
no_account: "खाता नहीं है?",
register_employee: "कर्मचारी के रूप में पंजीकरण करें",

error: "त्रुटि",

/* EMPLOYEE REGISTRATION */
back_to_login: "लॉगिन पर वापस जाएं",

employee_registration: "कर्मचारी पंजीकरण",
employee_registration_sub: "अपना कर्मचारी खाता बनाएं",

first_name: "पहला नाम",
last_name: "अंतिम नाम",
mobile_number: "मोबाइल नंबर",
email: "ईमेल",

enter_first_name: "पहला नाम दर्ज करें",
enter_last_name: "अंतिम नाम दर्ज करें",
enter_mobile_number: "मोबाइल नंबर दर्ज करें",
enter_email: "ईमेल दर्ज करें",

state: "राज्य",
district: "जिला",
village: "गांव",

select_state: "राज्य चुनें",
select_district: "जिला चुनें",
select_village: "गांव चुनें",

joining_date: "ज्वाइनिंग तिथि",
joining_date_ph: "DD/MM/YYYY",

register: "पंजीकरण करें",

error: "त्रुटि",
success: "सफल",
fill_required_fields: "कृपया सभी आवश्यक फ़ील्ड भरें",
employee_registered_success: "कर्मचारी सफलतापूर्वक पंजीकृत हुआ",


/* FPO LOGIN */
fpo_login: "एफपीओ लॉगिन",
fpo_login_subtitle: "GST नंबर या मोबाइल से लॉगिन करें",

gst_number: "जीएसटी नंबर",
enter_gst: "जीएसटी नंबर दर्ज करें",

mobile_number: "मोबाइल नंबर",
enter_mobile: "10 अंकों का मोबाइल नंबर दर्ज करें",

login: "लॉगिन करें",
please_wait: "कृपया प्रतीक्षा करें...",

dont_have_account: "खाता नहीं है?",
register_as_fpo: "एफपीओ के रूप में पंजीकरण करें",

login_failed: "लॉगिन विफल",
invalid_credentials: "गलत विवरण",


/* FPO REGISTRATION */
fpo_registration: "एफपीओ पंजीकरण",
fpo_registration_sub: "अपना रिटेलर खाता बनाएं",

back_to_login: "लॉगिन पर वापस जाएं",

first_name: "पहला नाम",
enter_first_name: "पहला नाम दर्ज करें",

last_name: "अंतिम नाम",
enter_last_name: "अंतिम नाम दर्ज करें",

email: "ईमेल",
enter_email: "ईमेल दर्ज करें",

phone_number: "मोबाइल नंबर",
enter_phone: "मोबाइल नंबर दर्ज करें",

state: "राज्य",
select_state: "राज्य चुनें",

district: "जिला",
select_district: "जिला चुनें",

village: "गांव",
select_village: "गांव चुनें",

gst_number: "जीएसटी नंबर",
enter_gst: "जीएसटी नंबर दर्ज करें",

register: "पंजीकरण करें",

error: "त्रुटि",
success: "सफल",
fill_required_fields: "कृपया सभी आवश्यक फ़ील्ड भरें",
registration_submitted: "पंजीकरण सफलतापूर्वक जमा किया गया",


states: [
        "आंध्र प्रदेश","अरुणाचल प्रदेश","असम","बिहार","छत्तीसगढ़",
        "गोवा","गुजरात","हरियाणा","हिमाचल प्रदेश","झारखंड",
        "कर्नाटक","केरल","मध्य प्रदेश","महाराष्ट्र","मणिपुर",
        "मेघालय","मिज़ोरम","नागालैंड","ओडिशा","पंजाब","राजस्थान",
        "सिक्किम","तमिलनाडु","तेलंगाना","त्रिपुरा","उत्तर प्रदेश",
        "उत्तराखंड","पश्चिम बंगाल","दिल्ली",
      ],

      districts: [
        "पुणे","मुंबई","नाशिक","नागपुर",
        "औरंगाबाद","कोल्हापुर","सोलापुर",
      ],

      villages: [
        "गांव A","गांव B","गांव C",
        "गांव D","गांव E",
      ],

      "hello_farmer": "नमस्ते किसान",
  "welcome_back": "किसान पोर्टल में आपका स्वागत है",
 "quick_actions": "त्वरित कार्य",
  "recent_activities": "हाल की गतिविधियाँ",
  "see_all": "सभी देखें",

  "create_listing": "लिस्टिंग बनाएं",
  "buy_inputs": "इनपुट खरीदें",
  "my_profile": "मेरी प्रोफ़ाइल",
  "documents": "दस्तावेज़",
  "my_farm": "मेरा खेत",
  "my_crop": "मेरी फसल",
  "crop_doctor": "फसल डॉक्टर",
  "chatbot": "AI सहायक",


//Documents

  "documents": "दस्तावेज़",
  "manage_documents": "अपने कृषि दस्तावेज़ प्रबंधित करें",
  "soil_health_card": "मिट्टी स्वास्थ्य कार्ड",
  "soil_health_desc": "बेहतर सुझावों के लिए अपना मिट्टी कार्ड अपलोड करें",
  "lab_reports": "प्रयोगशाला रिपोर्ट",
  "lab_reports_desc": "फसल गुणवत्ता और मिट्टी परीक्षण रिपोर्ट",
  "gov_documents": "सरकारी योजना दस्तावेज़",
  "gov_documents_desc": "पीएम-किसान और योजना प्रमाण पत्र",
  "upload_document": "दस्तावेज़ अपलोड करें",
  "reupload": "फिर से अपलोड करें",
  "view": "देखें",
  "why_upload": "दस्तावेज़ क्यों अपलोड करें?",
  "why_upload_desc": "दस्तावेज़ आपके प्रोफाइल को सत्यापित करने में मदद करते हैं।",


  
  "marketplace": "मार्केटप्लेस",
  "marketplace_details": {
    "title": "मार्केटप्लेस",
    "subtitle": "खेती के लिए उच्च गुणवत्ता के इनपुट खरीदें",
    "search": "उत्पाद खोजें...",
    "add_to_cart": "कार्ट में जोड़ें",

    "categories": ["All", "Seeds", "Fertilizers", "Tools", "Pesticides"],

    "category": {
      "all": "सभी",
      "seeds": "बीज",
      "fertilizers": "उर्वरक",
      "tools": "औज़ार",
      "pesticides": "कीटनाशक"
    }
  },

  "bank_details": "बैंक विवरण",
  "documents": "दस्तावेज़",
  "logout": "लॉगआउट",
  "edit": "संपादित करें",
  "delete": "हटाएं",

  "listing": {
    "my_listings": "मेरी लिस्टिंग",
    "total": "कुल {{count}} लिस्टिंग",
    "status": {
      "approved": "स्वीकृत",
      "pending": "लंबित",
      "sold": "बिक गया"
    }
  },
  "common": {
    "edit": "संपादित करें",
    "delete": "हटाएं",
    "amount": "राशि",
    "date": "तारीख",
    "save": "सेव करें",
    "cancel": "रद्द करें"
  },


  "create_listing": {
    "title": "लिस्टिंग बनाएं",
    "crop_info": "फसल की जानकारी",
    "crop_name": "फसल का नाम",
    "variety": "किस्म",
    "quantity": "मात्रा (किलो)",
    "price": "कीमत (₹/किलो)",
    "location": "स्थान",
    "enter_location": "स्थान दर्ज करें",
    "use_location": "वर्तमान स्थान उपयोग करें",
    "upload_images": "चित्र अपलोड करें",
    "add": "जोड़ें",
    "submit": "लिस्टिंग सबमिट करें",
    "fill_required": "कृपया सभी आवश्यक फ़ील्ड भरें",
    "submitted": "लिस्टिंग सफलतापूर्वक सबमिट हुई"
},


  "profile": {
    "role_farmer": "किसान",
    "edit_profile": "प्रोफ़ाइल संपादित करें",
    "logout": "लॉगआउट",
    "menu": {
      "personal_details": "व्यक्तिगत विवरण",
      "address_details": "पता विवरण",
      "farmer_category": "किसान श्रेणी",
      "crops_grown": "उगाई गई फसलें",
      "land_details": "भूमि विवरण",
      "bank_details": "बैंक विवरण",
      "uploaded_documents": "अपलोड किए गए दस्तावेज़",
      "help_support": "मदद और सहायता"
    }
  },

"tabs": {
    "home": "होम",
    "marketplace": "मार्केट",
    "listings": "मेरी लिस्टिंग",
    "profile": "प्रोफ़ाइल"
  },

  "farmer_tabs": {
    "home": "होम",
    "marketplace": "मार्केट",
    "listings": "मेरी लिस्टिंग",
    "profile": "मेरी प्रोफ़ाइल"
  },

   "fpo_dashboard": "एफपीओ डैशबोर्ड",
  "manage_farmers": "किसानों और संचालन का प्रबंधन करें",

  "total_farmers": "कुल किसान",
  "active_fields": "सक्रिय खेत",
  "pending_payments": "लंबित भुगतान",

  "quick_actions": "त्वरित कार्य",
  "crop_statistics": "फसल आँकड़े",

  "add_farmer": "किसान जोड़ें",
  "order_details": "ऑर्डर विवरण",
  "farmer_listing": "किसान लिस्टिंग",
  "ledger": "लेजर",

  "wheat": "गेहूं",
  "rice": "चावल",
  "cotton": "कपास",
  "others": "अन्य",


  //ladger

  "ledger": "लेजर",
  "ledger_date": "{{date}}",

  "pending_payments": "लंबित भुगतान",
  "completed_today": "आज पूर्ण हुए",
  "paid_this_month": "इस माह का कुल भुगतान",

  "download_ledger": "लेजर डाउनलोड करें",
  "urgent": "तत्काल",
  "due": "देय",
  "today": "आज",
  "mark_paid": "भुगतान चिह्नित करें",

  
  "farmer_management": "किसान प्रबंधन",
  "farmer_management_sub": "रिकॉर्ड और सत्यापन",
  "search_farmers": "किसान खोजें...",

  "filter": {
    "all": "सभी",
    "verified": "सत्यापित",
    "pending": "लंबित"
  },

  "status": {
    "verified": "सत्यापित",
    "pending": "लंबित"
  },

  "fields": "खेत",
  "view_details": "विवरण देखें",

// Invetory

 "inventory": {
    "title": "इन्वेंटरी और इनपुट",
    "add_product": "उत्पाद जोड़ें",
    "brand": "ब्रांड",
    "mrp": "एमआरपी",
    "update": "अपडेट करें",
    "status": {
      "in": "उपलब्ध",
      "low": "कम स्टॉक"
    }
  },

"profile": {
    "edit": "प्रोफ़ाइल संपादित करें",
    "account_details": "खाता विवरण",
    "account": {
      "phone": "फ़ोन",
      "email": "ईमेल",
      "location": "स्थान"
    },
    "features": {
      "field_crop_mapping": {
        "title": "खेत और फसल मानचित्रण",
        "sub": "भूमि और फसल विवरण"
      },
      "schemes_subsidies": {
        "title": "योजनाएं और सब्सिडी",
        "sub": "सरकारी कार्यक्रम"
      }
    },
    "settings": {
      "notifications": "सूचनाएं",
      "language": "भाषा",
      "privacy": "गोपनीयता और सुरक्षा",
      "help": "सहायता",
      "logout": "लॉगआउट"
    },
    "app_name": "कृषि ज्ञान एफपीओ ऐप"
  },
  "roles": {
    "fpo": "एफपीओ"
  },

// field mappoing 

"field_mapping": {
    "title": "खेत और फसल मानचित्रण",
    "subtitle": "भूमि और फसल का विवरण",
    "area": "क्षेत्रफल",
    "crop": "फसल",
    "status": "स्थिति",
    "status_growing": "उग रही है",
    "status_harvesting": "कटाई चल रही है"
  },

  "schemes": {
    "title": "योजनाएँ और सब्सिडी",
    "subtitle": "सरकारी कार्यक्रम",
    "enrolled": "नामांकित किसान",
    "amount": "सब्सिडी राशि"
  },

  // FPO Tabs
   "tabs": {
    "home": "होम",
    "farmers": "किसान",
    "inventory": "स्टॉक",
    "profile": "प्रोफ़ाइल"
  },

  // employee tabs

   "tabs": {
    "home": "होम",
    "farmers": "किसान",
    "buy": "खरीदें",
    "stock": "स्टॉक",
    "profile": "प्रोफ़ाइल"
  },

  // employee home page 

  
  "home": {
    "title": "आज का डैशबोर्ड",
    "subtitle": "खरीद स्टाफ पोर्टल",
    "add_listing": "लिस्टिंग जोड़ें",
    "recent_procurements": "हाल की खरीद"
  },
  "stats": {
    "today_procurements": "आज की खरीद",
    "pending_quality": "लंबित गुणवत्ता जांच",
    "pending_payments": "लंबित भुगतान"
  },
  "common": {
    "amount": "राशि",
    "date": "तारीख"
  },
  "status": {
    "completed": "पूर्ण"
  },


  "purchase": {
    "title": "खरीद रिकॉर्ड",
    "add": "खरीद जोड़ें"
  },
  "filters": {
    "all": "सभी",
    "completed": "पूर्ण",
    "pending": "लंबित",
    "quality": "गुणवत्ता जांच"
  },
  "status": {
    "completed": "पूर्ण",
    "pending": "लंबित",
    "quality": "गुणवत्ता जांच"
  },
  "common": {
    "amount": "राशि",
    "date": "तारीख"
  },

"stock": {
    "title": "स्टॉक प्रबंधन",
    "add_product": "उत्पाद जोड़ें",
    "brand": "ब्रांड",
    "mrp": "एमआरपी",
    "in_stock": "स्टॉक में",
    "expiry": "समाप्ति तिथि",
    "summary": {
      "low_stock": "कम स्टॉक",
      "total_products": "कुल उत्पाद",
      "near_expiry": "समाप्ति के पास",
      "out_of_stock": "स्टॉक समाप्त"
    },
    "status": {
      "in_stock": "स्टॉक में",
      "low_stock": "कम स्टॉक",
      "out_stock": "स्टॉक समाप्त"
    }
  },
  "common": {
    "update": "अपडेट"
  },
   "farmers": {
    "title": "किसान",
    "search": "किसान खोजें...",
    "verified": "सत्यापित",
    "fields": "खेत"
  },

  
  "profile": {
     "title": "प्रोफ़ाइल",
      "procurement_staff": "खरीद कर्मचारी",
    "account_details": "खाता विवरण",
    "settings_title": "सेटिंग्स",
    "logout": "लॉगआउट",
    "logout_title": "लॉगआउट",
    "logout_confirm": "क्या आप वाकई लॉगआउट करना चाहते हैं?",
    "account": {
      "phone": "फ़ोन नंबर",
      "email": "ईमेल पता",
      "location": "स्थान"
    },
    "roles": {
    "procurement_staff": "खरीद कर्मचारी"
  },
    "settings": {
      "notifications": "सूचनाएं",
      "language": "भाषा",
      "privacy": "गोपनीयता और सुरक्षा",
      "help": "मदद"
    }
  },
  "common": {
    "cancel": "रद्द करें"
  },


  "add_product": {
    "title": "उत्पाद जोड़ें",
    "product_name": "उत्पाद का नाम",
    "product_name_placeholder": "जैसे: ऑर्गेनिक गेहूं का आटा",
     "description": "विवरण",
    "description_placeholder": "उत्पाद का विवरण दर्ज करें",
    "brand": "ब्रांड / स्रोत",
    "select_source": "स्रोत चुनें",
    "mrp": "एमआरपी",
    "mrp_placeholder": "₹ 0.00",
    "quantity": "मात्रा",
    "unit": "इकाई",
    "select": "चुनें",
    "purchase_date": "खरीद की तारीख",
    "expiry_date": "समाप्ति तिथि",
    "date_placeholder": "दिन/माह/वर्ष",
    "save": "उत्पाद सहेजें"
  },


  "back": "वापस",
  "back_to_login": "लॉगिन पर वापस जाएँ",

  "error": "त्रुटि",
  "success": "सफलता",
  "info": "जानकारी",
  "ok": "ठीक है",
  "fill_required_fields": "कृपया सभी आवश्यक जानकारी भरें",

  "first_name": "पहला नाम",
  "last_name": "अंतिम नाम",
  "email": "ईमेल",
  "phone_number": "मोबाइल नंबर",
  "password": "पासवर्ड",
  "enter_first_name": "पहला नाम दर्ज करें",
  "enter_last_name": "अंतिम नाम दर्ज करें",
  "enter_email": "ईमेल दर्ज करें",
  "enter_phone": "मोबाइल नंबर दर्ज करें",
  "enter_password": "पासवर्ड दर्ज करें",

  "gender": "लिंग",
  "male": "पुरुष",
  "female": "महिला",
  "select_gender": "लिंग चुनें",

  "state": "राज्य",
  "district": "जिला",
  "village": "गाँव",
  "select_state": "राज्य चुनें",
  "select_district": "जिला चुनें",
  "select_village": "गाँव चुनें",

  "gst_number": "जीएसटी नंबर",
  "enter_gst": "जीएसटी नंबर दर्ज करें",

  "shop_name": "एफपीओ / दुकान का नाम",

  "register": "रजिस्टर करें",
  "update_profile": "प्रोफ़ाइल अपडेट करें",
  "update_profile_sub": "अपनी व्यक्तिगत जानकारी अपडेट करें",
  "profile_updated": "प्रोफ़ाइल सफलतापूर्वक अपडेट हुई",

  "fpo_registration": "एफपीओ पंजीकरण",
  "fpo_registration_sub": "अपना एफपीओ खाता बनाएँ",

  "add_product": {
    "title": "उत्पाद जोड़ें",
    "product_name": "उत्पाद का नाम",
    "product_name_placeholder": "उत्पाद का नाम दर्ज करें",
    "description": "विवरण",
    "description_placeholder": "उत्पाद का विवरण दर्ज करें",
    "brand": "ब्रांड",
    "select_source": "ब्रांड दर्ज करें",
    "mrp": "एमआरपी",
    "mrp_placeholder": "एमआरपी दर्ज करें",
    "quantity": "मात्रा",
    "unit": "इकाई",
    "select": "चुनें",
    "purchase_date": "खरीद तिथि",
    "expiry_date": "समाप्ति तिथि",
    "date_placeholder": "DD/MM/YYYY",
    "save": "सेव करें"
  },

  "profile": {
    "edit": "प्रोफ़ाइल संपादित करें",
    "account_details": "खाता विवरण",
    "app_name": "कृषियन ऐप",

    "account": {
      "phone": "मोबाइल",
      "email": "ईमेल",
      "location": "स्थान"
    },

    "features": {
      "field_crop_mapping": {
        "title": "खेत फसल मानचित्रण",
        "sub": "अपने खेत का मानचित्र प्रबंधित करें"
      },
      "schemes_subsidies": {
        "title": "योजनाएँ और सब्सिडी",
        "sub": "उपलब्ध योजनाएँ देखें"
      }
    },

    "settings": {
      "notifications": "सूचनाएँ",
      "language": "भाषा",
      "privacy": "गोपनीयता नीति",
      "help": "मदद और समर्थन",
      "logout": "लॉगआउट"
    }
  },

  "roles": {
    "fpo": "एफपीओ",
    "employee": "कर्मचारी"
  },

  "states": [
    "महाराष्ट्र",
    "गुजरात",
    "मध्य प्रदेश",
    "आंध्र प्रदेश"
  ],

  "districts": [
    "पुणे",
    "नागपुर",
    "नाशिक"
  ],

  "villages": [
    "गाँव A",
    "गाँव B",
    "गाँव C"
  ],

  "purchase": {
    "title": "खरीद रिकॉर्ड",
    "add": "खरीद जोड़ें",
    "add_title": "खरीद प्रविष्टि जोड़ें",
    "add_subtitle": "नई खरीद दर्ज करें",
    "farmer": "किसान चुनें",
    "choose_farmer": "किसान चुनें",
    "crop": "फसल चुनें",
    "choose_crop": "फसल चुनें",
    "rate": "प्रति किलो दर (₹)",
    "quantity": "मात्रा (किलो)",
    "date": "खरीद तिथि",
    "center": "खरीद केंद्र",
    "godown": "गोदाम",
    "vehicle": "वाहन",
    "remarks": "टिप्पणी"
  }
    },
  },
};
