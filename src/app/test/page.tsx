import { supabase } from "@/lib/supabase/client";

export default async function TestPage() {
  return (
    <div className="p-10">
      <h1>Supabase Connected</h1>
    </div>
  );
}