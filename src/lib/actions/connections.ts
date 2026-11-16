"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminSession";
import { revokeFamily } from "@/lib/mcp/oauth";
import { restoreRevision } from "@/lib/mcp/write";

export async function disconnectAssistant(familyId: string) {
  await requireAdmin();
  await revokeFamily(familyId);
  revalidatePath("/dashboard/connections");
}

/** Undo one change an AI assistant made (puts the record back to its "before" version). */
export async function undoAiChange(revisionId: string) {
  await requireAdmin();
  await restoreRevision({ tool: "dashboard_undo", clientName: "Dashboard" }, revisionId, "before");
  revalidatePath("/", "layout");
}
