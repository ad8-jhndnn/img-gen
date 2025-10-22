const express = require('express');
const Jimp = require('jimp');

const app = express();
const PORT = process.env.PORT || 3001;

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random color image with optional shapes/text
async function generateRandomImage() {
	const width = 800;
	const height = 600;

	const image = await new Jimp(width, height, Jimp.rgbaToInt(
		randomInt(0, 255),
		randomInt(0, 255),
		randomInt(0, 255),
		255
	));

	// Add some random rectangles
	const rectCount = randomInt(3, 8);
	for (let i = 0; i < rectCount; i++) {
		const w = randomInt(50, 300);
		const h = randomInt(30, 200);
		const x = randomInt(0, width - w);
		const y = randomInt(0, height - h);
		const color = Jimp.rgbaToInt(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255), 180);
		const rect = new Jimp(w, h, color);
		image.composite(rect, x, y, {
			mode: Jimp.BLEND_SOURCE_OVER,
			opacitySource: 0.7,
		});
	}

	// Optionally add some circles using scan
	const circleCount = randomInt(2, 6);
	for (let i = 0; i < circleCount; i++) {
		const cx = randomInt(0, width);
		const cy = randomInt(0, height);
		const r = randomInt(20, 120);
		const color = { r: randomInt(0, 255), g: randomInt(0, 255), b: randomInt(0, 255), a: 200 };
		for (let y = Math.max(0, cy - r); y < Math.min(height, cy + r); y++) {
			for (let x = Math.max(0, cx - r); x < Math.min(width, cx + r); x++) {
				const dx = x - cx;
				const dy = y - cy;
				if (dx * dx + dy * dy <= r * r) {
					const idxColor = Jimp.rgbaToInt(color.r, color.g, color.b, color.a);
					image.setPixelColor(idxColor, x, y);
				}
			}
		}
	}

	// Add a short random label
	const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
	const label = `img-${Date.now().toString(36)}-${randomInt(0, 9999)}`;
	image.print(font, 10, 10, label);

	return image;
}

app.get('/', async (req, res) => {
	try {
		const image = await generateRandomImage();
		const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
		res.set('Content-Type', 'image/png');
		res.set('Cache-Control', 'no-store');
		res.send(buffer);
	} catch (err) {
		console.error('Image generation failed', err);
		res.status(500).send('Image generation failed');
	}
});

app.listen(PORT, () => {
	console.log(`Random image server listening on http://localhost:${PORT}`);
});

module.exports = app;
