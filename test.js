const ytDlpExec = require("yt-dlp-exec");

async function fetchVideoInfo(url) {
    try {
        console.log("Fetching video info...");

        const result = await ytDlpExec(url, {
            dumpSingleJson: true,
        });

        console.log("✅ Success:", result.title);
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

fetchVideoInfo("https://www.youtube.com/watch?v=cqpQXZquGNE");
