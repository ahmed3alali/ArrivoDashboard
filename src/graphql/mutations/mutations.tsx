// src/mutations.js
import { gql } from '@apollo/client';

// Mutation for creating a one-day trip
export const CREATE_ONE_DAY_TRIP = gql`
  mutation CreateOneDayTrip(
    $title: String!
    $durationHours: Int!
    $tripDescription: String!
    $provinceIds: [ID!]!
    $commonQuestionIds: [ID!]!
    $visitLocationHighlightIds: [ID!]!
    $contentIds: [ID!]!
    $thumbnailBase64: String!
    $activityIds: [ID!]!
    $importantInfoIds: [ID!]!
    $exclusionIds: [ID!]!
    $program: [OneDayProgramInput!]!
    $tags: [String!]
  ) {
    createOneDayTrip(
      title: $title
      durationHours: $durationHours
      tripDescription: $tripDescription
      provinceIds: $provinceIds
      commonQuestionIds: $commonQuestionIds
      visitLocationHighlightIds: $visitLocationHighlightIds
      contentIds: $contentIds
      thumbnailBase64: $thumbnailBase64
      activityIds: $activityIds
      importantInfoIds: $importantInfoIds
      exclusionIds: $exclusionIds
      program: $program
      tags: $tags
    ) {
      oneDayTrip {
        id
        title
        durationHours
        description
        price
      }
    }
  }
`;

// Mutation for editing a one-day trip
export const EDIT_ONE_DAY_TRIP = gql`
  mutation EditOneDayTrip(
    $id: ID!
    $title: String
    $durationHours: Int
    $tripDescription: String
    $provinceIds: [ID!]
    $commonQuestionIds: [ID!]
    $visitLocationHighlightIds: [ID!]
    $contentIds: [ID!]
    $thumbnailBase64: String
    $activityIds: [ID!]
    $importantInfoIds: [ID!]
    $exclusionIds: [ID!]
    $program: [OneDayProgramInput]
    $tags: [String!]
  ) {
    editOneDayTrip(
      id: $id
      title: $title
      durationHours: $durationHours
      tripDescription: $tripDescription
      provinceIds: $provinceIds
      commonQuestionIds: $commonQuestionIds
      visitLocationHighlightIds: $visitLocationHighlightIds
      contentIds: $contentIds
      thumbnailBase64: $thumbnailBase64
      activityIds: $activityIds
      importantInfoIds: $importantInfoIds
      exclusionIds: $exclusionIds
      program: $program
      tags: $tags
    ) {
      oneDayTrip {
        id
        title
      }
    }
  }
`;

// Mutation for deleting a trip
export const DELETE_TRIP = gql`
  mutation DeleteTrip($id: ID!) {
    deleteTrip(id: $id) {
      tripId
    }
  }
`;


// Mutation for creating a multi-day trip
export const CREATE_MULTI_DAY_TRIP = gql`
  mutation CreateMultiDayTrip(
    $title: String!
    $duration_days: Int!
    $tripDescription: String!
    $provinceIds: [ID!]!
    $commonQuestionIds: [ID!]!
    $visitLocationHighlightIds: [ID!]!
    $contentIds: [ID!]!
    $tags: [String!]
    $thumbnails_base64: [String!]!
    $placesOfResidenceIds: [ID!]!
    $condition: ConditionInput!
    $program: [ProgramInput!]!
    $gallery_image_ids: [ID!]
    $card_thumbnailBase64: String
    $offerType: String
    $price: String
    $groupSize: String
  ) {
    createMultiDayTrip(
      title: $title
      duration_days: $duration_days
      tripDescription: $tripDescription
      provinceIds: $provinceIds
      commonQuestionIds: $commonQuestionIds
      visitLocationHighlightIds: $visitLocationHighlightIds
      contentIds: $contentIds
      tags: $tags
      thumbnails_base64: $thumbnails_base64
      placesOfResidenceIds: $placesOfResidenceIds
      condition: $condition
      program: $program
      gallery_image_ids: $gallery_image_ids
      card_thumbnailBase64: $card_thumbnailBase64
      offerType: $offerType
      price: $price
      groupSize: $groupSize
    ) {
      multiDayTrip {
        id
        title
        durationHours
      }
    }
  }
`;

// Mutation for editing a multi-day trip
export const EDIT_MULTI_DAY_TRIP = gql`
  mutation EditMultiDayTrip(
    $id: ID!
    $title: String
    $duration_days: Int
    $tripDescription: String
    $provinceIds: [ID!]
    $commonQuestionIds: [ID!]
    $visitLocationHighlightIds: [ID!]
    $contentIds: [ID!]
    $tags: [String!]
    $thumbnails_base64: [String!]
    $placesOfResidenceIds: [ID!]
    $condition: ConditionInput
    $program: [ProgramInput]
    $gallery_image_ids: [ID!]
    $card_thumbnailBase64: String
    $offerType: String
    $price: String
    $groupSize: String
  ) {
    editMultiDayTrip(
      id: $id
      title: $title
      duration_days: $duration_days
      tripDescription: $tripDescription
      provinceIds: $provinceIds
      commonQuestionIds: $commonQuestionIds
      visitLocationHighlightIds: $visitLocationHighlightIds
      contentIds: $contentIds
      tags: $tags
      thumbnails_base64: $thumbnails_base64
      placesOfResidenceIds: $placesOfResidenceIds
      condition: $condition
      program: $program
      gallery_image_ids: $gallery_image_ids
      card_thumbnailBase64: $card_thumbnailBase64
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

// Mutation for deleting a multi-day trip
export const DELETE_MULTI_DAY_TRIP = gql`
  mutation DeleteMultiDayTrip($id: ID!) {
    deleteMultiDayTrip(id: $id) {
      multiDayTripId
    }
  }
`;


// Mutation for creating a trip package
export const CREATE_TRIP_PACKAGE = gql`
  mutation CreateTripPackage(
    $tripId: ID!
    $price: String!
    $groupSize: String!
    $startDate: String!
    $endDate: String!
  ) {
    createTripPackage(
      tripId: $tripId
      price: $price
      groupSize: $groupSize
      startDate: $startDate
      endDate: $endDate
    ) {
      tripPackage {
        id
        price
        groupSize
      }
    }
  }
`;

// Mutation for editing a trip package
export const EDIT_TRIP_PACKAGE = gql`
  mutation EditTripPackage(
    $id: ID!
    $price: String
    $groupSize: String
    $startDate: String
    $endDate: String
  ) {
    editTripPackage(
      id: $id
      price: $price
      groupSize: $groupSize
      startDate: $startDate
      endDate: $endDate
    ) {
      tripPackage {
        id
        price
        groupSize
      }
    }
  }
`;

// Mutation for deleting a trip package
export const DELETE_TRIP_PACKAGE = gql`
  mutation DeleteTripPackage($id: ID!) {
    deleteTripPackage(id: $id) {
      tripPackage_id
    }
  }
`;



// Mutation for creating an unavailability date
export const CREATE_UNAVAILABILITY_DATE = gql`
  mutation CreateUnavailabilityDate($startDate: String!, $endDate: String!) {
    createUnavailabilityDate(startDate: $startDate, endDate: $endDate) {
      unavailabilityDate {
        id
        startDate
        endDate
      }
    }
  }
`;

// Mutation for editing an unavailability date
export const EDIT_UNAVAILABILITY_DATE = gql`
  mutation EditUnavailabilityDate(
    $id: ID!
    $startDate: String
    $endDate: String
  ) {
    editUnavailabilityDate(id: $id, startDate: $startDate, endDate: $endDate) {
      unavailabilityDate {
        id
        startDate
        endDate
      }
    }
  }
`;

// Mutation for deleting an unavailability date
export const DELETE_UNAVAILABILITY_DATE = gql`
  mutation DeleteUnavailabilityDate($id: ID!) {
    deleteUnavailabilityDate(id: $id) {
      unavailabilityDate_id
    }
  }
`;


