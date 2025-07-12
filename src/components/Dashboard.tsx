
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TripsList } from './TripsList';
import { TripForm } from './TripForm';
import { DashboardHeader } from './DashboardHeader';
import { Trip } from '../types/Trip';
import wallpaper from "../pictures/Untitled design-3.png"
import TripStatsCards from './ui/TripsStatsCards';
import BlurText from './ui/BlurText';
import { t } from 'i18next';
export const Dashboard = () => {
  const [activeView, setActiveView] = useState<'trips' | '-trip'>('trips');
  const [trips, setTrips] = useState<Trip[]>([
   
  ]);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  const handleAddTrip = (newTrip: Omit<Trip, 'id'>) => {
    const trip: Trip = {
      ...newTrip,
      id: Date.now().toString()
    };
    setTrips([...trips, trip]);
    setActiveView('trips');
  };

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
    };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(trips.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip));
    setEditingTrip(null);
    setActiveView('trips');
  };

  const handleDeleteTrip = (tripId: string) => {
    setTrips(trips.filter(trip => trip.id !== tripId));
  };


  return (
    <>
       <DashboardHeader 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        <div className="ltr:ml-16 ltr:md:ml-64 md:rtl:mr-64 min-h-screen bg-muted/50 py-10 px-6">
      <div className="min-h-screen flex w-full">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ltr:ml-16 mr:mr-16' : 'ltr:ml-64 rtl:mr-64'}`}>
     
      <BlurText
        text={t("WelcomingArrivo")}
        delay={150}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="text-2xl mb-8"
      />

<div className="cards-container rtl:ml-80 ltr:mr-80">
<TripStatsCards oneDayCount={23} multiDayCount={12} />


</div>


        
      
 

     
        
     
      </div>
      
    </div>
    
    </div>
    </>
  
  );
};
