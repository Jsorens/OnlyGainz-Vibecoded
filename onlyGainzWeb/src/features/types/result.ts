// types/result.ts
export type Result<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: { code: string; message: string };
    };
