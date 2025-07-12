export interface Trip {
  id: string;
  title: string;
  description: string;            // corresponds to tripDescription/description
  durationHours: number;
  price: string;                  // price comes as string
  groupSize?: number | null;      // might be null or string
  cardThumbnail?: string | null;  // URL to the thumbnail image
  thumbnail?: string | null;
  tags?: string[];
  offerType?: string;
  provinces?: { id: string; name: string }[];

   destination?: string;
   category?: string;
   maxGuests?: number;
}
