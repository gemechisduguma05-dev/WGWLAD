
// WGWLAD LOGIN SYSTEM

const db = window.db;

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginButton = document.getElementById("loginButton");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginButton.disabled = true;
    loginButton.textContent = "PLEASE WAIT...";
    message.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const { data, error } = await db.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

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

        window.location.href = "dashboard.html";

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "LOGIN";
    }
});

// FORGOT PASSWORD
document.getElementById("forgotPassword")
.addEventListener("click", async (event) => {
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
        message.style.color = "green";

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    }
});
