import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { TripsList } from "@/components/TripsList";
import Select from 'react-select';
import { Sidebar } from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { ProgressLogic } from "@/components/ui/ProgressLogic";
import { t } from "i18next";


// Our one day trips avaliable in the DB 
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

// Edit mutation - update fields you want to allow editing
const EDIT_ONE_DAY_TRIP = gql`
  mutation EditOneDayTrip(
    $id: ID!
    $title: String
    $duration_hours: Int
    $trip_description: String
    $price: String
  ) {
    editOneDayTrip(
      id: $id
      title: $title
      duration_hours: $duration_hours
      trip_description: $trip_description
      price: $price
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

// Delete mutation (adjust if your schema differs)

const DELETE_ONE_DAY_TRIP = gql`
 mutation DeleteTrip($id: ID!) {
  deleteTrip(id: $id) {
    tripId
  }
}

`;

// for using it in the comboboxies 
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



function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
          aria-label="Close modal"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

export default function OneDayTripsPage() {
  const { data, loading, error, refetch } = useQuery(GET_ONE_DAY_TRIPS); // fetching one day trips 
  const { data: provincesData } = useQuery(GET_PROVINCES); // fetchinng provinces for comboboxes 
  const [editOneDayTrip] = useMutation(EDIT_ONE_DAY_TRIP); // editing one day trip
  const [deleteOneDayTrip] = useMutation(DELETE_ONE_DAY_TRIP); // deleting one day trip 

  const [editingTrip, setEditingTrip] = useState<any>(null); // temp state for editing trips 


  const navigate = useNavigate()



  const routerFunction = ()=>{

    navigate("/oneday-trip#one-day-trips");


  }

  const routerFunctionMain = ()=>{

    navigate("/oneday-trip");


  }


  const { control, handleSubmit, reset } = useForm({


    defaultValues: {
      title: "",
      provinceIds: "",
      province:"Istanbul",
      duration_hours: 1,
      trip_description: "",
      price: "",
    },
  });

  const toOptions = (edges: any, labelKey: string = "name") =>
    edges?.map(({ node }: any) => ({
      value: node.id,
      label: node[labelKey]
    })) || [];




  useEffect(() => {
    if (editingTrip) {
      reset({
        title: editingTrip.title || "",
        province: editingTrip.provinces?.[0]?.name,


        duration_hours: editingTrip.durationHours || 1,
        trip_description: editingTrip.description || "",
        price: editingTrip.price || "",
      });
    }
  }, [editingTrip, reset]);

  const onEditSubmit = async (values: any) => {
    try {
      await editOneDayTrip({
        variables: {
          id: editingTrip.id,
          title: values.title,
          duration_hours: Number(values.duration_hours),
          trip_description: values.trip_description,
          price: values.price,
        },
      });
      alert("Trip updated successfully");
      setEditingTrip(null);
      refetch();
    } catch (e) {
      console.error(e);
      alert("Failed to update trip");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("DeleteWarning"))) return;

    try {
      await deleteOneDayTrip({ variables: { id } });
      alert("Trip deleted");
      refetch();
    } catch (e) {
      console.error(e);
      alert("Failed to delete trip");
    }
  };


  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [collapsed, setCollapsed] = useState(false)

  {loading && (
    <div className="flex items-center m-auto w-56 justify-center min-h-screen">
<ProgressLogic />
</div>
)}
  if (error) return <p>Error loading trips: {error.message}</p>;

  const trips = data?.trips?.edges || [];

  return (

    <>


<Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

<div className="ltr:ml-16 ltr:md:ml-64 md:rtl:mr-64 min-h-screen bg-muted/50 py-10 px-6">
<div className="flex gap-9">
<h1 className="text-4xl font-bold mb-6">{t("OneDayTrips")}</h1>
<button
      onClick={routerFunctionMain}
      className="flex items-center gap-2 w-48 h-10 text-[10px]  ml-auto mr-8 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
    >
      <div className="flex elements m-auto gap-2">
      <Plus size={12} />
      <span >{t("CreateOneDayTrip")}</span>
      </div>

    </button>
</div>
  


      {trips.length === 0 && <p>No trips found.</p>}

      <ul className="space-y-6">


        <TripsList
          trips={trips}
          onEditTrip={routerFunction}
          onDeleteTrip={(id) => handleDelete(id)}
        />





        {/*
        
        
        
        
      
        {trips.map(({ node }: any) => (
          <li
            key={node.id}
            className="border p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <h2 className="text-xl font-semibold">{node.title}</h2>
              <p>Duration: {node.durationHours} hours</p>
              <p className="mt-1">{node.description}</p>
              <p className="mt-1">Price: {node.price || "-"}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingTrip(node)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(node.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
          
        ))}
            */}
      </ul>

      {/* Edit Modal */}
      {editingTrip && (
        <Modal onClose={() => setEditingTrip(null)}>
          <h2 className="text-2xl font-bold mb-4">Edit Trip: {editingTrip.title}</h2>

          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Title</label>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      {...field}
                      className={`w-full border px-3 py-2 rounded ${fieldState.error ? "border-red-500" : "border-gray-300"
                        }`}
                      type="text"
                      placeholder="Trip Title"
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Duration (hours)</label>
              <Controller
                name="duration_hours"
                control={control}
                rules={{
                  required: "Duration is required",
                  min: { value: 1, message: "Minimum is 1 hour" },
                  max: { value: 24, message: "Maximum is 24 hours" },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      {...field}
                      className={`w-full border px-3 py-2 rounded ${fieldState.error ? "border-red-500" : "border-gray-300"
                        }`}
                      type="number"
                      min={1}
                      max={24}
                      placeholder="Duration in hours"
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>


            <div>
              <label className="block mb-1 font-semibold">Province</label>
          <p>{editingTrip.provinces?.[0]?.name}</p>
            </div>


            <div>
              <label className="block mb-1 font-semibold">Change to Province</label>

              <Controller
                control={control}
                name="provinceIds"
                render={({ field }) => (
                  <Select
                    isMulti
                    options={toOptions(provincesData?.provinces?.edges)}
                    onChange={field.onChange}
                    placeholder="Select Provinces"
                  />
                )}
              />


            </div>

            <div>
              <label className="block mb-1 font-semibold">Description</label>
              <Controller
                name="trip_description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <textarea
                      {...field}
                      className={`w-full border px-3 py-2 rounded ${fieldState.error ? "border-red-500" : "border-gray-300"
                        }`}
                      rows={4}
                      placeholder="Trip Description"
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Price</label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    type="text"
                    placeholder="Price"
                  />
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingTrip(null)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
    </>
  );
}
