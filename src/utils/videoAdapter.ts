// Tipos del backend
interface BackendVideo {
  id: string;
  title: string;
  description: string;
  cloudinaryUrl: string;
  thumbnailUrl: string | null;
  duration: number | null;
  viewsCount: number;
  likesCount: number;
  favoritesCount: number;
  sharesCount: number;
  clicksToOrder: number;
  category: string;
  dish: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
  };
  restaurant: {
    id: string;
    name: string;
    description: string;
    address: string;
    phone: string;
    rating: number;
  };
  deliveryLinks: {
    uberEats?: string;
    didiFood?: string;
    rappi?: string;
  } | null;
  isLiked?: boolean;
  isFavorited?: boolean;
}

// Tipos del frontend
interface FrontendVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  dish: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    restaurant: {
      id: string;
      name: string;
      address: string;
      rating: number;
    };
  };
  platformLinks: Array<{
    platform: 'UBER_EATS' | 'DIDI_FOOD' | 'RAPPI';
    url: string;
  }>;
  isLiked?: boolean;
  isFavorited?: boolean;
}

/**
 * Adapta un video del formato backend al formato frontend
 */
export function adaptVideo(backendVideo: BackendVideo): FrontendVideo {
  // Convertir deliveryLinks a platformLinks
  const platformLinks: Array<{
    platform: 'UBER_EATS' | 'DIDI_FOOD' | 'RAPPI';
    url: string;
  }> = [];

  if (backendVideo.deliveryLinks) {
    if (backendVideo.deliveryLinks.uberEats) {
      platformLinks.push({
        platform: 'UBER_EATS',
        url: backendVideo.deliveryLinks.uberEats,
      });
    }
    if (backendVideo.deliveryLinks.didiFood) {
      platformLinks.push({
        platform: 'DIDI_FOOD',
        url: backendVideo.deliveryLinks.didiFood,
      });
    }
    if (backendVideo.deliveryLinks.rappi) {
      platformLinks.push({
        platform: 'RAPPI',
        url: backendVideo.deliveryLinks.rappi,
      });
    }
  }

  return {
    id: backendVideo.id,
    title: backendVideo.title,
    description: backendVideo.description,
    videoUrl: backendVideo.cloudinaryUrl,
    thumbnailUrl: backendVideo.thumbnailUrl || '',
    duration: backendVideo.duration || 0,
    viewCount: backendVideo.viewsCount,
    likeCount: backendVideo.likesCount,
    shareCount: backendVideo.sharesCount,
    dish: {
      id: backendVideo.dish.id,
      name: backendVideo.dish.name,
      description: backendVideo.dish.description,
      price: backendVideo.dish.price,
      category: backendVideo.dish.category,
      restaurant: {
        id: backendVideo.restaurant.id,
        name: backendVideo.restaurant.name,
        address: backendVideo.restaurant.address,
        rating: backendVideo.restaurant.rating,
      },
    },
    platformLinks,
    isLiked: backendVideo.isLiked || false,
    isFavorited: backendVideo.isFavorited || false,
  };
}

/**
 * Adapta un array de videos
 */
export function adaptVideos(backendVideos: BackendVideo[]): FrontendVideo[] {
  return backendVideos.map(adaptVideo);
}