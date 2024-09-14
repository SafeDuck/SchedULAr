export async function GET(req) {
  try {
    const req = await fetch(
      "https://registrationssb.ucr.edu/StudentRegistrationSsb/ssb/classSearch/getTerms?offset=1&max=10",
      {
        method: "GET",
      },
    );

    const data = await req.json();

    const terms = data.map((term_obj) => term_obj.code);

    return Response.json(terms);
  } catch (e) {
    return new Response(e.message, {
      status: 500,
    });
  }
}
