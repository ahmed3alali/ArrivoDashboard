import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Calendar, MapPin, Users, DollarSign, Camera, Tag } from 'lucide-react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, MultiSelect } from "react-shadcn-multiselect";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DELETE_MULTI_DAY_TRIP } from '@/graphql/mutations/mutations';
import { Sidebar } from '@/components/Sidebar';
import { toast } from '@/hooks/use-toast';
import { TripsList } from '@/components/TripsList';
import { useNavigate } from 'react-router-dom';
import { TripsListMulti } from '@/components/ui/TriplistMulti';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CommonQuestionsMultiSelect } from '@/components/CommonQuestionsMultiSelect';
import MultiSelectDropdown from '@/components/MultiSelectDropdown';
import { t } from 'i18next';
import { DashboardHeader } from '@/components/DashboardHeader';
import NoItemsPage from '@/components/ui/NoItemsPage';
import LoaderExternal from '@/components/ui/Loader';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Input } from '@/components/ui/input';







const GET_PROVINCES = gql`
  query {
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

const GET_VISIT_LOCATION_HIGHLIGHTS = gql`
  query {
    visitLocationHighlights(first: 10) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

const GET_TRIP_CONTENTS = gql`
  query {
    tripContents(first: 10) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

const GET_TRIP_ACTIVITIES = gql`
  query {
    tripActivities(first: 10) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

const GET_IMPORTANT_INFOS = gql`
  query {
    tripImportantInfos(first: 10) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

const GET_EXCLUSIONS = gql`
  query {
    tripExclusions(first: 10) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

const GET_SUB_TYPES = gql`
  query {
    tripSubTypes(first: 10) {
      edges {
        node {
          id
          type
        }
      }
    }
  }
`;

const GET_DESTINATIONS = gql`
  query GetDestinations($first: Int = 10) {
    destinations(first: $first) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;


const GET_COMMON_QUESTIONS = gql`
  query {
    commonQuestions {
      edges {
        node {
          id
          question
          answer
        }
      }
    }
  }
`;



const GET_ONE_DAY_TRIPS = gql`
query {
  trips(lengthType: ONE_DAY) {
    edges {
      node {
        ... on OneDayTripNode {
          id
          title
          description
          durationHours
          thumbnail
          cardThumbnail
          price
          groupSize
          tags
          offerType

          galleryImages{
          
                id
                title
                picture
            }

          commonQuestions {
          
          id
          question
          
          }

           programSections {
            id
            order
            destination {
              id
              title
            }
            subDestinations(first: 10) {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }


       
          activities {
            id
          }
          
          provinces{
            
            id
            name
          }
          

        
      
        }
        ... on MultiDayTripNode {
          id
          title
          description
          durationHours
          price
          offerType
         
      
        }
     
      }
    }
  }
}


  `;



  const GET_MULTI_DAY_TRIPS = gql`
  query {
  trips(lengthType: MULTI_DAY) {
    edges {
      node {
        ... on MultiDayTripNode {
          id
          title
          description
         
          price
          durationHours
          offerType
          price
          conditionText
          
             thumbnails{
            id
            image
          }
          cardThumbnail
          
        
          groupSize
          provinces{
            id
            name
          }
          commonQuestions{
            id
            question
          }

          

          visitLocationHighlights{
            id
            title
          }

          conditions{
          
          id 

          }


          
          content{
            
            id
            title
            icon
            description

            

            
          }
          
          placesOfResidence{
            id
            title
            location
            
          }
          
          galleryImages{
            
            id
            title
            picture
          }
          
          tripType
          
          
          subTypes{
            id
            type
          }
          
         tags

         dayPrograms {
            title
            subTitle
            description
            residenceName
            destination {
              id
              title
            }
            activities{
              edges
              {
                node{
                  id
                  title
                }
              }
            }
            subDestinations {
              id
              title
            }
            visitHighlights {
              __typename
              ... on SubDestinationNode {
                id
                title
                destination {
                  id
                  title
                }
              }
            }
          }
          
        

      
        }
      }
    }
  }
}

`;








// --- Mutation ---
const CREATE_MULTI_DAY_TRIP = gql`
  mutation CreateMultiDayTrip(
  $title: String!
  $subTypeIds: [ID!]
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
  $galleryImageIds: [ID!]
  $tags: [String!]
  $cardThumbnailBase64: String
  $offerType: String
  $price: String
  $groupSize: String
) {
  createMultiDayTrip(
    title: $title
    subTypeIds: $subTypeIds
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
    tags: $tags
    cardThumbnailBase64: $cardThumbnailBase64
    offerType: $offerType
    price: $price
    groupSize: $groupSize
  ) {
    multiDayTrip {
      id
      title
      durationHours
      description
      offerType
      price
      groupSize
      provinces {     
        id
        name
      }
      subTypes {         
        id
        type
      }
      commonQuestions {
        id
        question
      }
      galleryImages {
        id
        title
        picture
      }
      tags
      cardThumbnail 
      
      placesOfResidence {
        id
        title
        location
      }
    }
  }
}


`;



// --- Mutation ---
const EDIT_MULTI_DAY_TRIP = gql`
  mutation EditMultiDayTrip(
  $id: ID!
  $title: String
  $subTypeIds: [ID!]
  $durationDays: Int
  $tripDescription: String
  $provinceIds: [ID!]
  $commonQuestionIds: [ID!]
  $visitLocationHighlightIds: [ID!]
  $contentIds: [ID!]
  $tags: [String!]
  $galleryImageIds: [ID!]
  $placesOfResidenceIds: [ID!]
  $thumbnailsBase64: [String!]
  $cardThumbnailBase64: String
  $offerType: String
  $price: String
  $groupSize: String
) {
  editMultiDayTrip(
    id: $id
    title: $title
    subTypeIds: $subTypeIds
    durationDays: $durationDays
    tripDescription: $tripDescription
    provinceIds: $provinceIds
    commonQuestionIds: $commonQuestionIds
    visitLocationHighlightIds: $visitLocationHighlightIds
    contentIds: $contentIds
    tags: $tags
    galleryImageIds: $galleryImageIds
    placesOfResidenceIds: $placesOfResidenceIds
    thumbnailsBase64: $thumbnailsBase64
    cardThumbnailBase64: $cardThumbnailBase64
    offerType: $offerType
    price: $price
    groupSize: $groupSize
  ) {
    multiDayTrip {
      id
      title
      durationHours
      description
      offerType
      price
      groupSize
      provinces {     
        id
        name
      }
      subTypes {         
        id
        type
      }
      commonQuestions {
        id
        question
      }
      galleryImages {
        id
        title
        picture
      }
      tags
      cardThumbnail 
      
      placesOfResidence {
        id
        title
        location
      }
    }
  }
}

`;


const DELETE_TRIP = gql`
mutation DeleteTrip($id: ID!) {
  deleteTrip(id: $id) {
    tripId
  }
}



`;


const GET_GALLERY_IMAGES = gql`
  query GetGalleryImages($first: Int = 10) {
    galleryImages(first: $first) {
      edges {
        node {
          id
          title
          picture
          tags {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;



const CREATE_SUB_DESTINATION = gql`
  mutation CreateSubDestination($title: String!, $destinationId: ID!) {
    createSubDestination(title: $title, destinationId: $destinationId) {
      subDestination {
        id
        title
        destination {
          id
          title
        }
      }
    }
  }
`;

const GET_SUB_DESTINATIONS = gql`
  query {
    subDestinations {
      edges {
        node {
          id
          title
          destination {
            id
            title
          }
        }
      }
    }
  }
`;



// GraphQL Queries & Mutations
const GET_RESIDENCES = gql`
  query {
    residences {
      edges {
        node {
          id
          title
          location
          type
          thumbnail
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






const MultiDayTripCRUD = () => {



  const [trips, setTrips] = useState([]);


  //subtypes ... 

  const {
    loading: loadingSubTypes,
    error: errorSubTypes,
    data: dataSubTypes
  } = useQuery(GET_SUB_TYPES);


  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);



  const subTypes = dataSubTypes?.tripSubTypes.edges.map(e => ({
    label: e.node.type,
    value: e.node.id,
  })) || [];


  // Provinces 

  const {
    loading: loadingProvinces,
    error: errorProvinces,
    data: dataProvinces
  } = useQuery(GET_PROVINCES);

  const [selectedProvince, setSelectedProvince] = useState<string[]>([]);


  // common Questions 


  const {
    loading: loadingCommonQuestions,
    error: errorCommonQuestions,
    data: dataCommonQuestions
  } = useQuery(GET_COMMON_QUESTIONS);


  const [selectedQuestion, setSelectedQuestion] = useState<string[]>([]);



  const commonQuestions = dataCommonQuestions?.commonQuestions.edges.map(e => ({
    label: e.node.question,
    value: e.node.id,
  })) || [];


  console.log('Options:', commonQuestions.map(c => c.value));
console.log('Selected:', selectedQuestion);


  const [viewingTrip, setViewingTrip] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);


  //destinations 
  const {
    loading: loadingDestinations,
    error: errorDestinations,
    data: dataDestinations
  } = useQuery(GET_DESTINATIONS);

  const [selectedDests, setSelectedDests] = useState<string[]>([]);






  const destinations = dataDestinations?.destinations.edges.map(e => ({
    label: e.node.title,
    value: e.node.id,
  })) || [];





  /// exclusions 


  const {
    loading: loadingExclusions,
    error: errorExclusions,
    data: dataExlcusions
  } = useQuery(GET_EXCLUSIONS);

  const [selectedExclusion, setSelectedExclusion] = useState<string[]>([]);



  const exclusions = dataExlcusions?.tripExclusions.edges.map(e => ({
    label: e.node.title,
    value: e.node.id,
  })) || [];




  // gallery Images

  const {
    loading: loadingImages,
    error: errorImages,
    data: dataGallery
  } = useQuery(GET_GALLERY_IMAGES);




  const [selectedGallery, setSelectedGallery] = useState<string[]>([]);






  const gallery = dataGallery?.galleryImages.edges.map(e => ({
    label: e.node.title,
    value: e.node.id,
  })) || [];


  // important info 
  const {
    loading: loadingImportantInfo,
    error: errorImportantInfo,
    data: dataImportantInfo
  } = useQuery(GET_IMPORTANT_INFOS);


  const [selectedImportantInfo, setSelectedImportantInfo] = useState<string[]>([]);


  const ImportantInfo = dataImportantInfo?.tripImportantInfos.edges.map(e => ({
    label: e.node.title,
    value: e.node.id,
  })) || [];








  // SubDestinations

  const {
    loading: loadingSubDestinations,
    error: errorSubDestinations,
    data: dataSubDestinations
  } = useQuery(GET_SUB_DESTINATIONS);

  const [selectedSubDest, setSelectedSubDest] = useState<string[]>([]);




  const subdestantions = dataSubDestinations?.subDestinations.edges.map(e => ({
    label: e.node.title,
    value: e.node.id,
  })) || [];








  // Actvities


  const {
    loading: loadingActivities,
    error: errorActivities,
    data: dataActivities
  } = useQuery(GET_TRIP_ACTIVITIES);


  const [selectedTripActivites, setSelectedTripActivities] = useState<string[]>([]);


  const activities = dataActivities?.tripActivities.edges.map(e => ({
    label: e.node.title,
    value: e.node.id,
  })) || [];





  // Trip Contents 



  const {
    loading: loadingTripContents,
    error: errorTripContents,
    data: dataTripContents
  } = useQuery(GET_TRIP_CONTENTS);


  const [selectedTripContents, setSelectedTripContents] = useState<string[]>([]);


  const [thumbnailBase64Preview, setThumbnailBase64Preview] = useState("");
  const [cardThumbnailBase64Preview, setCardThumbnailBase64Preview] = useState("");


  const tripContents = dataTripContents?.tripContents.edges.map(e => ({
    label: e.node.title,
    value: e.node.id,
  })) || [];






  useEffect(()=>{


    console.log(formData.groupSize)
    console.log("Type of groupSize:", typeof formData.groupSize);
  })



  /// Trip Highlights 



  const {
    loading: loadingHighlights,
    error: errorHighlights,
    data: dataHighlights
  } = useQuery(GET_VISIT_LOCATION_HIGHLIGHTS);


  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([]);




  const highlights = dataHighlights?.visitLocationHighlights.edges.map(e => ({
    label: e.node.title,
    value: e.node.id,
  })) || [];




useEffect(()=>{

  console.log("Thumbnail Base64:", formData.thumbnails_base64);
  console.log("Card Base64:", formData.card_thumbnail_base64);


})


  // Trip Residence 




  const {
    loading: loadingResidence,
    error: errorResidence,
    data: dataResidence
  } = useQuery(GET_RESIDENCES);


  ////

  const [selectedResidence, setSelectedResidence] = useState<string[]>([]);



  const residence = dataResidence?.residences.edges.map(e => ({
    label: e.node.title,
    value: e.node.id,
  })) || [];



  ////




  // Trip Condiions 


  const {
    loading: loadingConditions,
    error: errorConditions,
    data: dataConditions
  } = useQuery(GET_CONDITIONS);

  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);


  const condition = dataConditions?.tripConditions.edges.map(e => ({
    label: e.node.title,
    value: e.node.id,
  })) || [];



  //// END 



    const [isModalOpen, setIsModalOpen] = useState(false);


    const [program, setProgram] = useState([
      { order: 1, destinationId: "", subDestinationIds: [] }
    ]);





    const [editingTrip, setEditingTrip] = useState(null);
    const [editMultiDayTrip] = useMutation(EDIT_MULTI_DAY_TRIP);
    const [createMultiDayTrip] = useMutation(CREATE_MULTI_DAY_TRIP);
    const [deleteMultiDayTrip] = useMutation(DELETE_TRIP);





    const [formData, setFormData] = useState({
      title: '',
      duration_days: 1,
      trip_description: '',
      province_ids: [],

      common_question_ids: [],
      visit_location_highlight_ids: [],
    
      tags: [],

      thumbnails_base64: "", // check if this should be array
      places_of_residence_ids: [],
      condition: {
        condition_text: '',
        condition_ids: [], 
      },
      program: [],
      gallery_image_ids: [],
      card_thumbnail_base64: "",
      offer_type: '',
      price: '',
      groupSize: '',
      sub_type_ids: []
    });


    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [collapsed, setCollapsed] = useState(false);



    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    };

    const onCommonQuestionChange = (values) => {
      setSelectedQuestion(values); // update selected questions array
      setFormData(prev => ({
        ...prev,
        common_question_ids: values
      }));
    };
    

    const handleTagsChange = (e) => {
      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setFormData(prev => ({
        ...prev,
        tags
      }));
    };

    const handleArrayInputChange = (fieldName, value) => {
      const ids = value.split(',').map(id => id.trim()).filter(id => id);
      setFormData(prev => ({
        ...prev,
        [fieldName]: ids
      }));
    };



    
    const resetForm = () => {
      setFormData({
        title: '',
        duration_days: 1,
      
        trip_description: '',
        province_ids: [],
        common_question_ids: [],
        visit_location_highlight_ids: [],

        tags: [],
        thumbnails_base64: "",
        places_of_residence_ids: [],
        condition: {
          condition_text: '',
          condition_ids: [], 
        },
        program: [],
        gallery_image_ids: [],
        card_thumbnail_base64: '',
        offer_type: '',
        price: '',
        groupSize: '',
        sub_type_ids: []
      });
    };



    const navigate = useNavigate()




    const validateForm = () => {
      const titleRegex = /^[A-Za-z0-9\u0600-\u06FFçÇğĞıİöÖşŞüÜ .,!?\-()]+$/u;
      const priceRegex = /^\$?\d+(\.\d{1,2})?$/;
      const groupSizeRegex = /^\d+(-\d+)?$/; 
      const offerTypeRegex = /^[A-Za-z0-9\u0600-\u06FFçÇğĞıİöÖşŞüÜ .,!?\-()]+$/u;
      const conditionTextRegex =/^[\p{L}\p{N}\s.,?!'\-()،؟]+$/u;
    
      if (!formData.title.trim()) {
        toast({ title: "Title Missing", description: "Please enter a trip title." });
        return false;
      }
      if (!titleRegex.test(formData.title.trim())) {
        toast({ title: "Invalid Title", description: "Title must be 3-100 characters without special symbols." });
        return false;
      }
    
      if (!formData.duration_days || Number(formData.duration_days) < 1) {
        toast({ title: "Invalid Duration", description: "Duration must be at least 1 day." });
        return false;
      }
    
      if (!formData.trip_description.trim()) {
        toast({ title: "Description Missing", description: "Please provide a trip description." });
        return false;
      }
    
      if (!selectedProvince.length) {
        toast({ title: "Province Missing", description: "Please select at least one province." });
        return false;
      }
    
      if (!formData.price.trim()) {
        toast({ title: "Price Missing", description: "Please enter a price." });
        return false;
      }
      if (!priceRegex.test(formData.price.trim())) {
        toast({ title: "Invalid Price", description: "Price must be a valid number, e.g., 299 or $299.99." });
        return false;
      }
    
      if (formData.groupSize && formData.groupSize.trim()) {
        const trimmed = formData.groupSize.trim();
        if (!groupSizeRegex.test(trimmed)) {
          toast({
            title: "Invalid Group Size",
            description: "Group size must be a number or range, e.g., 2 or 2-8.",
          });
          return false;
        }
      }
      if (formData.offer_type && !offerTypeRegex.test(formData.offer_type.trim())) {
        toast({ title: "Invalid Offer Type", description: "Offer type can only contain letters and spaces." });
        return false;
      }
    
      if (formData.condition.condition_text && !conditionTextRegex.test(formData.condition.condition_text.trim())) {
        toast({ title: "Invalid Condition Text", description: "Condition text contains invalid characters." });
        return false;
      }
    
      if (!formData.thumbnails_base64) {
        toast({ title: "Thumbnail Missing", description: "Please upload a thumbnail image." });
      console.log(formData.thumbnails_base64)
      
        return false;
      }
    
      if (!formData.card_thumbnail_base64) {
        toast({ title: "Card Image Missing", description: "Please upload a card thumbnail image." });
        return false;
      }
    
      // All validations passed
      return true;
    };
    



      const openCreateModal = () => {
        resetForm();
        setEditingTrip(null);
        setIsModalOpen(true);
      
      };

  const openEditModal = (trip) => {
    console.log("Trip data for editing:", trip);
    
    // Extract IDs from the trip object - these might be nested objects
    const provinceIds = trip.provinces?.map(p => p.id) || [];
    const condtionIds = trip.conditions?.map(p => p.id) || [];
    const subtypesIds = trip.subTypes?.map(p=>p.id) || [];
    console.log("sub types after maintence : ", subtypesIds);
    console.log("condition ids after maintanice : " , condtionIds);
    
    const contentIds = trip.content?.map(p => p.id) || [];
    const commonQuestionIds = trip.commonQuestions?.map(q => q.id) || [];
    const subTypeIds = trip.subTypes?.map(st => st.id) || [];
    const visitIds = trip.visitLocationHighlights?.map(st => st.id) || [];
    const galleryImageIds = trip.galleryImages?.map(gi => gi.id) || [];
    const placesOfResidenceIds = trip.placesOfResidence?.map(pr => pr.id) || [];
    console.log("trip condition text : ",trip.conditionText)



    const parsedProgramSections = trip.dayPrograms?.map((step) => ({
      title: step.title || "",
      sub_title: step.subTitle || "",
      description: step.description || "",
    
      // ✅ Destination for dropdown (single-select)
      destinationId: step.destination?.id || "",
    
      // ✅ SubDestinationIds: Not needed unless you're using them separately
      subDestinationIds: step.subDestinations?.map(sub => sub.id) || [],
    
      // ✅ Visit Highlights = mix of SubDestinations + VisitLocationHighlights
      visitHighlightIds: step.visitHighlights?.map(h => h.id) || [],
    
      // ✅ Activities
      activityIds: step.activities?.edges.map(({ node }) => node.id) || [],
    
      // ✅ Residence
      residence_name: step.residenceName || "",
    }));
    
console.log("program check " , parsedProgramSections)





    // Set form data
    setFormData({
      ...trip,
      title: trip.title || '',
      duration_days: trip.durationDays || 1,
      trip_description: trip.description || '',
      province_ids: provinceIds,
      common_question_ids: commonQuestionIds,
      visit_location_highlight_ids: visitIds,
      content_ids: contentIds,
      tags: trip.tags || [],
      places_of_residence_ids: placesOfResidenceIds,
      condition: {
        condition_text: trip.conditionText || '',
        condition_ids: condtionIds 
      },
      program: parsedProgramSections,
      gallery_image_ids: galleryImageIds,
      sub_type_ids: subtypesIds,
      thumbnails_base64: trip.thumbnails || [],
      card_thumbnail_base64: trip.cardThumbnail || '',
      offer_type: trip.offerType || '',
      price: trip.price || '',
      groupSize: trip.groupSize || '',
    });

    // Set multiselect states - these need to match the option values exactly
    setSelectedQuestion(commonQuestionIds);
    setSelectedProvince(provinceIds);
    setSelectedSubs(subtypesIds);
    setSelectedHighlights(visitIds);
    setSelectedTripContents(contentIds);
    // Set into local state
setProgramSections(parsedProgramSections);
    setSelectedResidence(placesOfResidenceIds);
    setSelectedGallery(galleryImageIds);
    setSelectedCondition(condtionIds);

    console.log("Setting multiselect values:", {
      provinces: provinceIds,
      questions: commonQuestionIds,
      subTypes: subTypeIds,
      galleries: galleryImageIds,
      residences: placesOfResidenceIds
    });


    console.log("our thumbnail that is causing problems is " , trip.thumbnails || [],
    );
    

    setEditingTrip(trip);
    setIsModalOpen(true);
  };
      

      const closeModal = () => {
        setIsModalOpen(false);
        setEditingTrip(null);
        resetForm();
      };

      const handleSubmit = async (e) => {


        e.preventDefault();

        if (!validateForm()) return; // stop if invalid


        
     

        const preparedProgram = programSections.map((section, idx) => ({
          dayNumber: idx + 1,
          title: section.title,
          subTitle: section.sub_title,
          description: section.description,
          destinationId: section.destinationId || null,
          subDestinationIds: section.subDestinationIds || [], // ✅ ADD THIS
          visitHighlightIds: section.visitHighlightIds || [],
          activityIds: section.activityIds || [],
          residenceName: section.residence_name || null,
        }));
        




        try {

          if (editingTrip && formData) {

            await editMultiDayTrip({
              variables: {
                id:editingTrip.id,
                title: formData.title, // checked 
                  subTypeIds: selectedSubs?.length > 0
                  ? selectedSubs
                  : editingTrip.subTypeIds,//checked
                  durationDays: Number(formData.duration_days), //checked 
                  tripDescription: formData.trip_description, // checked
                  provinceIds: selectedProvince, // checked
                  commonQuestionIds:  selectedQuestion?.length > 0
                  ? selectedQuestion
                  : editingTrip.commonQuestionIds,
                  visitLocationHighlightIds: selectedHighlights,// checked,
                  contentIds: selectedTripContents?.length > 0
                  ? selectedTripContents
                  : editingTrip.contentIds, // checked 
                  groupSize: formData.groupSize || null,
                  placesOfResidenceIds: selectedResidence?.length > 0
                  ? selectedResidence
                  : editingTrip.placesOfResidenceIds, //checked

                  program: preparedProgram, // ------ 

                  condition: {
                    conditionText: formData.condition.condition_text,
                    conditionIds: formData.condition.condition_ids,
                  },
                  

                  galleryImageIds: selectedGallery,//checked
                  tags: formData.tags, // checked
          
                  offerType: formData.offer_type, // checked
                  price: formData.price, //checked 
                




                  thumbnailsBase64: typeof formData.thumbnails_base64 === 'string' &&
      formData.thumbnails_base64.startsWith("data:image")
        ? [formData.thumbnails_base64]
        : [],

            
                  ...(formData.card_thumbnail_base64?.startsWith("data:image") && {
                    cardThumbnailBase64: formData.card_thumbnail_base64,
                  }),


              },
            });
          toast({ title: "Success", description: "Trip updated successfully." });

          setTimeout(() => {
            window.location.reload();
          }, 2000); 

          } else {

            console.log("Thumbnail Base64:", formData.thumbnails_base64);
            console.log("Card Base64:", formData.card_thumbnail_base64);

            await createMultiDayTrip({

              
            

              
                variables: {
                  title: formData.title, // checked 
                  subTypeIds: selectedSubs,//checked
                  durationDays: Number(formData.duration_days), //checked 
                  tripDescription: formData.trip_description, // checked
                  provinceIds: selectedProvince, // checked
                  commonQuestionIds: selectedQuestion,
                  visitLocationHighlightIds: selectedHighlights,// checked,
                  contentIds: selectedTripContents, // checked 
                  groupSize: formData.groupSize ,
                  placesOfResidenceIds: selectedResidence, //checked

                  program: preparedProgram,
                


                  condition: {
                    conditionText: formData.condition.condition_text,
                    conditionIds: formData.condition.condition_ids,
                  },
                  

                  galleryImageIds: selectedGallery,//checked
                  tags: formData.tags, // checked
          
                  offerType: formData.offer_type, // checked
                  price: formData.price, //checked 
                




                  thumbnailsBase64: typeof formData.thumbnails_base64 === 'string' &&
      formData.thumbnails_base64.startsWith("data:image")
        ? [formData.thumbnails_base64]
        : [],

            
                  ...(formData.card_thumbnail_base64?.startsWith("data:image") && {
                    cardThumbnailBase64: formData.card_thumbnail_base64,
                  }),

                

              },
            });
            toast({ title: "Success", description: "Trip created successfully." });
            console.log("group size sent is :",formData.groupSize)

            setTimeout(() => {
              window.location.reload();
            }, 2000); 
          }


        } catch (error) {
          toast({ title: "Error", description: "Failed to save trip. Please try again." });
          console.error(error)
        }



        closeModal();
      };

      const handleDelete = async (id : string) => {
        if (window.confirm(t("DeleteWarning"))) {
          // DeleteTrip mutation
          console.log('Deleting trip with id :', id);
          await deleteMultiDayTrip({variables: {id}});
          window.location.reload();


        
        }
      };


      const updateProgramStep = (index, key, value) => {
        setProgramSections(prev =>
          prev.map((step, i) =>
            i === index ? { ...step, [key]: value } : step
          )
        );
      };
      



      // file uploading logic 

      const MAX_FILE_SIZE_MB = 2.5;
      const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

      const handleFileUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setValue: (value: string) => void
      ) => {
        const file = e.target.files?.[0];
        if (!file) return;
      
        if (file.size > MAX_FILE_SIZE_BYTES) {
          alert(`File too large! Please select a file smaller than ${MAX_FILE_SIZE_MB} MB.`);
          e.target.value = ""; // clear the input
          return;
        }
      
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setValue(base64String);
        };
        reader.readAsDataURL(file);
      };
      
      

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTrips((prev) => ({ ...prev, [name]: value }));
      };


      const [programSections, setProgramSections] = useState([
        {
          title: "",
          sub_title: "",
          description: "",
          destinationId: "",
          subDestinationIds: [], // ✅ ADD THIS
          visitHighlightIds: [],
          activityIds: [],
          residence_name: "",
        },
      ]);
      



      const handleGroupChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
      

      const setThumbValue = (value: string) => {
        setFormData((prev) => ({
          ...prev,
          thumbnails_base64: value,
        }));
      };
      
      const setCardValue = (value: string) => {
        setFormData((prev) => ({
          ...prev,
          card_thumbnail_base64: value,
        }));
      };
      


      

      // Final structure to send as `program`
    

      const routerFunction = ()=>{

        navigate("/oneday-trip#one-day-trips");


      }


      const {
        loading: loadingTrips,
        error: errorTrips,
        data: dataTrips
      } = useQuery(GET_MULTI_DAY_TRIPS);


      const myTrips = dataTrips?.trips?.edges || []

      if (loadingSubTypes || loadingDestinations || loadingActivities || loadingCommonQuestions || loadingConditions) return <LoaderExternal/>;
      if (errorSubTypes || errorDestinations) return <ErrorMessage message='Error loading data that will be in dropdowns (subtypes or destinations)'/>;

      return (

        <>

<DashboardHeader 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />


    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

    <div className="ltr:ml-16 ltr:md:ml-64 md:rtl:mr-64 min-h-screen bg-muted/50 py-10 px-6">

    <div className="flex gap-9">
    <h1 className="text-4xl font-bold mb-6">{t("MultidayTrips")}</h1>
    <Button onClick={openCreateModal}>{t("AddItem")}</Button>

    </div>
      


      

          <ul className="space-y-6">


            
          <div
    onClick={(e) => {
      const target = e.target as HTMLElement;
      const tripId = target?.closest('[data-trip-id]')?.getAttribute('data-trip-id');
      if (tripId) {
        const trip = myTrips.find(({ node }) => node.id === tripId)?.node;
        if (trip) {
          setViewingTrip(trip);
          setIsViewModalOpen(true);
        }
      }
    }}

    >
      <TripsListMulti
        trips={myTrips}
        onEditTrip={(trip) => openEditModal(trip)}
        onDeleteTrip={(id) => handleDelete(id)}
        onViewTrip={(trip) => {
          setViewingTrip(trip);
          setIsViewModalOpen(true);
        }}
      />

{myTrips.length === 0 && <p><NoItemsPage/></p>}




    </div>





          </ul>
          </div>

          {isViewModalOpen && viewingTrip && (
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingTrip.title}</DialogTitle>
            <DialogDescription>Multi-Day Trip Details</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <p><strong>Description:</strong> {viewingTrip.description}</p>
            <p><strong>Price:</strong> {viewingTrip.price}</p>
            <p><strong>Duration:</strong> {viewingTrip.durationDays} days</p>
            <p><strong>Group Size:</strong> {viewingTrip.groupSize}</p>
            <p><strong>Offer Type:</strong> {viewingTrip.offerType}</p>
            <p><strong>Common Questions:</strong> {viewingTrip?.commonQuestions?.[0]?.question}</p>
            <p><strong>Location Highlights:</strong> {viewingTrip?.visitLocationHighlights?.[0]?.title}</p>
            
        
            
            <p><strong>Tags:</strong> {viewingTrip.tags?.join(', ')}</p>

            {viewingTrip.thumbnailsBase64?.[0] && (
              <div>
                <strong>Thumbnail:</strong>
                <img
                  src={viewingTrip.thumbnailsBase64[0]}
                  alt="Thumbnail"
                  className="rounded w-full max-h-52 object-cover"
                />
              </div>
            )}

            {viewingTrip.cardThumbnail && (
              <div>
                <strong>Card Thumbnail:</strong>
                <img
                  src={viewingTrip.cardThumbnail}
                  alt="Card"
                  className="rounded w-full max-h-52 object-cover"
                />
              </div>
            )}

            <div>
              <strong>Program:</strong>
              <ul className="list-disc ml-5">
                {viewingTrip.program?.map((step, index) => (
                  <li key={index}>
                    Step {step.order}: Destination ID {step.destinationId}, Sub-Destinations: {step.subDestinationIds?.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingTrip ? 'Edit Trip' : 'Create New Trip'}
                    </h2>
                    <button
                      onClick={closeModal}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("TripTitle")} *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={t("TripTitle")}
                        />
                      </div>

                     


                      {/*file uploading thumbnails_base64 */}

















    <Select
  value={selectedProvince[0] || ''}  // take first if you want a single select
  onValueChange={(value) => setSelectedProvince([value])}
  
>
  <SelectTrigger className="mt-8 ">
    <SelectValue placeholder={t("SelectProvinces")} />
  </SelectTrigger>
  <SelectContent>
    {dataProvinces?.provinces?.edges.map(({ node }) => (
      <SelectItem key={node.id} value={node.id}>
        {node.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>



<MultiSelectDropdown
  options={gallery}
  value={selectedGallery}
  onChange={setSelectedGallery}
  placeholder={t("SelectGalleryImages")}
/>



<MultiSelectDropdown
  options={residence}
  value={selectedResidence}
  onChange={setSelectedResidence}
  placeholder={t("Residences")}
/>



<MultiSelectDropdown
  options={commonQuestions}
  value={selectedQuestion}
  onChange={setSelectedQuestion}
  placeholder={t("SelectQuestions")}
/>













<MultiSelectDropdown
  options={highlights}
  value={selectedHighlights}
  onChange={setSelectedHighlights}
  placeholder={t("SelectLocationHighlights")}
/>

                      


<MultiSelectDropdown
  options={tripContents}
  value={selectedTripContents}
  onChange={setSelectedTripContents}
  placeholder={t("SelectTripContent")}
/>




<MultiSelectDropdown
  options={subTypes}
  value={selectedSubs}
  onChange={setSelectedSubs}
  placeholder={t("SelectSubTypes")}
/>






















                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("DurationDays")} *
                        </label>
                        <input
                          type="number"
                          name="duration_days"
                          value={formData.duration_days}
                          onChange={handleInputChange}
                          required
                          min="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid gap-4">
                <label>Card Picture</label>
                  <div>
                    <Input type="file" accept="image/*"   onChange={(e) => handleFileUpload(e, setCardValue)} />
                    {thumbnailBase64Preview &&     <img
                          src={
                            formData.card_thumbnail_base64.startsWith("data:image")
                              ? formData.card_thumbnail_base64
                              : `${formData.card_thumbnail_base64}`
                          }
                          alt="Thumbnail preview" className="mt-2 rounded shadow" />}
                  </div>

                  <div>
                  <label>Thumbnail</label>
                    <Input type="file" accept="image/*"     onChange={(e) => handleFileUpload(e,  setThumbValue)}  />
                    {(Array.isArray(formData.thumbnails_base64) ? formData.thumbnails_base64 : [formData.thumbnails_base64])
  .filter(Boolean)
  .map(({ id, image }) => (
    <img key={id} src={image} alt="Thumbnail" className="mt-2 rounded shadow" />
  ))}

                  </div>
                </div>



                    </div>


                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("TripDescription")} *
                      </label>
                      <textarea
                        name="trip_description"
                        value={formData.trip_description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t("TripDescription")}
                      />
                    </div>

                    {/* Pricing and Group Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("Price")}
                        </label>
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., $299"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("GroupSize")}
                        </label>
                        <input
    type="text"
    name="groupSize"
    value={formData.groupSize}
    onChange={handleInputChange} // This should work now
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="e.g., 2-8 people"
  />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("OfferType")}
                        </label>
                        <input
                          type="text"
                          name="offer_type"
                          value={formData.offer_type}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., super , eid offer "
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("Tags")}
                      </label>
                      <input
                        type="text"
                        value={formData.tags.join(', ')}
                        onChange={handleTagsChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter tags separated by commas (e.g., History, Culture, Adventure)"
                      />
                    </div>

                




            




                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("Conditions")}
                        </label>
                        <input
      type="text"
      name="condition_text"
      value={formData.condition.condition_text}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          condition: {
            ...prev.condition,
            condition_text: e.target.value,
          },
        }))
      }
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder=          {t("Conditions")}
    />
    
                      </div>






                    <div className="space-y-6">
  {programSections.map((section, index) => {
    const destinationOptions =
      dataDestinations?.destinations?.edges.map(({ node }) => ({
        label: node.title,
        value: node.id,
      })) || [];

    const visitHighlightOptions =
      dataSubDestinations?.subDestinations?.edges
        .filter(({ node }) => node.destination?.id === section.destinationId)
        .map(({ node }) => ({
          label: node.title,
          value: node.id,
        })) || [];

    const activityOptions =
      dataActivities?.tripActivities?.edges.map(({ node }) => ({
        label: node.title,
        value: node.id,
      })) || [];

    return (
      <div key={index} className="p-4 border rounded-xl bg-white shadow">
        <h3 className="font-semibold mb-4 text-lg">{t("ProgramSteps")} {index + 1}</h3>

        {/* Title */}
        <input
          type="text"
          placeholder={t("TripTitle")}
          className="w-full mb-3 p-3 border rounded"
          value={section.title}
          onChange={(e) => updateProgramStep(index, 'title', e.target.value)}
        />

        {/* Sub-title */}
        <input
          type="text"
          placeholder={t("Subtitle")}
          className="w-full mb-3 p-3 border rounded"
          value={section.sub_title}
          onChange={(e) => updateProgramStep(index, 'sub_title', e.target.value)}
        />

        {/* Description */}
        <textarea
          placeholder={t("TripDescription")}
          className="w-full mb-3 p-3 border rounded"
          value={section.description}
          onChange={(e) => updateProgramStep(index, 'description', e.target.value)}
        />

        {/* Destination */}
        <label className="block text-sm font-medium mb-2">{t("Destinations")}</label>
        <MultiSelectDropdown
        options={destinationOptions}
        value={section.destinationId ? [section.destinationId] : []}
        onChange={(val) =>
          updateProgramStep(index, 'destinationId', val[0] || '')
        }
        placeholder={t("SelectDestination")}
      />

        {/* Visit Highlights */}
        {section.destinationId && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">{t("LocationHighlights")}</label>
            <MultiSelectDropdown
              options={visitHighlightOptions}
              value={section.visitHighlightIds || []}
              onChange={(val) => updateProgramStep(index, "visitHighlightIds", val)}
              placeholder={t("SelectLocationHighlights")}
            />
          </div>
        )}

        {/* Activities */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">{t("TripActivities")}</label>
          <MultiSelectDropdown
            options={activityOptions}
            value={section.activityIds}
            onChange={(val) => updateProgramStep(index, "activityIds", val)}
            placeholder={t("SelectTripActivities")}
          />
        </div>

        {/* Residence Name */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">{t("Residences")}</label>
          <MultiSelectDropdown
  options={
    dataResidence?.residences?.edges.map(({ node }) => ({
      label: node.title,
      value: node.title,
    })) || []
  }
  value={section.residence_name ? [section.residence_name] : []}
  onChange={(val) => updateProgramStep(index, "residence_name", val[0] || "")}
  placeholder={t("Residences")}
/>

        </div>
      </div>
    );
  })}

  {/* Add Program Step */}
  <div className="mt-6 flex justify-end gap-4">
    <button
      type="button"
      onClick={() =>
        setProgramSections((prev) => [
          ...prev,
          {
            title: "",
            sub_title: "",
            description: "",
            destinationId: "",
            subDestinationIds: [], 
            visitHighlightIds: [],
            activityIds: [],
            residence_name: "",
          },
        ])
      }
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      +{t("AddProgramStep")}
    </button>
    <button
                        type="button"
                        onClick={closeModal}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                    {t("Cancel")}
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Save size={20} />
                        {editingTrip ? t("EditItem") : t("CreateTrip")}
                      </button>
  </div>
                  
</div>




                  </div>
                </div>
              </div>
            )}
        
    </>

      );
    };

    export default MultiDayTripCRUD;