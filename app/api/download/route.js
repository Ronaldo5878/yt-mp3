import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";

const execPromise = util.promisify(exec);

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const videoUrl = searchParams.get("video");

        if (!videoUrl) {
            return NextResponse.json({ error: "Missing video URL" }, { status: 400 });
        }

        // Define output directory and filename
        const outputDir = path.join(process.cwd(), "public", "downloads");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, "%(title)s.%(ext)s");
        const command = `yt-dlp -x --audio-format mp3 -o "${outputPath}" ${videoUrl}`;

        console.log("Downloading & Converting:", videoUrl);
        await execPromise(command);

        // Find the downloaded file
        const files = fs.readdirSync(outputDir);
        const mp3File = files.find(file => file.endsWith(".mp3"));

        if (!mp3File) {
            return NextResponse.json({ error: "Failed to convert video to MP3" }, { status: 500 });
        }

        const downloadUrl = `/downloads/${mp3File}`;
        console.log("✅ MP3 Ready:", downloadUrl);

        // Fix: Use an absolute URL
        const absoluteUrl = new URL(downloadUrl, req.url);
        return NextResponse.redirect(absoluteUrl);

    } catch (err) {
        console.error("❌ Download API Error:", err);
        return NextResponse.json({ error: "Something went wrong", details: err.message }, { status: 500 });
    }
}
