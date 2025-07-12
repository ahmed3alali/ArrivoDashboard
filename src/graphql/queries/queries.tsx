import { gql } from "@apollo/client";

/* --- GetTrips -------------------------------------------------------- */
export const GET_TRIPS = gql`
  query GetTrips(
    $country: String
    $groupSize: String
    $groupSizeRange: String
    $tags: [String]
    $duration: String
    $tripType: String
    $subType: String
    $price: String
    $priceLte: String
    $priceGte: String
    $fromDate: Date
    $toDate: Date
    $orderBy: String
    $lengthType: TripLengthTypeEnum
  ) {
    trips(
      country: $country
      groupSize: $groupSize
      groupSizeRange: $groupSizeRange
      tags: $tags
      duration: $duration
      tripType: $tripType
      subType: $subType
      price: $price
      priceLte: $priceLte
      priceGte: $priceGte
      fromDate: $fromDate
      toDate: $toDate
      orderBy: $orderBy
      lengthType: $lengthType
    ) {
      edges {
        node {
          __typename
          ... on OneDayTripNode {
            id
            title
            description
            price
            durationHours
            lengthType
          }
          ... on MultiDayTripNode {
            id
            title
            description
            price
            durationHours
            lengthType
          }
        }
      }
    }
  }
`;

/* --- GetTripPackages ------------------------------------------------- */
export const GET_TRIP_PACKAGES = gql`
  query GetTripPackages {
    tripPackages {
      id
      price
      groupSize      # camelCase
      startDate
      endDate
    }
  }
`;

/* --- GetUnavailabilityDates ----------------------------------------- */
export const GET_UNAVAILABILITY_DATES = gql`
  query GetUnavailabilityDates {
    unavailabilityDates {
      id
      startDate
      endDate
    }
  }
`;

/* --- GetTripById ----------------------------------------------------- */
export const GET_TRIP_BY_ID = gql`
  query GetTripById($id: ID!) {
    trip(id: $id) {
      __typename
      ... on OneDayTripNode {
        id
        title
        description
        durationHours
        price
        lengthType
        tags
        commonQuestions {
          id
          question
        }
      }
      ... on MultiDayTripNode {
        id
        title
        description
        durationHours
        price
        lengthType
        tags
        commonQuestions {
          id
          question
        }
      }
    }
  }
`;
