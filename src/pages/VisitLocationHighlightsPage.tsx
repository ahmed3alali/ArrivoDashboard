import React, { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Send, Pencil } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

import { toast } from "sonner"; // or "react-hot-toast"
import { ProgressLogic } from "@/components/ui/ProgressLogic";
import { t } from "i18next";
import { DashboardHeader } from "@/components/DashboardHeader";
import LoaderExternal from "@/components/ui/Loader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import NoItemsPage from "@/components/ui/NoItemsPage";


// GraphQL queries & mutations
const GET_VISIT_LOCATION_HIGHLIGHTS = gql`
  query {
    visitLocationHighlights(first: 5) {
      edges {
        node {
          id
          title
          thumbnail
        }
      }
    }
  }
`;

const CREATE_VISIT_LOCATION_HIGHLIGHT = gql`
  mutation CreateVisitLocationHighlight(
    $title: String!
    $thumbnailBase64: String!
    $tags: [String!]
  ) {
    createVisitLocationHighlight(
      title: $title
      thumbnailBase64: $thumbnailBase64
      tags: $tags
    ) {
      visitLocationHighlight {
        id
        title
      }
    }
  }
`;

const EDIT_VISIT_LOCATION_HIGHLIGHT = gql`
  mutation EditVisitLocationHighlight(
    $id: ID!
    $title: String
    $thumbnailBase64: String
    $tags: [String!]
  ) {
    editVisitLocationHighlight(
      id: $id
      title: $title
      thumbnailBase64: $thumbnailBase64
      tags: $tags
    ) {
      visitLocationHighlight {
        id
        title
      }
    }
  }
`;

const DELETE_VISIT_LOCATION_HIGHLIGHT = gql`
  mutation DeleteVisitLocationHighlight($id: ID!) {
    deleteVisitLocationHighlight(id: $id) {
      visitLocationHighlightId
    }
  }
`;





const backendUrl = import.meta.env.VITE_BACKEND_URL;
const backendMediaUrl = import.meta.env.VITE_BACKEND_URL_MEDIA;



export default function VisitLocationHighlightsPage() {
  const { data, loading, error, refetch } = useQuery(GET_VISIT_LOCATION_HIGHLIGHTS);
  const [createHighlight] = useMutation(CREATE_VISIT_LOCATION_HIGHLIGHT);
  const [editHighlight] = useMutation(EDIT_VISIT_LOCATION_HIGHLIGHT);
  const [deleteHighlight] = useMutation(DELETE_VISIT_LOCATION_HIGHLIGHT);

  const [title, setTitle] = useState("");
  const [thumbnailBase64, setThumbnailBase64] = useState("");
  const [tags, setTags] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const resetForm = () => {
    setTitle("");
    setThumbnailBase64("");
    setTags("");
    setEditingId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateOrEdit = async () => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    const trimmedTitle = title.trim();
    const tagArray = tags.split(",").map((t) => t.trim()).filter(Boolean);

    const isDuplicate =
      data?.visitLocationHighlights?.edges.some(
        ({ node }: any) =>
          node.title.trim().toLowerCase() === trimmedTitle.toLowerCase() &&
          (!editingId || node.id !== editingId)
      );

    if (isDuplicate) {
      toast.error("A highlight with this title already exists.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        await editHighlight({
          variables: {
            id: editingId,
            title: trimmedTitle,
            thumbnailBase64: thumbnailBase64 || undefined,
            tags: tagArray.length ? tagArray : undefined,
          },
        });
        toast.success("Highlight updated successfully!");
      } else {
        await createHighlight({
          variables: {
            title: trimmedTitle,
            thumbnailBase64,
            tags: tagArray,
          },
        });
        toast.success("Highlight created successfully!");
      }

      await refetch();
      resetForm();
    } catch (err) {
      console.error("Mutation error:", err);
      toast.error("Operation failed. Please try again.");
      alert("Operation failed.");
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this highlight?")) return;

    try {
      await deleteHighlight({ variables: { id } });
      toast.success("Highlight deleted.");
      await refetch();
    } catch (e) {
      console.error("Delete failed", e);
      toast.error("Failed to delete the highlight.");
      alert("Failed to delete.");
    }
  };

  const startEditing = (node: any) => {
    setEditingId(node.id);
    setTitle(node.title);
    setThumbnailBase64("");
    setTags(""); // Optional: you can pre-fill tags if needed
  };

  const getImageSrc = (thumbnail: string) => {
    if (!thumbnail) return "";
    return thumbnail.startsWith("http") ? thumbnail : `${backendMediaUrl}/${thumbnail}`;
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>

<DashboardHeader 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />




      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="ltr:ml-16 ltr:md:ml-64 md:rtl:mr-64 min-h-screen bg-muted/50 py-10 px-6">
        <h1 className="text-2xl font-bold mb-4">{t("LocationHighlights")}</h1>

        {/* Form Section */}
        <div className="space-y-2 mb-6">
          <Input
            placeholder={t("TitleSingle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input type="file" accept="image/*" onChange={handleFileUpload} />

          {thumbnailBase64 && (
            <img
              src={thumbnailBase64}
              alt="Preview"
              className="w-32 h-32 object-cover rounded"
            />
          )}

          <Input
            placeholder={t("Tags")}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <div className="flex gap-2">
            <Button
              onClick={handleCreateOrEdit}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting
                ? "Saving..."
                : editingId
                ? t("EditItem")
                : t("AddItem")}
            </Button>
            {editingId && (
              <Button variant="ghost" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </div>
        </div>

        {/* Error or Loading */}
        {loading && (

<LoaderExternal></LoaderExternal>
  
)}
        {error && <ErrorMessage message={error.message}></ErrorMessage>}

        {/* Table View */}
        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Thumbnail</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.visitLocationHighlights?.edges.map(({ node }: any) => (
                <tr key={node.id} className="border-t">
                  <td className="px-4 py-2">{node.id}</td>
                  <td className="px-4 py-2">{node.title}</td>
                  <td className="px-4 py-2">
                    {node.thumbnail ? (
                      <img
                        src={getImageSrc(node.thumbnail)}
                        alt={node.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(node)}
                      className="flex items-center ml-2 text-blue-500"
                    >
                      <Pencil className="w-4 h-4 mr-1" /> {t("EditItem")}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(node.id)}
                      className="flex items-center text-red-500"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> {t("DeleteItem")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data?.visitLocationHighlights?.edges.length===0 && <NoItemsPage></NoItemsPage>}
      </div>
    </>
  );
}
