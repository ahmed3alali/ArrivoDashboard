import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { ProgressLogic } from "@/components/ui/ProgressLogic";

const GET_TRIP_SUB_TYPES = gql`
  query GetTripSubTypes($first: Int = 10) {
    tripSubTypes(first: $first) {
      edges {
        node {
          id
          type
        }
      }
    }
  }
`;
export default function TripSubTypesPage() {
  const { data, loading, error } = useQuery(GET_TRIP_SUB_TYPES);
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="ltr:ml-16 ltr:md:ml-64 md:rtl:mr-64 min-h-screen bg-muted/50 py-10 px-6">
        {loading && (
          <div className="flex items-center m-auto w-56 justify-center min-h-screen">
            <ProgressLogic />
          </div>
        )}

        {error && (
          <p className="text-red-500">Error loading trip sub-types: {error.message}</p>
        )}

        {!loading && !error && data?.tripSubTypes?.edges?.length > 0 && (
          <>
            <h1 className="text-2xl font-bold mb-4">Trip Sub Types</h1>
            <div className="grid md:grid-cols-2 gap-4">
              {data.tripSubTypes.edges.map(({ node }: any) => (
                <Card key={node.id} className="rounded-2xl shadow-md">
                  <CardContent className="p-4">
                    <p className="font-semibold">{node.type}</p>
                    <p className="text-sm text-gray-600">ID: {node.id}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
