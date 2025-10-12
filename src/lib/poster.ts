import QRCode from "qrcode";

/**
 * Tune these once to match your base poster (without QR).
 * These %s are for the sample layout and will likely be close.
 * Adjust live until it lands perfectly in your QR box.
 */
const QR_BOX = {
    xPct: 9.2,    // Left/Right position (% from left edge)
    yPct: 105.0,   // Up/Down position (% from top edge)
    wPct: 20.5,   // Size (% of poster width)
};

type PosterOpts = {
    referralCode: string;
    posterUrl?: string;      // /public path, same-origin
    fileName?: string;
    // optional: override QR_BOX for A/B variants
    xPct?: number;
    yPct?: number;
    wPct?: number;
};

export async function buildAndDownloadPoster({
    referralCode,
    posterUrl = "/countdown_base.png",
    fileName = `countdown-invite-${referralCode}.png`,
    xPct = QR_BOX.xPct,
    yPct = QR_BOX.yPct,
    wPct = QR_BOX.wPct,
}: PosterOpts) {
    // 1) Load base image
    const baseImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = posterUrl; // must be same-origin (put in /public)
    });

    const W = baseImg.naturalWidth;
    const H = baseImg.naturalHeight;

    // Compute QR rect (percent → px)
    const qrW = Math.round((wPct / 100) * W);
    const qrH = qrW;
    const qrX = Math.round((xPct / 100) * W);
    const qrY = Math.round((yPct / 100) * H);

    // 2) Compose on canvas
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(baseImg, 0, 0);

    // Optional contrast plate behind QR (rounded)
    const r = Math.round(qrW * 0.06);
    const pad = Math.round(qrW * 0.08);
    roundRect(ctx, qrX - pad, qrY - pad, qrW + pad * 2, qrH + pad * 2, r);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fill();

    // 3) Generate QR canvas (black on white = most scannable)
    const inviteUrl = `${window.location.origin}?ref=${encodeURIComponent(referralCode)}`;
    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, inviteUrl, {
        width: qrW,
        margin: 0,
        color: { dark: "#000000", light: "#FFFFFF" },
    });

    // 4) Draw QR
    ctx.drawImage(qrCanvas, qrX, qrY, qrW, qrH);

    // 5) Download
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

/** Rounded-rect helper */
function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number
) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}
