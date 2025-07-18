import { useQuery, gql } from "@apollo/client";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, CalendarDays } from "lucide-react";
import React from "react";
import { GET_TRIPS } from "@/graphql/queries/queries";



interface TripStatsCardsProps {
  // Optional: accept filters for query
  country?: string;
  groupSize?: string;
  groupSizeRange?: string;
  tags?: string[];
  duration?: string;
  tripType?: string;
  subType?: string;
  price?: string;
  priceLte?: string;
  priceGte?: string;
  fromDate?: string; // or Date
  toDate?: string; // or Date
  orderBy?: string;
  lengthType?: string; // TripLengthTypeEnum
}

export default function TripStatsCards(props: TripStatsCardsProps) {
  const { data, loading, error } = useQuery(GET_TRIPS, {
    variables: { ...props },
  });

  if (loading) {
    return <p>Loading trip stats...</p>;
  }
  if (error) {
    return <p>Error loading trips: {error.message}</p>;
  }

  // Count trips by __typename
  const trips = data?.trips?.edges || [];
  const oneDayCount = trips.filter(
    ({ node }: any) => node.__typename === "OneDayTripNode"
  ).length;
  const multiDayCount = trips.filter(
    ({ node }: any) => node.__typename === "MultiDayTripNode"
  ).length;

  return (
    <div className="flex flex-row justify-center gap-6 mt-8">
      <Card className="bg-white shadow rounded-2xl p-4 w-60 flex items-center gap-4">
        <MapPin className="w-8 h-8 text-blue-600" />
        <CardContent className="p-0">
          <p className="text-sm text-gray-500">One-Day Trips</p>
          <p className="text-2xl font-bold text-gray-800">{oneDayCount}</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow rounded-2xl p-4 w-60 flex items-center gap-4">
        <CalendarDays className="w-8 h-8 text-green-600" />
        <CardContent className="p-0">
          <p className="text-sm text-gray-500">Multi-Day Trips</p>
          <p className="text-2xl font-bold text-gray-800">{multiDayCount}</p>
        </CardContent>
      </Card>
    </div>
  );
}
