// src/lib/poster.ts
import QRCode from "qrcode";

type PosterOpts = {
    referralCode: string;
    posterUrl?: string;         // defaults to /countdown_base.png
    qrSize?: number;            // px
    qrX?: number;               // px from left
    qrY?: number;               // px from top
    fileName?: string;
};

export async function buildAndDownloadPoster({
    referralCode,
    posterUrl = "/countdown_base.png",
    qrSize = 420,
    // Tune these to match your design. These are good starting points for a 1080x1920 poster:
    qrX = 84,
    qrY = 1420,
    fileName = `countdown-invite-${referralCode}.png`,
}: PosterOpts) {
    // 1) load base poster
    const baseImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = posterUrl; // must be same-origin (public/)
    });

    // 2) make main canvas
    const canvas = document.createElement("canvas");
    canvas.width = baseImg.naturalWidth;
    canvas.height = baseImg.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(baseImg, 0, 0);

    // 3) make QR canvas
    const inviteUrl = `${window.location.origin}?ref=${encodeURIComponent(referralCode)}`;
    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, inviteUrl, {
        width: Math.max(128, qrSize),
        margin: 0,
        color: {
            // White QR on dark poster looks sharp; change if you want cyan-on-black
            dark: "#000000",
            light: "#ffffff",
        },
    });

    // Optional: add a subtle backdrop for contrast
    // ctx.fillStyle = "rgba(0,0,0,0.25)";
    // ctx.fillRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 24);

    // 4) draw QR onto poster
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // 5) download
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
