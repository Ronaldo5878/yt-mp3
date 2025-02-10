import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";
import path from "path";
import fs from "fs";

const execPromise = util.promisify(exec);

export async function POST(req) {
    try {
        const { videoUrl, quality } = await req.json();
        if (!videoUrl) return NextResponse.json({ error: "Invalid URL" }, { status: 400 });

        console.log("Fetching video info for:", videoUrl);

        // Determine audio quality
        let qualityOption;
        if (quality === "low") {
            qualityOption = "64K";
        } else if (quality === "medium") {
            qualityOption = "128K";
        } else {
            qualityOption = "192K"; // Default to high quality
        }

        // Output file path
        const filename = `${Date.now()}.mp3`;
        const outputPath = path.join(process.cwd(), "public", "downloads", filename);

        // yt-dlp command to extract audio
        const command = `yt-dlp -f "bestaudio[ext=m4a]" --audio-quality ${qualityOption} --extract-audio --audio-format mp3 -o "${outputPath}" ${videoUrl}`;
        console.log("Running command:", command);

        // Execute the command
        const { stderr } = await execPromise(command);

        if (stderr) {
            console.error("❌ yt-dlp Error:", stderr);
            return NextResponse.json({ error: "Conversion failed", details: stderr }, { status: 500 });
        }

        console.log("✅ MP3 Ready:", outputPath);

        return NextResponse.json({
            message: "Success",
            videoTitle: filename,
            downloadUrl: `/downloads/${filename}`,
        });

    } catch (error) {
        console.error("❌ API Error:", error);
        return NextResponse.json({ error: "Something went wrong", details: error.message }, { status: 500 });
    }
}
