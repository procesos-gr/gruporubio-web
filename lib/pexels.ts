const API_KEY = process.env.PEXELS_API_KEY!;

interface PexelsPhoto {
  id: number;
  src: {
    large2x: string;
    large: string;
    medium: string;
  };
  alt: string;
  photographer: string;
}

export async function fetchPexelsImage(query: string): Promise<PexelsPhoto | null> {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      {
        headers: { Authorization: API_KEY },
        next: { revalidate: 86400 * 30 }, // cache 30 days
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.photos?.length) return null;
    return data.photos[0] as PexelsPhoto;
  } catch {
    return null;
  }
}
