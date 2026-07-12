export async function getAlbumColors(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Crucial for Spotify CORS
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      try {
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        let r = 0, g = 0, b = 0;
        let count = 0;
        
        // Sample every 100th pixel to be incredibly fast
        for (let i = 0; i < data.length; i += 4 * 100) {
          // Ignore fully transparent pixels
          if (data[i + 3] > 0) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        // Base dominant color
        const primary = `rgb(${r}, ${g}, ${b})`;
        // Lighter accent
        const accent = `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`;
        // Darker secondary
        const secondary = `rgb(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)})`;

        resolve({ primary, secondary, accent });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (err) => reject(err);
  });
}
