import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Select from "react-select";

import { toast } from "@/components/ui/use-toast";

import { Trip } from "@/types/Trip";
import { Sidebar } from "@/components/Sidebar";
import { ChevronDown, Terminal } from "lucide-react";
import { useLocation } from "react-router-dom";
import { t } from "i18next";
import { DashboardHeader } from "@/components/DashboardHeader";

// --- GraphQL Queries ---
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
    visitLocationHighlights(first: 5) {
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

            visitLocationHighlights {
            id
            title
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
            title
          }
          
          provinces{
            
            id
            name
          }
          

          contents {
  id
  title
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








// --- Mutation ---
const CREATE_ONE_DAY_TRIP = gql`
  mutation CreateOneDayTrip(
    $title: String!,
    $durationHours: Int!,
    $tripDescription: String!,
    $provinceIds: [ID!]!,
    $commonQuestionIds: [ID!]!,
    $visitLocationHighlightIds: [ID!]!,
    $contentIds: [ID!]!,
    $thumbnailBase64: String!,
    $activityIds: [ID!]!,
    $program: [OneDayProgramInput!]!,
    $exclusionIds: [ID!]!,
    $importantInfoIds: [ID!]!,
    $galleryImageIds: [ID],
    $tags: [String],
    $subTypeIds: [ID],
    $cardThumbnailBase64: String,
    $offerType: String,
    $price: String,
    $groupSize: String
  ) {
    createOneDayTrip(
      title: $title,
      durationHours: $durationHours,
      tripDescription: $tripDescription,
      provinceIds: $provinceIds,
      commonQuestionIds: $commonQuestionIds,
      visitLocationHighlightIds: $visitLocationHighlightIds,
      contentIds: $contentIds,
      thumbnailBase64: $thumbnailBase64,
      activityIds: $activityIds,
      program: $program,
      exclusionIds: $exclusionIds,
      importantInfoIds: $importantInfoIds,
      galleryImageIds: $galleryImageIds,
      tags: $tags,
      subTypeIds: $subTypeIds,
      cardThumbnailBase64: $cardThumbnailBase64,
      offerType: $offerType,
      price: $price,
      groupSize: $groupSize
    ) {
      oneDayTrip {
        id
        title
        description
        durationHours
      }
    }
  }
`;



// --- Mutation ---
const EDIT_ONE_DAY_TRIP = gql`
  mutation EditOneDayTrip(
    $id: ID!,     
    $title: String!,
    $durationHours: Int!,
    $tripDescription: String!,
    $provinceIds: [ID!]!,
    $commonQuestionIds: [ID!]!,
    $visitLocationHighlightIds: [ID!]!,
    $contentIds: [ID!]!,
    $thumbnailBase64: String!,
    $activityIds: [ID!]!,
    $program: [OneDayProgramInput!]!,
    $exclusionIds: [ID!]!,
    $importantInfoIds: [ID!]!,
    $galleryImageIds: [ID],
    $tags: [String],
    $subTypeIds: [ID],
    $cardThumbnailBase64: String,
    $offerType: String,
    $price: String,
    $groupSize: String
  ) {
    editOneDayTrip(
      id: $id,
      title: $title,
      durationHours: $durationHours,
      tripDescription: $tripDescription,
      provinceIds: $provinceIds,
      commonQuestionIds: $commonQuestionIds,
      visitLocationHighlightIds: $visitLocationHighlightIds,
      contentIds: $contentIds,
      thumbnailBase64: $thumbnailBase64,
      activityIds: $activityIds,
      program: $program,
      exclusionIds: $exclusionIds,
      importantInfoIds: $importantInfoIds,
      galleryImageIds: $galleryImageIds,
      tags: $tags,
      subTypeIds: $subTypeIds,
      cardThumbnailBase64: $cardThumbnailBase64,
      offerType: $offerType,
      price: $price,
      groupSize: $groupSize
    ) {
      oneDayTrip {
        id
        title
        description
        durationHours
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


type Option = {
  value: string;
  label: string;
};


const CreateOneDayTripPage = () => {
  const { control, handleSubmit, register, setValue } = useForm();
  const [createTrip] = useMutation(CREATE_ONE_DAY_TRIP);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
const backendMediaUrl = import.meta.env.VITE_BACKEND_URL_MEDIA;




  // Queries
  const { data: provincesData } = useQuery(GET_PROVINCES);
  const { data, loading, error, refetch } = useQuery(GET_ONE_DAY_TRIPS); // fetching one day trips 
  const { data: highlightsData } = useQuery(GET_VISIT_LOCATION_HIGHLIGHTS);
  const { data: contentsData } = useQuery(GET_TRIP_CONTENTS);
  const { data: activitiesData } = useQuery(GET_TRIP_ACTIVITIES);
  const { data: infosData } = useQuery(GET_IMPORTANT_INFOS);
  const { data: exclusionsData } = useQuery(GET_EXCLUSIONS);
  const { data: galleryImagesData } = useQuery(GET_GALLERY_IMAGES);
  const [iconBase64, setIconBase64] = useState("");
  const [thumbnailBase64Preview, setThumbnailBase64Preview] = useState("");
  const [cardThumbnailBase64Preview, setCardThumbnailBase64Preview] = useState("");
  const { data: subTypesData } = useQuery(GET_SUB_TYPES);
  const { data: destinationsData } = useQuery(GET_DESTINATIONS);
  const { data: subDestinationsData } = useQuery(GET_SUB_DESTINATIONS);
  const { data: commonQuestionsData } = useQuery(GET_COMMON_QUESTIONS);
  const [editTrip] = useMutation(EDIT_ONE_DAY_TRIP);
  const [originalTrip, setOriginalTrip] = useState(null); // Add this at the top

  const multilingualPattern = /^[A-Za-z0-9\u0600-\u06FFçÇğĞıİöÖşŞüÜ .,!?\-()]+$/u;


  // Initialize program in react-hook-form
  const [program, setProgram] = useState([
    { order: 1, destinationId: "", subDestinationIds: [] }
  ]);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);


  // Set initial program value in form
  React.useEffect(() => {
    setValue("program", program);
  }, [program, setValue]);

  const addProgramStep = () => {
    const newProgram = [
      ...program,
      { order: program.length + 1, destinationId: "", subDestinationIds: [] }
    ];
    setProgram(newProgram);
    setValue("program", newProgram); // Update form value immediately
  };

  // Function to update a program step
  const updateProgramStep = (index, key, value) => {
    const newProgram = [...program];
    newProgram[index][key] = value;
    setProgram(newProgram);
    setValue("program", newProgram); // Update form value immediately
  };


  // Function to remove a program step
  const removeProgramStep = (index) => {
    const newProgram = program.filter((_, i) => i !== index);
    // Reorder the remaining steps
    const reorderedProgram = newProgram.map((step, i) => ({
      ...step,
      order: i + 1
    }));
    setProgram(reorderedProgram);
    setValue("program", reorderedProgram);
  };




  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  const fetchImageAsBase64 = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const buildProgramInput = (formProgram, dbProgram) => {
    return formProgram.map((step, i) => {
      const dbStep = dbProgram[i] || {};

      return {
        order: step.order,
        destinationId: step.destinationId || dbStep.destination?.id,
        subDestinationIds:
          step.subDestinationIds?.length > 0
            ? step.subDestinationIds
            : dbStep.subDestinations?.edges?.map(({ node }) => node.id) || [],
      };
    });
  };


  const isMissing = (value: any): boolean =>
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);
  

    const onSubmit = async (values: any) => {
      console.log("Program being sent:", values.program);
    
      try {
        const validateArray = (val: any) => Array.isArray(val) && val.length > 0;
        const validateString = (val: any) => typeof val === "string" && val.trim() !== "";
    
        const toastError = (fieldName: string) =>
          toast({
            variant: "destructive",
            title: "Invalid Input",
            description: `${fieldName} has invalid or malicious value.`,
          });
    
        if (editingTripId) {
          const cleanedProgram = buildProgramInput(values.program, originalTrip.programSections);
    
          // 🔐 Security check: optional but critical fields — prevent update if invalid type
          const optionalFieldChecks = [
            [values.offerType, validateString, "Offer Type"],
            [values.tags, Array.isArray, "Tags"],
            [values.galleryImageIds, Array.isArray, "Gallery Images"],
            [values.subTypeIds, Array.isArray, "Sub Types"]
          ];
    
          for (const [field, validator, name] of optionalFieldChecks) {
            if (field != null && !validator(field)) {
              toastError(name);
              return;
            }
          }
    
          // ✅ Required field fallback check
          const getFallback = (field: any, fallback: any) => isMissing(field) ? fallback : field;
          const validateOrFallback = (field: any, fallback: any, name: string) => {
            const val = getFallback(field, fallback);
            if (isMissing(val)) {
              toast({
                variant: "destructive",
                title: "Alert",
                description: `${name} is missing! Please contact developer.`,
              });

              return false;
            }
            return true;
          };
    
          const isValid = [
            validateOrFallback(values.title, originalTrip.title, "Title"),
            validateOrFallback(values.durationHours, originalTrip.durationHours, "Duration"),
            validateOrFallback(values.tripDescription, originalTrip.tripDescription, "Description"),
            validateOrFallback(values.provinceIds, originalTrip.provinceIds, "Provinces"),
            validateOrFallback(values.commonQuestionIds, originalTrip.commonQuestionIds, "Common Questions"),
            validateOrFallback(values.visitLocationHighlightIds, originalTrip.visitLocationHighlightIds, "Highlights"),
            validateOrFallback(values.contentIds, originalTrip.contentIds, "Contents"),
            validateOrFallback(values.activityIds, originalTrip.activityIds, "Activities"),
            validateOrFallback(values.exclusionIds, originalTrip.exclusionIds, "Exclusions"),
            validateOrFallback(values.importantInfos, originalTrip.importantInfos, "Important Infos"),
            validateOrFallback(values.thumbnailBase64, originalTrip.thumbnailBase64, "Thumbnail"),
            validateOrFallback(values.cardThumbnailBase64, originalTrip.cardThumbnailBase64, "Card Thumbnail"),
          ].every(Boolean);
    
    
        
    
          await editTrip({
            variables: {
              id: editingTripId,
              title: values.title,
              durationHours: Number(values.durationHours),
              tripDescription: values.tripDescription,
              price: values.price,
              groupSize:values.groupSize,
    
              offerType: values.offerType,
              tags: values.tags,
    
              provinceIds: values.provinceIds?.map((opt: any) => opt.value) || [],
              commonQuestionIds: values.commonQuestionIds?.map((opt: any) => opt.value) || [],
              visitLocationHighlightIds: values.visitLocationHighlightIds?.map((opt: any) => opt.value) || [],
              contentIds: values.contentIds?.map((opt: any) => opt.value) || [],
              activityIds: values.activityIds?.map((opt: any) => opt.value) || [],
              exclusionIds: values.exclusionIds?.map((opt: any) => opt.value) || [],
              importantInfoIds: values.importantInfoIds?.map((opt: any) => opt.value) || [],
              galleryImageIds: values.galleryImageIds?.map((opt: any) => opt.value) || [],
              subTypeIds: values.subTypeIds?.map((opt: any) => opt.value) || [],
    
              thumbnailBase64: values.thumbnailBase64,
              cardThumbnailBase64: values.cardThumbnailBase64,
    
              program: cleanedProgram
            }
          });
    
          toast({
            variant: "default",
            title: "Trip Updated",
            description: "The trip was successfully updated.",
          });
          
          setEditingTripId(null);
        } else {
          // ✅ Create flow validation
          if (
            isMissing(values.title) ||
            isMissing(values.durationHours) ||
            isMissing(values.tripDescription) ||
            isMissing(values.provinceIds) ||
            isMissing(values.commonQuestionIds) ||
            isMissing(values.visitLocationHighlightIds) ||
            isMissing(values.contentIds) ||
            isMissing(values.activityIds) ||
            isMissing(values.exclusionIds) ||
            isMissing(values.importantInfoIds) ||
            isMissing(values.subTypeIds) ||
            isMissing(values.thumbnailBase64) ||
            isMissing(values.cardThumbnailBase64) ||
            !values.program || values.program.length === 0 ||
            values.program.some(p => isMissing(p.destinationId))
          ) {
            toast({
              variant: "destructive",
              title: "Error Creating Trip",
              description: "Please fill all forms / upload all photos!",
            });
            return;
          }
    
          await createTrip({
            variables: {
              title: values.title,
              durationHours: Number(values.durationHours),
              tripDescription: values.tripDescription,
              price: values.price,
              groupSize: String(values.groupSize),
              offerType: values.offerType,
              tags: values.tags,
    
              provinceIds: values.provinceIds?.map((opt: any) => opt.value) || [],
              commonQuestionIds: values.commonQuestionIds?.map((opt: any) => opt.value) || [],
              visitLocationHighlightIds: values.visitLocationHighlightIds?.map((opt: any) => opt.value) || [],
              contentIds: values.contentIds?.map((opt: any) => opt.value) || [],
              activityIds: values.activityIds?.map((opt: any) => opt.value) || [],
              exclusionIds: values.exclusionIds?.map((opt: any) => opt.value) || [],
              importantInfoIds: values.importantInfoIds?.map((opt: any) => opt.value) || [],
              galleryImageIds: values.galleryImageIds?.map((opt: any) => opt.value) || [],
              subTypeIds: values.subTypeIds?.map((opt: any) => opt.value) || [],
    
              ...(values.thumbnailBase64 && { thumbnailBase64: values.thumbnailBase64 }),
              ...(values.cardThumbnailBase64 && { cardThumbnailBase64: values.cardThumbnailBase64 }),
    
              program: values.program || []
            }
          });
    
      
          toast({
            variant: "default",
            title: t("Success"),
            description: t("AddedSuccessfully"),
          });
          
        }
    
        refetch();

        setTimeout(() => {
          window.location.reload(); // or hard refresh with window.location.href = window.location.href
        }, 2000); // 2 seconds
        

      } catch (e) {
        console.error(e);
        alert(`Error ${editingTripId ? "updating" : "creating"} trip`);
        console.log(values.thumbnailBase64);
      }
    };
    


  const toOptions = (edges: any, labelKey: string = "name") =>
    edges?.map(({ node }: any) => ({
      value: node.id,
      label: node[labelKey]
    })) || [];




  const MAX_FILE_SIZE_MB = 2.5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "thumbnailBase64" | "cardThumbnailBase64",
    setPreview: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(`File too large! Please select a file smaller than ${MAX_FILE_SIZE_MB} MB.`);
      e.target.value = ""; // clear the file input
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setValue(fieldName, base64String);
      setPreview(base64String);
    };
    reader.readAsDataURL(file);
  };


  const [deleteTrip] = useMutation(DELETE_TRIP);

  const handleDeleteTrip = async (id: string) => {
    if (confirm(t("DeleteWarning"))) {
      try {
        await deleteTrip({ variables: { id } });
  
        // ✅ Show success toast
        toast({
          variant: "default",
          title: "Trip Deleted",
          description: "The trip was successfully deleted. Please Wait....",
        });
  
        // ✅ Delay then hard refresh
        setTimeout(() => {
          window.location.reload();
        }, 2000); // 2 seconds
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete the trip.",
        });
        console.error(err);
      }
    }
  };
  

  // Optional: you can add a state like const [editingTripId, setEditingTripId] = useState<string | null>(null);

  const handleEditTrip = async (trip) => {
    setOriginalTrip(trip); // 👈 store the trip in state
    setValue("title", trip.title);

    setValue("tripDescription", trip.description);
    setValue("durationHours", trip.durationHours);
    setValue("price", trip.price);
    setValue("groupSize", trip.groupSize);
    setValue("offerType", trip.offerType);
    setValue("tags", trip.tags || []);
    setValue("program", trip.programSections)

    // Select fields
    setValue("provinceIds", trip.provinces.map((p) => ({ value: p.id, label: p.name })));
    if (activitiesData?.tripActivities?.edges?.length) {
      setValue(
        "activityIds",
        trip.activities.map((a) => {
          const option = activitiesData.tripActivities.edges.find(({ node }) => node.id === a.id);
          return {
            value: a.id,
            label: option?.node.title || a.title  // fallback if data isn’t matched
          };
        })
      );
    }



    if (commonQuestionsData?.commonQuestions?.edges?.length) {
      setValue(
        "commonQuestionIds",
        trip.commonQuestions.map((q) => {
          const option = commonQuestionsData.commonQuestions.edges.find(({ node }) => node.id === q.id);
          return {
            value: q.id,
            label: option?.node.question || q.question // fallback
          };
        })
      );
    }

    setValue("galleryImageIds", trip.galleryImages.map((p) => ({ value: p.id, label: p.title })));

   



    setValue("subTypeId", trip.galleryImages.map((p) => ({ value: p.id, label: p.title })));



    // Show previews
    if (trip.thumbnail) {
      const url = `${backendMediaUrl}/${trip.thumbnail}`;
      setThumbnailBase64Preview(url);

      // 💡 Fetch as base64 because backend requires it
      const base64 = await fetchImageAsBase64(url);
      setValue("thumbnailBase64", base64);
    }

    if (trip.cardThumbnail) {
      const url = `${backendMediaUrl}/${trip.cardThumbnail}`;
      setCardThumbnailBase64Preview(url);

      const base64 = await fetchImageAsBase64(url);
      setValue("cardThumbnailBase64", base64);
    }

    setEditingTripId(trip.id);
  };


  const [activeView, setActiveView] = useState<'trips' | 'oneDay-trip'>('trips');
  const [trips, setTrips] = useState<Trip[]>([]);


  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
    <DashboardHeader 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="ltr:ml-16 md:ltr:ml-64 md:rtl:mr-64 min-h-screen bg-muted/50 py-10 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <div className="flex ">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t("CreateOneDayTrip")}</h1>
            <button className="flex px-3  rtl:mr-5 ltr:ml-5  items-center gap-2 bg-black rounded text-white  hover:underline focus:outline-none ml-auto"   onClick={() =>
    document.getElementById("one-day-trips")?.scrollIntoView({ behavior: "smooth" })
  }>
      <ChevronDown size={18} />
      <span>{t("ViewAll1DayTrips")}</span>
    </button>
            </div>
         
          
            <p className="text-muted-foreground">{t("OneTripCrudInfo")}</p>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">



                  <Input   {...register("title", {
                    required: "Title is required",
                    pattern: {
                      value: multilingualPattern, // only letters, numbers & common symbols
                      message: "Invalid characters in title",
                    },
                  })} placeholder={t("TripTitle")} />




                  <Input   {...register("tags", {
  
    pattern: {
      value: multilingualPattern, // only letters, numbers & common symbols
      message: "Invalid characters in tags field",
    },
})} placeholder={t("Tags")} />



                  <Input type="number"
                    {...register("durationHours", {
                      required: "Duration is required",
                      min: { value: 1, message: "Must be at least 1 hour" },
                      max: { value: 24, message: "Cannot exceed 24 hours" }
                    })} placeholder={t("Hours")}/>



                  <Input type="number"   {...register("price", {
                      required: "Price of trip is required",
                      min: { value: 1, message: "Must be at least 1 USD/TL" },
                  
                    })} placeholder={t("Price")} />


                  <Input type="number"   {...register("groupSize", {
                  
                      min: { value: 1, message: "Min trip group size is at least 1 person" },
                   
                    })} placeholder={t("GroupSize")}/>





                  <Input   {...register("offerType", {
             
                    pattern: {
                      value: multilingualPattern, // only letters, numbers & common symbols
                      message: "Invalid characters in Offer Type",
                    },
                  })} placeholder={t("OfferType")}  />
                </div>




                <Textarea   {...register("tripDescription", {
                    required: "Trip description is required",
                    pattern: {
                      value: multilingualPattern, // only letters, numbers & common symbols
                      message: "Invalid characters in trip description",
                    },
                  })} placeholder={t("TripDescription")} />














                <div className="space-y-4">
                 

                  <Controller name="galleryImageIds" control={control} render={({ field }) => (
                    <Select isMulti value={field.value} options={toOptions(galleryImagesData?.galleryImages?.edges, "title")} onChange={field.onChange} placeholder={t("SelectGalleryImages")} />
                  )} />


             
<Controller
  control={control}
  name="commonQuestionIds"
  rules={{ required: t("ImportantField") }}
  render={({ field, fieldState }) => (
    <>
      <Select
        isMulti
        value={field.value}
        onChange={field.onChange}
        options={toOptions(commonQuestionsData?.commonQuestions?.edges, "question")}
        placeholder={t("SelectQuestions")}
      />
      {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
    </>
  )}
/>



<Controller
  control={control}
  name="provinceIds"
  rules={{ required: t("ImportantField") }}
  render={({ field, fieldState }) => (
    <>
      <Select
        isMulti
        value={field.value}
        onChange={field.onChange}
        options={toOptions(provincesData?.provinces?.edges)}
        placeholder={t("SelectProvinces")}
      />
      {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
    </>
  )}
/>


<Controller
  control={control}
  name="visitLocationHighlightIds"

  render={({ field, fieldState }) => (
    <>
      <Select
        isMulti
        value={field.value}
        onChange={field.onChange}
        options={toOptions(highlightsData?.visitLocationHighlights?.edges, "title")}
        placeholder={t("SelectLocationHighlights")}
      />
      {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
    </>
  )}
/>




<Controller
  control={control}
  name="contentIds"

  render={({ field, fieldState }) => (
    <>
      <Select
        isMulti
        value={field.value}
        onChange={field.onChange}
        options={toOptions(contentsData?.tripContents?.edges, "title")}
        placeholder={t("SelectTripContent")}
      />
      {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
    </>
  )}
/>




<Controller
  control={control}
  name="activityIds"
  rules={{ required: t("ImportantField") }}
  render={({ field, fieldState }) => (
    <>
      <Select
        isMulti
        value={field.value}
        onChange={field.onChange}
        options={toOptions(activitiesData?.tripActivities?.edges, "title")}
        placeholder={t("SelectTripActivities")}
      />
      {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
    </>
  )}
/>


<Controller
  control={control}
  name="importantInfoIds"
  
  render={({ field, fieldState }) => (
    <>
      <Select
        isMulti
        value={field.value}
        onChange={field.onChange}
        options={toOptions(infosData?.tripImportantInfos?.edges, "title")}
        placeholder={t("SelectImportantInfo")}
      />
      {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
    </>
  )}
/>




<Controller
  control={control}
  name="exclusionIds"

  render={({ field, fieldState }) => (
    <>
      <Select
        isMulti
        value={field.value}
        onChange={field.onChange}
        options={toOptions(exclusionsData?.tripExclusions?.edges, "title")}
        placeholder={t("SelectTripExclusions")}
      />
      {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
    </>
  )}
/>


             
            

             

                  <Controller name="subTypeIds" control={control} render={({ field }) => (
                    <Select isMulti value={field.value} options={toOptions(subTypesData?.tripSubTypes?.edges, "type")} onChange={field.onChange} placeholder={t("SelectSubTypes")} />
                  )} />
                </div>

                {/* Image Uploads */}
                <div className="grid md:grid-cols-2 gap-4 items-start">
                  <div>
                    <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "thumbnailBase64", setThumbnailBase64Preview)} />
                    {thumbnailBase64Preview && <img src={thumbnailBase64Preview} alt="Thumbnail" className="mt-2 rounded shadow" />}
                  </div>

                  <div>
                    <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "cardThumbnailBase64", setCardThumbnailBase64Preview)} />
                    {cardThumbnailBase64Preview && <img src={cardThumbnailBase64Preview} alt="Card Thumbnail" className="mt-2 rounded shadow" />}
                  </div>
                </div>

                <input type="hidden" {...register("thumbnailBase64")} />
                <input type="hidden" {...register("cardThumbnailBase64")} />

                {/* Program Steps */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t("ProgramSteps")}</h3>
                  {program.map((step, index) => (
                    <div key={index} className="border rounded p-4 space-y-3 bg-background">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{t("Step")} {index + 1}</p>
                        {program.length > 1 && (
                          <Button type="button" variant="destructive" size="sm" onClick={() => removeProgramStep(index)}>{t("Remove")}</Button>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">{t("Destinations")}</label>
                        <Select
                          options={toOptions(destinationsData?.destinations?.edges, "title")}
                          value={step.destinationId ? {
                            value: step.destinationId,
                            label: destinationsData?.destinations?.edges?.find(({ node }) => node.id === step.destinationId)?.node.title || ""
                          } : null}
                          onChange={(opt) => updateProgramStep(index, "destinationId", opt ? opt.value : "")}
                          placeholder={t("SelectDestination")}
                          isClearable
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">{t("SelectSubDestination")}</label>
                        <Select
                          isMulti
                          options={
                            subDestinationsData?.subDestinations?.edges
                              ?.filter(({ node }) => node.destination?.id === step.destinationId)
                              ?.map(({ node }) => ({ value: node.id, label: node.title })) || []
                          }
                          value={
                            step.subDestinationIds?.map(id => {
                              const match = subDestinationsData?.subDestinations?.edges?.find(({ node }) => node.id === id);
                              return { value: id, label: match?.node.title || "" };
                            }) || []
                          }
                          onChange={(opts) => updateProgramStep(index, "subDestinationIds", opts?.map(o => o.value) || [])}
                          placeholder={step.destinationId ? t("SelectSubDestination") : t("SelectDestinationFirst")}
                          isDisabled={!step.destinationId}
                        />
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addProgramStep}>
                   {t("AddProgramStep")}
                  </Button>
                </div>

                <Button type="submit" className="w-full">{t("CreateTrip")}</Button>
              </form>
            </CardContent>
          </Card>

          {/* Trip List */}

          
          {data?.trips?.edges.map(({ node: trip }) => (




            <Card key={trip.id} className="mt-6 shadow-md" id="one-day-trips">
              <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{trip.title}</h3>
                  <p>{trip.description}</p>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {trip.tags && <p><strong>Tags:</strong> {trip.tags}</p>}
                  {trip.durationHours && <p><strong>Duration:</strong> {trip.durationHours} hours</p>}
                  {trip.price && <p><strong>Price:</strong> ${trip.price}</p>}
                  {trip.groupSize && <p><strong>Group Size:</strong> {trip.groupSize}</p>}
                  {trip.offerType && <p><strong>Offer Type:</strong> {trip.offerType}</p>}
                </div>

                {/* Thumbnails */}
                <div className="flex gap-4 mt-2">
                  {trip.thumbnail && (
                    <div>
                      <p className="text-xs mb-1">Thumbnail</p>
                      <img src={`${backendMediaUrl}/${trip.thumbnail}`} alt="Thumbnail" className="w-32 h-32 object-cover rounded shadow" />
                    </div>
                  )}
                  {trip.cardThumbnail && (
                    <div>
                      <p className="text-xs mb-1">Card Thumbnail</p>
                      <img src={`${backendMediaUrl}/${trip.cardThumbnail}`} alt="Card Thumbnail" className="w-32 h-32 object-cover rounded shadow" />
                    </div>
                  )}
                </div>

                {/* Lists (optional chaining for safety) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trip.commonQuestions?.length > 0 && (
                    <div>
                      <p className="font-medium text-foreground mb-1">Common Questions:</p>
                      <ul className="list-disc list-inside">
                        {trip.commonQuestions.map(q => <li key={q.id}>{q.question}</li>)}
                      </ul>
                    </div>
                  )}

                  {trip.contents?.length > 0 && (
                    <div>
                      <p className="font-medium text-foreground mb-1">Contents:</p>
                      <ul className="list-disc list-inside">
                        {trip.contents.map(c => <li key={c.id}>{c.title}</li>)}
                      </ul>
                    </div>
                  )}

                  {trip.activities?.length > 0 && (
                    <div>
                      <p className="font-medium text-foreground mb-1">Activities:</p>
                      <ul className="list-disc list-inside">
                        {trip.activities.map(a => <li key={a.id}>{a.title}</li>)}
                      </ul>
                    </div>
                  )}


{trip.provinces?.length > 0 && (
                    <div>
                      <p className="font-medium text-foreground mb-1">Provinces:</p>
                      <ul className="list-disc list-inside">
                        {trip.provinces.map(a => <li key={a.id}>{a.name}</li>)}
                      </ul>
                    </div>
                  )}



{trip.visitLocationHighlights?.length > 0 && (
                    <div>
                      <p className="font-medium text-foreground mb-1">Location Highlights:</p>
                      <ul className="list-disc list-inside">
                        {trip.visitLocationHighlights.map(a => <li key={a.id}>{a.title}</li>)}
                      </ul>
                    </div>
                  )}

{Array.isArray(trip.contents) && trip.contents.length > 0 && (
  <div>
    <p className="font-medium text-foreground mb-1">Trip Content:</p>
    <ul className="list-disc list-inside">
      {trip.contents.map(a => (
        <li key={a.id}>{a.title}</li>
      ))}
    </ul>
  </div>
)}






                  {trip.exclusions?.length > 0 && (
                    <div>
                      <p className="font-medium text-foreground mb-1">Exclusions:</p>
                      <ul className="list-disc list-inside">
                        {trip.exclusions.map(e => <li key={e.id}>{e.title}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Gallery Images */}
                {trip.galleryImages?.length > 0 && (
                  <div>
                    <p className="font-medium text-foreground mb-2">Gallery Images:</p>
                    <div className="flex gap-2 flex-wrap">
                      {trip.galleryImages.map((img) => (
                        <img
                          key={img.id}
                          src={`${backendMediaUrl}/${img.picture}`}
                          alt={img.title}
                          className="w-24 h-24 object-cover rounded shadow"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button variant="secondary" onClick={() => handleEditTrip(trip)}>{t("Edit")}</Button>
                  <Button variant="destructive" onClick={() => handleDeleteTrip(trip.id)}>{t("Delete")}</Button>
                </div>
              </CardContent>
            </Card>
          ))}

        </div>
      </div>
    </>
  );
}

export default CreateOneDayTripPage;
