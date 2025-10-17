import { useEffect, useState } from "react";

export function useCartImages(items) {
  const [images, setImages] = useState({});
  useEffect(() => {
    async function fetchImages() {
      const newImages = {};
      for (const item of items) {
        if (!images[item.slug]) {
          try {
            const res = await fetch(
              `https://atelie-juliabrandao-backend-production.up.railway.app/api/babies/slug/${item.slug}`,
              { credentials: 'include' }
            );
            if (res.ok) {
              const data = await res.json();
              const validImg =
                Array.isArray(data.images) &&
                typeof data.images[0] === "string" &&
                data.images[0].startsWith("http")
                  ? data.images[0]
                  : "";
              newImages[item.slug] = validImg;
            } else {
              newImages[item.slug] = "";
            }
          } catch {
            newImages[item.slug] = "";
          }
        }
      }
      if (Object.keys(newImages).length) {
        setImages(prev => ({ ...prev, ...newImages }));
      }
    }
    if (items.length) fetchImages();
    // eslint-disable-next-line
  }, [items]);
  return images;
}