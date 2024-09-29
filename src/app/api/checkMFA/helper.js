import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function checkMFA() {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    const { users = []} = data;

    if(error) {
        console.log("error:",error)
        return error
    }

    console.log("users:",users)

    const userStatus = users.map(user => ({
        email: user.email,
        mfaEnabled: Boolean(user.factors && user.factors.length > 0) ? "Yes" : "No",
      }));

  return userStatus;
}