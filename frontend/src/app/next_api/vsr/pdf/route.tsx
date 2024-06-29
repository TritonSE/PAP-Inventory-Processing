import { FurnitureItem, getFurnitureItems } from "@/api/FurnitureItems";
import { VSR, getVSR } from "@/api/VSRs";
import { VSRPDF } from "@/components/VSRPDF";

import ReactPDF from "@react-pdf/renderer";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const firebaseToken = req.headers.get("Authorization")?.split("Bearer ")[1];
  const vsrId = req.nextUrl.searchParams.get("id");

  if (!firebaseToken) {
    return NextResponse.json("error: Missing Firebase token", {
      status: 400,
    });
  }

  if (!vsrId) {
    return NextResponse.json("error: Missing VSR ID", {
      status: 400,
    });
  }

  const vsrResponse = await getVSR(vsrId!, firebaseToken);
  if (!vsrResponse.success) {
    return NextResponse.json("error: " + vsrResponse.error, {
      status: 400,
    });
  }

  const furnitureItemsResponse = await getFurnitureItems();

  if (!furnitureItemsResponse.success) {
    return NextResponse.json("error: " + furnitureItemsResponse.error, {
      status: 400,
    });
  }

  // Render our React component to a stream we can send as an HTTP response
  const pdfBuffer = await ReactPDF.renderToStream(
    <VSRPDF
      vsr={vsrResponse.data as VSR}
      furnitureItems={furnitureItemsResponse.data as FurnitureItem[]}
    />,
  );

  // TypeScript doesn't think these types match, but it works so we disable the lint error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = new NextResponse(pdfBuffer as any as BodyInit, {
    headers: {
      "Content-Disposition": 'attachment; filename="vsr.pdf"',
      "Content-Type": "application/pdf",
    },
  });
  return response;
}
