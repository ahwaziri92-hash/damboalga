import { revalidatePath } from "next/cache";
// Called by the admin panel after a save so visitors see changes straight away.
// It only clears the page cache; it cannot change any content.
export async function POST() { revalidatePath("/", "layout"); return Response.json({ ok: true }); }
