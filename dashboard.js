
const db = window.db;

async function loadDashboard() {
    const message = document.getElementById("dashboardMessage");

    try {
        const { data: { user }, error } = await db.auth.getUser();

        if (error || !user) {
            window.location.replace("index.html");
            return;
        }

        const { data: profile, error: profileError } = await db
            .from("user_profiles")
            .select("full_name, role, is_active")
            .eq("user_id", user.id)
            .single();

        if (profileError || !profile || !profile.is_active) {
            await db.auth.signOut();
            window.location.replace("index.html");
            return;
        }

        document.getElementById("userName").textContent =
            profile.full_name;

        document.getElementById("userRole").textContent =
            "Role: " + profile.role.replace("_", " ").toUpperCase();

    } catch (error) {
        message.textContent = error.message;
    }
}

document.getElementById("logoutButton").addEventListener("click",
async () => {
    const { error } = await db.auth.signOut();

    if (!error) {
        window.location.replace("index.html");
    }
});

loadDashboard();
