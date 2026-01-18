import { Hono } from "hono";
import { supabase } from "./supabase";

const app = new Hono();

app.get("/test", async (c) => {
    const { data, error } = await supabase.from("lessons").select("*");

    return c.json({ data, error });
})

export default app;