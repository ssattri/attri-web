export async function POST(request: Request) {
  void request;
  return Response.json({ error: "Administrator credentials are managed through ADMIN_EMAIL and ADMIN_PASSWORD in the server environment. Update those values and redeploy." }, { status: 405 });
}
