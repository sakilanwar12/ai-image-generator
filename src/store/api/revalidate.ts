"use server";

import { revalidateTag } from "next/cache";

export async function revalidateApiTag(tag: string) {
  // @ts-expect-error revalidateTag definition might vary in lint config
  revalidateTag(tag);
}
