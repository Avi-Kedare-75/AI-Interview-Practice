import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { auth } from "@/auth";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

const pdfWorkerPath = pathToFileURL(
  path.join(process.cwd(), "node_modules", "pdf-parse", "dist", "pdf-parse", "cjs", "pdf.worker.mjs")
).href;

PDFParse.setWorker(pdfWorkerPath);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ success: false, error: "Only PDF files are supported" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    await parser.destroy();

    if (!data || !data.text) {
      return NextResponse.json(
        { success: false, error: "Could not extract text from PDF" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, text: data.text });
  } catch (error) {
    console.error("PDF parsing error:", error);
    const message = error instanceof Error ? error.message : "Failed to parse PDF";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
