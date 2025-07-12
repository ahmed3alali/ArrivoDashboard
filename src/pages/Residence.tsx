import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Sidebar } from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";
import { ProgressLogic } from "@/components/ui/ProgressLogic";
import { t } from "i18next";

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

const CREATE_RESIDENCE = gql`
  mutation CreateResidence(
    $title: String!
    $location: String!
    $type: ResidenceTypeEnum!
    $thumbnailBase64: String
  ) {
    createResidence(
      title: $title
      location: $location
      type: $type
      thumbnailBase64: $thumbnailBase64
    ) {
      residence {
        id
        title
        location
        type
        thumbnail
      }
    }
  }
`;

const EDIT_RESIDENCE = gql`
  mutation EditResidence(
    $id: ID!
    $title: String
    $location: String
    $type: ResidenceTypeEnum
    $thumbnailBase64: String
  ) {
    editResidence(
      id: $id
      title: $title
      location: $location
      type: $type
      thumbnailBase64: $thumbnailBase64
    ) {
      residence {
        id
        title
        location
        type
        thumbnail
      }
    }
  }
`;

const DELETE_RESIDENCE = gql`
  mutation DeleteResidence($id: ID!) {
    deleteResidence(id: $id) {
      residenceId
    }
  }
`;
const residenceTypes = ["HOTEL", "HOSTEL", "GUESTHOUSE", "APARTMENT", "VILLA"];

export default function ResidenceCRUD() {
  const { data, loading, error, refetch } = useQuery(GET_RESIDENCES);
  const [createResidence] = useMutation(CREATE_RESIDENCE);
  const [editResidence] = useMutation(EDIT_RESIDENCE);
  const [deleteResidence] = useMutation(DELETE_RESIDENCE);

  const [form, setForm] = useState({
    id: null,
    title: "",
    location: "",
    type: residenceTypes[0],
    thumbnailBase64: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const resetForm = () =>
    setForm({
      id: null,
      title: "",
      location: "",
      type: residenceTypes[0],
      thumbnailBase64: "",
    });


    const backendUrl = import.meta.env.VITE_BACKEND_URL;
const backendMediaUrl = import.meta.env.VITE_BACKEND_URL_MEDIA;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Arabic and Latin letters only for text inputs
    if (["title", "location"].includes(name) && !/^[\u0621-\u064A\u0660-\u0669a-zA-Z0-9\s\-_,.()]{0,100}$/.test(value)) {
      toast({ title: "Error !", description: `${name} contains invalid characters` });
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Upload Failed", description: "Only Images Are Allowed." });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Large File!", description: "Max is 2,5 MB" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, thumbnailBase64: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const variables: any = {
        title: form.title.trim(),
        location: form.location.trim(),
        type: form.type,
      };

      if (form.thumbnailBase64.startsWith("data:image")) {
        variables.thumbnailBase64 = form.thumbnailBase64;
      }

      if (isEditing && form.id) {
        await editResidence({ variables: { id: form.id, ...variables } });
        toast({ title: "Sucess ! ", description: "Residence Updated Successfully " });
      } else {
        await createResidence({ variables });
        toast({ title: " Sucess!", description: "Residence Created Successfully" });
      }

      await refetch();
      resetForm();
      setIsEditing(false);
    } catch (err: any) {
      toast({ title: "Operation Failed!", description: "Please try again later" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this residence?")) return;

    try {
      await deleteResidence({ variables: { id } });
      toast({ title: " Success !", description: "Residence Deleted Sucessfully " });
      refetch();
    } catch (err: any) {
      toast({ title: "Failed ile!", description: "Residence Deletion Failed" });
    }
  };

  const startEdit = (residence: any) => {
    setForm({
      id: residence.id,
      title: residence.title,
      location: residence.location,
      type: residence.type,
      thumbnailBase64: residence.thumbnail || "",
    });
    setIsEditing(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ProgressLogic />
      </div>
    );
  }
  
  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }
  
  if (!data || !data.residences || !data.residences.edges) {
    return <p className="text-gray-500">No residence data available.</p>;
  }
  

  return (
    <>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="ltr:ml-16 ltr:md:ml-64 md:rtl:mr-64 min-h-screen bg-muted/50 py-10 px-6">
        <h1 className="text-2xl font-bold mb-4">{t("Residences")}</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 p-8 rounded-xl shadow-lg mb-10 mx-auto">
  <h2 className="text-2xl font-bold text-gray-800">
    {isEditing ? "Edit Residence" : "Create Residence"}
  </h2>

  <div>
    <label className="block mb-1 text-sm font-medium text-gray-600">
      {t("TitleSingle")}
    </label>
    <input
      type="text"
      name="title"
      value={form.title}
      onChange={handleChange}
      placeholder={t("TitleSingle")}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      required
    />
  </div>

  <div>
    <label className="block mb-1 text-sm font-medium text-gray-600">Location</label>
    <input
      type="text"
      name="location"
      value={form.location}
      onChange={handleChange}
      placeholder="Location"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      required
    />
  </div>

  <div>
    <label className="block mb-1 text-sm font-medium text-gray-600">Type</label>
    <select
      name="type"
      value={form.type}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      required
    >
      {residenceTypes.map((type) => (
        <option key={type}>{type}</option>
      ))}
    </select>
  </div>

  <div>
    <label className="block mb-1 text-sm font-medium text-gray-600">Thumbnail Image</label>
    <input
      type="file"
      accept="image/*"
      onChange={handleFileUpload}
      className="file-input file-input-bordered w-full"
    />
  </div>

  {form.thumbnailBase64 && (
    <div className="mt-2">
      <img
        src={
          form.thumbnailBase64.startsWith("data:image")
            ? form.thumbnailBase64
            : `${backendMediaUrl}/${form.thumbnailBase64}`
        }
        alt="Thumbnail preview"
        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
      />
    </div>
  )}

  <div className="flex justify-end gap-3 pt-4">
    {isEditing && (
      <button
        type="button"
        onClick={() => {
          setIsEditing(false);
          resetForm();
        }}
        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
      >
        Cancel
      </button>
    )}
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-6 py-2 rounded-lg bg-black text-white hover:bg-orange-500 transition disabled:opacity-50"
    >
      {isSubmitting ? "Saving..." : isEditing ? t("EditItem") : t("AddItem")}
    </button>
  </div>
</form>

        {/* Residence List */}
        <ul className="space-y-4 mb-10">
          {data.residences.edges.map(({ node }) => (
            <li key={node.id} className="p-4 border rounded flex justify-between items-center">
              <div className="flex items-center gap-4">
                {node.thumbnail && (
                  <img
                    src={`${backendMediaUrl}/${node.thumbnail}`}
                    className="w-16 h-16 object-cover rounded"
                    alt={node.title}
                  />
                )}
                <div>
                  <p className="font-semibold">{node.title}</p>
                  <p className="text-sm text-gray-500">{node.location}</p>
                  <p className="text-xs text-gray-400 uppercase">{node.type}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(node)} className="btn btn-sm btn-outline">
            {t("EditItem")}
                </button>
                <button onClick={() => handleDelete(node.id)} className="btn btn-sm btn-error">
                 {t("DeleteItem")}
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Form */}
       
      </div>
    </>
  );
}