import { runSemanticValidation } from "@versaprotocol/semval";

export async function POST(request: Request) {
  const data = await request.json();
  const semval = runSemanticValidation(data);
  return new Response(JSON.stringify(semval), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
