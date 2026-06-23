/**
 * Create or update admin user via Supabase Auth Admin API
 * Usage: node scripts/create-admin.mjs admin@example.com YourPassword123
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

let userId;

const { data: existing } = await supabase.auth.admin.listUsers();
const found = existing?.users?.find((u) => u.email === email);

if (found) {
  const { data, error } = await supabase.auth.admin.updateUserById(found.id, {
    password,
    email_confirm: true,
    user_metadata: { full_name: "Super Admin" },
  });
  if (error) {
    console.error("❌ Failed to update user:", error.message);
    process.exit(1);
  }
  userId = data.user.id;
  console.log("ℹ️  User already existed — password & metadata updated.");
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Super Admin" },
  });
  if (error) {
    console.error("❌ Failed to create user:", error.message);
    process.exit(1);
  }
  userId = data.user.id;
}

const { error: profileError } = await supabase
  .from("profiles")
  .update({
    role: "super_admin",
    full_name: "Super Admin",
    kyc_status: "approved",
  })
  .eq("id", userId);

if (profileError) {
  console.error("❌ Profile update failed:", profileError.message);
  process.exit(1);
}

console.log("✅ Admin user ready!");
console.log("   Email:", email);
console.log("   Password:", password);
console.log("   User ID:", userId);
console.log("   Role: super_admin");
console.log("\nLogin: http://localhost:3000/login");
console.log("Admin: http://localhost:3000/admin");
