
// ===================================
// WGWLAD - AUTHENTICATION SYSTEM
// ===================================

// 1. SUPABASE CONFIGURATION
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// 2. LOGIN ELEMENTS
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginButton = document.getElementById("loginButton");

// 3. LOGIN FUNCTION
loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginButton.disabled = true;
    loginButton.textContent = "PLEASE WAIT...";
    message.textContent = "";

    try {
        // Authenticate with Supabase
        const { data, error } = await db.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Get user profile
        const { data: profile, error: profileError } = await db
            .from("user_profiles")
            .select("full_name, username, role, is_active")
            .eq("user_id", data.user.id)
            .single();

        if (profileError || !profile) {
            await db.auth.signOut();
            throw new Error("User profile not found.");
        }

        if (!profile.is_active) {
            await db.auth.signOut();
            throw new Error("Your account is inactive.");
        }

        // Save display information only
        sessionStorage.setItem(
            "wgwl_user_name",
            profile.full_name
        );

        // Redirect according to role
        window.location.href = "dashboard.html";

    } catch (error) {
        message.textContent = error.message;
        loginButton.disabled = false;
        loginButton.textContent = "LOGIN";
    }
});

// 4. FORGOT PASSWORD
document.getElementById("forgotPassword")
.addEventListener("click", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (!email) {
        message.textContent = "Please enter your email first.";
        return;
    }

    try {
        const { error } = await db.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + "/reset-password.html"
        });

        if (error) throw error;

        message.textContent =
            "Password reset instructions sent to your email.";

    } catch (error) {
        message.textContent = error.message;
    }
});
