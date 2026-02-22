import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

// ===== AUTH FUNCTIONS =====

export const signUp = async (email, password, fullName) => {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) throw authError;

    // Create customer record
    if (authData.user) {
      const { error: customerError } = await supabase.from("customers").insert([
        {
          id: authData.user.id,
          email: email,
          full_name: fullName,
        },
      ]);

      if (customerError)
        console.error("Error creating customer:", customerError);
    }

    return { data: authData, error: null };
  } catch (error) {
    console.error("Signup error:", error);
    return { data: null, error };
  }
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// ===== SERVICES FUNCTIONS =====

export const getServices = async () => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }
  return data || [];
};

export const getServiceBySlug = async (slug) => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching service:", error);
    return null;
  }
  return data;
};

// ===== PRICING FUNCTIONS =====

export const getPricing = async () => {
  const { data, error } = await supabase
    .from("pricing")
    .select("*")
    .eq("is_active", true)
    .order("service_category, tier_name");

  if (error) {
    console.error("Error fetching pricing:", error);
    return [];
  }
  return data || [];
};

export const getPricingByCategory = async (category) => {
  const { data, error } = await supabase
    .from("pricing")
    .select("*")
    .eq("service_category", category)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching pricing:", error);
    return [];
  }
  return data || [];
};

// ===== ORDERS FUNCTIONS =====

export const createOrder = async (orderData) => {
  try {
    // Generate truly unique order number with more randomness
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 100000);
    const orderNumber = `HE${new Date().getFullYear()}${random}${String(timestamp).slice(-6)}`;

    console.log("Creating order with number:", orderNumber);

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          ...orderData,
          order_number: orderNumber,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    console.log("Order created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};

export const getOrderByNumber = async (orderNumber) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }
  return data;
};

export const getOrdersByCustomer = async (customerEmail) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_email", customerEmail)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return data || [];
};

export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return data || [];
};

export const updateOrderStatus = async (orderId, status, notes = null) => {
  const updateData = { status };
  if (notes !== null) updateData.admin_notes = notes;
  if (status === "completed")
    updateData.completed_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Error updating order:", error);
    return null;
  }
  return data;
};

export const uploadHumanizedContent = async (orderId, fileUrl) => {
  const { data, error } = await supabase
    .from("orders")
    .update({
      humanized_file_url: fileUrl,
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Error uploading content:", error);
    return null;
  }
  return data;
};

// ===== TESTIMONIALS FUNCTIONS =====

export const getTestimonials = async () => {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
  return data || [];
};

export const createTestimonial = async (testimonialData) => {
  const { data, error } = await supabase
    .from("testimonials")
    .insert([testimonialData])
    .select()
    .single();

  if (error) {
    console.error("Error creating testimonial:", error);
    return null;
  }
  return data;
};

// ===== FAQ FUNCTIONS =====

export const getFAQs = async () => {
  const { data, error } = await supabase
    .from("faq")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
  return data || [];
};

// ===== FILE UPLOAD FUNCTIONS =====

export const uploadFile = async (file, bucket, path) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) {
    console.error("Error uploading file:", error);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

  return urlData.publicUrl;
};

export const downloadFile = async (bucket, path) => {
  const { data, error } = await supabase.storage.from(bucket).download(path);

  if (error) {
    console.error("Error downloading file:", error);
    return null;
  }
  return data;
};
// ===== NOTIFICATIONS =====

export const createNotification = async (userEmail, type, title, message, link = null) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{ user_email: userEmail, type, title, message, link }]);
  if (error) console.error('Error creating notification:', error);
  return data;
};

export const getNotifications = async (userEmail) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_email', userEmail)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) console.error('Error fetching notifications:', error);
  return data || [];
};

export const markNotificationRead = async (notificationId) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
  if (error) console.error('Error marking notification read:', error);
};

export const markAllNotificationsRead = async (userEmail) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_email', userEmail);
  if (error) console.error('Error marking all notifications read:', error);
};