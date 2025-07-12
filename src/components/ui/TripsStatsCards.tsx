import { Card, CardContent } from "@/components/ui/card";
import { MapPin, CalendarDays } from "lucide-react";

interface TripStatsCardsProps {
  oneDayCount: number;
  multiDayCount: number;
}

export default function TripStatsCards({ oneDayCount, multiDayCount }: TripStatsCardsProps) {
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
