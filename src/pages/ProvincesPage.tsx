import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Sidebar } from '@/components/Sidebar';
import { Trip } from '@/types/Trip';
import { ProgressLogic } from '@/components/ui/ProgressLogic';

const GET_PROVINCES = gql`
  query GetProvinces {
    provinces {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const ProvincesPage: React.FC = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data, loading, error } = useQuery(GET_PROVINCES);
  const [activeView, setActiveView] = useState<'trips' | 'add-trip'>('trips');
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

<div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <DashboardHeader 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        

      <h1 className="text-3xl font-bold mb-4 text-center">Available Provinces</h1>
      {loading && (
        <div className="flex items-center m-auto w-56 justify-center min-h-screen">
    <ProgressLogic />
  </div>
)}

      {error && (
        <div className="flex justify-center items-center text-red-500">
          <AlertTriangle className="mr-2" /> Error loading provinces
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data?.provinces?.edges.map(({ node }: any) => (
          <Card key={node.id} className="rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">{node.name}</h2>
              <p className="text-sm text-gray-500">{node.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </>
  );
};

export default ProvincesPage;
