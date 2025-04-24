import { NextResponse } from "next/server";
import request from "@/utils/http-request";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string; subcategory_id: string }> }
) {
  const params = await props.params;
  const { id, subcategory_id } = params;
  const uri = `api/categories/${id}/subcategories/${subcategory_id}/businesses/`;
  const businesses = await request.get(uri);
  if (businesses) {
    return NextResponse.json(businesses.data);
  } else {
    return NextResponse.json(
      { message: "Businesses not found" },
      { status: 404 }
    );
  }
}
