
const db = window.db;

const form = document.getElementById("memberForm");
const message = document.getElementById("memberMessage");
const saveButton = document.getElementById("saveMember");

document.getElementById("registration_date").value =
    new Date().toISOString().split("T")[0];

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    saveButton.disabled = true;
    saveButton.textContent = "SAVING...";

    try {
        const { data: { user }, error: authError } =
            await db.auth.getUser();

        if (authError || !user) {
            throw new Error("Please login first.");
        }

        const { data: profile, error: profileError } = await db
            .from("user_profiles")
            .select("role, is_active")
            .eq("user_id", user.id)
            .single();

        if (profileError || !profile || !profile.is_active) {
            throw new Error("Active user profile not found.");
        }

        if (!["super_admin", "church_admin", "secretary"]
            .includes(profile.role)) {
            throw new Error("You do not have permission.");
        }

        const member = {
            first_name: document.getElementById("first_name").value.trim(),
            father_name: document.getElementById("father_name").value.trim(),
            grandfather_name: document.getElementById("grandfather_name").value.trim() || null,
            gender: document.getElementById("gender").value,
            birth_date: document.getElementById("birth_date").value || null,
            phone: document.getElementById("phone").value.trim() || null,
            address: document.getElementById("address").value.trim() || null,
            accepted_christ_date: document.getElementById("accepted_christ_date").value || null,
            baptism_date: document.getElementById("baptism_date").value || null,
            marital_status: document.getElementById("marital_status").value || null,
            number_of_children: Number(document.getElementById("number_of_children").value || 0),
            relationship: document.getElementById("relationship").value || null,
            is_family_head: document.getElementById("is_family_head").checked,
            education_level: document.getElementById("education_level").value || null,
            occupation: document.getElementById("occupation").value.trim() || null,
            emergency_contact_name: document.getElementById("emergency_contact_name").value.trim() || null,
            emergency_contact_phone: document.getElementById("emergency_contact_phone").value.trim() || null,
            department: document.getElementById("department").value.trim() || null,
            registration_date: document.getElementById("registration_date").value,
            membership_status: "Active"
        };

        const { error } = await db.from("members").insert(member);

        if (error) throw error;

        message.textContent = "Member registered successfully!";
        message.style.color = "green";
        form.reset();

        document.getElementById("registration_date").value =
            new Date().toISOString().split("T")[0];

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = "SAVE MEMBER";
    }
});
