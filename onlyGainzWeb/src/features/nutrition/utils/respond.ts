import type { Result } from "../../types/result";

// Gjør et Result om til en HTTP-respons. Statuskoden for feil kommer fra error.code.
export function toResponse<T>(result: Result<T>, successStatus = 200): Response {
  if (result.ok) {
    return Response.json(
      { ok: true, data: result.data },
      { status: successStatus },
    );
  }
  return Response.json(
    { ok: false, error: result.error },
    { status: Number(result.error.code) || 500 },
  );
}
