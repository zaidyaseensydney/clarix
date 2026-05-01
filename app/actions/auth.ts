"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AustralianState, Subject } from "@/lib/types";

export async function loginAction(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: "Invalid email or password. Please try again." };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication failed." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  redirect(profile?.role === "parent" ? "/parent" : "/dashboard");
}

export async function signupAction(formData: FormData) {
  const supabase = await createClient();

  const role = formData.get("role") as "student" | "parent";
  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  const userId = authData.user?.id;
  if (!userId) return { error: "Account creation failed. Please try again." };

  // Build profile payload based on role
  const profilePayload: {
    id: string;
    role: "student" | "parent";
    full_name: string;
    year_level?: number;
    state?: string;
    subjects?: string[];
  } = { id: userId, role, full_name: fullName };

  if (role === "student") {
    profilePayload.year_level = Number(formData.get("year_level"));
    profilePayload.state = formData.get("state") as AustralianState;
    const subjectsRaw = formData.get("subjects") as string;
    profilePayload.subjects = subjectsRaw ? (JSON.parse(subjectsRaw) as Subject[]) : [];
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(profilePayload);

  if (profileError) {
    return { error: "Could not save your profile. Please try again." };
  }

  // If parent, save children
  if (role === "parent") {
    const childrenRaw = formData.get("children") as string;
    if (childrenRaw) {
      const children = JSON.parse(childrenRaw) as Array<{
        name: string;
        year_level: number;
        state: string;
      }>;

      if (children.length > 0) {
        const rows = children.map((c) => ({
          parent_id: userId,
          child_name: c.name,
          year_level: c.year_level,
          state: c.state,
        }));

        const { error: childError } = await supabase
          .from("parent_children")
          .insert(rows);

        if (childError) {
          return { error: "Could not save children details. Please try again." };
        }
      }
    }
  }

  redirect(role === "parent" ? "/parent" : "/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function forgotPasswordAction(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password` }
  );

  if (error) {
    return { error: "Could not send reset email. Please check the address and try again." };
  }

  return { success: true };
}
