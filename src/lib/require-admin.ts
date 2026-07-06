import { createSupabaseServerClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Verifies the caller has a valid Supabase session AND is present in the
 * admin_users table. Use this inside any /api/admin/** route handler.
 *
 * Returns the admin user's id on success, or null if unauthorized.
 */
export async function requireAdmin(): Promise<{ id: string; email: string } | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  const [adminRow] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, data.user.id));

  if (!adminRow) {
    return null;
  }

  return { id: data.user.id, email: adminRow.email };
}
