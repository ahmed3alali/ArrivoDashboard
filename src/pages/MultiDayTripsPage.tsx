import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Sidebar } from "@/components/Sidebar";

const GET_TRIPS = gql`
  query {
    multiDayTrips {
      edges {
        node {
          id
          title
          durationHours
          description
          conditionText
          conditions {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`;

const GET_CONDITIONS = gql`
  query {
    tripConditions(first: 100) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

const CREATE_TRIP = gql`
  mutation CreateMultiDayTrip(
    $title: String!
    $durationDays: Int!
    $tripDescription: String!
    $provinceIds: [ID!]!
    $commonQuestionIds: [ID!]!
    $visitLocationHighlightIds: [ID!]!
    $contentIds: [ID!]!
    $thumbnailsBase64: [String!]!
    $placesOfResidenceIds: [ID!]!
    $condition: ConditionInput!
    $program: [ProgramInput!]!
    $galleryImageIds: [ID]
    $subTypeIds: [ID]
    $tags: [String]
    $cardThumbnailBase64: String
    $offerType: String
    $price: String
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
      galleryImageIds: $galleryImageIds
      subTypeIds: $subTypeIds
      tags: $tags
      cardThumbnailBase64: $cardThumbnailBase64
      offerType: $offerType
      price: $price
      groupSize: $groupSize
    ) {
      multiDayTrip {
        id
        title
      }
    }
  }
`;

// similarly, add UPDATE_TRIP and DELETE_TRIP mutations here (omitted for brevity)

export default function MultiDayTripsPage() {
  const { data: tripData, loading: tripLoading, refetch: refetchTrips } = useQuery(GET_TRIPS);
  const { data: conditionsData, loading: condLoading } = useQuery(GET_CONDITIONS);

  const [createTrip] = useMutation(CREATE_TRIP);

  // form state
  const [form, setForm] = useState({
    title: "",
    durationDays: 1,
    tripDescription: "",
    provinceIds: [],
    commonQuestionIds: [],
    visitLocationHighlightIds: [],
    contentIds: [],
    thumbnailsBase64: [],
    placesOfResidenceIds: [],
    conditionText: "",
    conditionIds: [],
    program: [],
    galleryImageIds: [],
    subTypeIds: [],
    tags: [],
    cardThumbnailBase64: null,
    offerType: "",
    price: "",
    groupSize: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // handlers
  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createTrip({
        variables: {
          title: form.title,
          durationDays: form.durationDays,
          tripDescription: form.tripDescription,
          provinceIds: form.provinceIds,
          commonQuestionIds: form.commonQuestionIds,
          visitLocationHighlightIds: form.visitLocationHighlightIds,
          contentIds: form.contentIds,
          thumbnailsBase64: form.thumbnailsBase64,
          placesOfResidenceIds: form.placesOfResidenceIds,
          condition: {
            condition_text: form.conditionText,
            condition_ids: form.conditionIds,
          },
          program: form.program,
          galleryImageIds: form.galleryImageIds,
          subTypeIds: form.subTypeIds,
          tags: form.tags,
          cardThumbnailBase64: form.cardThumbnailBase64,
          offerType: form.offerType,
          price: form.price,
          groupSize: form.groupSize,
        },
      });
      alert("Trip created!");
      refetchTrips();
      setForm({
        title: "",
        durationDays: 1,
        tripDescription: "",
        provinceIds: [],
        commonQuestionIds: [],
        visitLocationHighlightIds: [],
        contentIds: [],
        thumbnailsBase64: [],
        placesOfResidenceIds: [],
        conditionText: "",
        conditionIds: [],
        program: [],
        galleryImageIds: [],
        subTypeIds: [],
        tags: [],
        cardThumbnailBase64: null,
        offerType: "",
        price: "",
        groupSize: "",
      });
    } catch (e) {
      alert("Error creating trip: " + e.message);
    }
    setIsSubmitting(false);
  };

  if (tripLoading || condLoading) return <p>Loading...</p>;
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <h1 className="text-3xl font-bold mb-6">Multi-Day Trips Manager</h1>

      {/* Trip List */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Existing Trips</h2>
        <ul className="divide-y divide-gray-300">
          {tripData?.multiDayTrips?.edges.map(({ node }) => (
            <li key={node.id} className="py-3 flex justify-between items-center">
              <div>
                <strong>{node.title}</strong> - {node.durationHours / 24} days
              </div>
              <div>
                {/* TODO: Edit and Delete buttons here */}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Create/Edit Form */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Create New Trip</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Title"
            className="input input-bordered w-full"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Duration (days)"
            className="input input-bordered w-full"
            min={1}
            value={form.durationDays}
            onChange={(e) => handleChange("durationDays", parseInt(e.target.value))}
            required
          />

          <textarea
            placeholder="Description"
            className="textarea textarea-bordered w-full"
            value={form.tripDescription}
            onChange={(e) => handleChange("tripDescription", e.target.value)}
            required
          />

          {/* Condition text */}
          <textarea
            placeholder="Condition Text (custom notes)"
            className="textarea textarea-bordered w-full"
            value={form.conditionText}
            onChange={(e) => handleChange("conditionText", e.target.value)}
          />

          {/* Condition multi-select */}
          <select
            multiple
            className="select select-bordered w-full"
            value={form.conditionIds}
            onChange={(e) =>
              handleChange(
                "conditionIds",
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {conditionsData.tripConditions.edges.map(({ node }) => (
              <option key={node.id} value={node.id}>
                {node.title}
              </option>
            ))}
          </select>

          {/* TODO: Add other fields, program, images, etc. */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary mt-4"
          >
            {isSubmitting ? "Saving..." : "Create Trip"}
          </button>
        </form>
      </section>
    </>
  );
}
