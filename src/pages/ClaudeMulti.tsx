import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const CREATE_MULTI_DAY_TRIP = gql`
  mutation CreateMultiDayTrip(
    $title: String!
    $durationDays: Int!
    $tripDescription: String!
    $provinceIds: [ID]!
    $commonQuestionIds: [ID]!
    $visitLocationHighlightIds: [ID]!
    $contentIds: [ID]!
    $thumbnailsBase64: [String]!
    $placesOfResidenceIds: [ID]!
    $condition: ConditionInput!
    $program: [ProgramInput]!
    $groupSize: String
  ) {
    createMultiDayTrip(
      title: $title
      durationDays: $durationDays
      tripDescription: $tripDescription
      provinceIds: $provinceIds
      commonQuestionIds: $commonQuestionIds
      visitLocationHighlightIds: $visitLocationHighlightIds
      contentIds: $contentIds
      thumbnailsBase64: $thumbnailsBase64
      placesOfResidenceIds: $placesOfResidenceIds
      condition: $condition
      program: $program
      groupSize: $groupSize
    ) {
      multiDayTrip {
        id
        title
        groupSize
      }
    }
  }
`;

export default function MultiTest() {
  const [formData, setFormData] = useState({
    title: "",
    durationDays: 1,
    tripDescription: "",
    groupSize: "",
  });

  const tinyImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wIAAgUBAfGiMyoAAAAASUVORK5CYII=";


  const [createTrip, { data, loading, error }] = useMutation(CREATE_MULTI_DAY_TRIP);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTrip({
        variables: {
          title: formData.title,
          durationDays: Number(formData.durationDays),
          tripDescription: formData.tripDescription,
          provinceIds: ["UHJvdmluY2VOb2RlOjE="] /* dummy */, 
          commonQuestionIds: [],
          visitLocationHighlightIds: [],
          contentIds: [],
          thumbnailsBase64: [tinyImage] /* dummy */, 
          placesOfResidenceIds: [],
          condition: {
            conditionText: "Sample condition",
            conditionIds: [],
          },
          program: [],
          groupSize: formData.groupSize,
        },
      });
      alert("Trip created successfully");
    } catch (err) {
      console.error("Error creating trip:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Create Multi-Day Trip</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Trip Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <Input
              type="number"
              placeholder="Duration (days)"
              value={formData.durationDays}
              onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}

            />

            <Textarea
              placeholder="Trip Description"
              value={formData.tripDescription}
              onChange={(e) => setFormData({ ...formData, tripDescription: e.target.value })}
            />

            <Input
              placeholder="Group Size (e.g., 2-10)"
              value={formData.groupSize}
              onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Trip"}
            </Button>

            {error && <p className="text-red-500">{error.message}</p>}
            {data && <p className="text-green-600">Trip ID: {data.createMultiDayTrip.multiDayTrip.id}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
