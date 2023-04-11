import mongoose from "@/lib/database/database"

export async function GET(request: Request) {
  return new Response('Hello, Next.js!, Connected to DB ' + mongoose.connection.db.databaseName)
}
