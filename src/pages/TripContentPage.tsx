import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Send, Pencil } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";
import { ProgressLogic } from "@/components/ui/ProgressLogic";
import { t } from "i18next";

// GraphQL query + mutations
const GET_TRIP_CONTENTS = gql`
  query GetTripContents($first: Int = 10) {
    tripContents(first: $first) {
      edges {
        node {
          id
          title
          description
          icon
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const CREATE_TRIP_CONTENT = gql`
  mutation CreateTripContent(
    $title: String!
    $description: String!
    $iconBase64: String
  ) {
    createTripContent(
      title: $title
      description: $description
      iconBase64: $iconBase64
    ) {
      tripContent {
        id
        title
        description
        icon
      }
    }
  }
`;

const EDIT_TRIP_CONTENT = gql`
  mutation EditTripContent(
    $id: ID!
    $title: String
    $description: String
    $iconBase64: String
  ) {
    editTripContent(
      id: $id
      title: $title
      description: $description
      iconBase64: $iconBase64
    ) {
      tripContent {
        id
        title
        description
        icon
      }
    }
  }
`;

const DELETE_TRIP_CONTENT = gql`
  mutation DeleteTripContent($id: ID!) {
    deleteTripContent(id: $id) {
      tripContentId
    }
  }
`;
export default function TripContentPage() {
  const { data, loading, error, refetch } = useQuery(GET_TRIP_CONTENTS);
  const [createContent] = useMutation(CREATE_TRIP_CONTENT);
  const [editContent] = useMutation(EDIT_TRIP_CONTENT);
  const [deleteContent] = useMutation(DELETE_TRIP_CONTENT);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconBase64, setIconBase64] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null); // keep original file for validation
  const [editingId, setEditingId] = useState<string | null>(null);

  // Regex to allow Arabic letters, numbers, common punctuation, spaces (length 3-100)
  const textRegex = /^[\p{L}\p{N}\s.,?!'\-()،]{3,100}$/u;

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Title missing",
        description: "Please enter a title.",
        variant: "destructive",
      });
      return false;
    }
    if (!textRegex.test(title.trim())) {
      toast({
        title: "Invalid Title",
        description:
          "Title can contain Arabic/Latin letters, numbers, and punctuation (3-100 chars).",
        variant: "destructive",
      });
      return false;
    }

    if (!description.trim()) {
      toast({
        title: "Description missing",
        description: "Please enter a description.",
        variant: "destructive",
      });
      return false;
    }
    if (!textRegex.test(description.trim())) {
      toast({
        title: "Invalid Description",
        description:
          "Description can contain Arabic/Latin letters, numbers, and punctuation (3-100 chars).",
        variant: "destructive",
      });
      return false;
    }

    if (!editingId) {
      // If creating new content, icon upload is required
      if (!iconFile) {
        toast({
          title: "Icon missing",
          description: "Please upload an icon image.",
          variant: "destructive",
        });
        return false;
      }
    }

    // File validation: type and size (max 2.5MB)
    if (iconFile) {
      if (!iconFile.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Only image files are allowed for the icon.",
          variant: "destructive",
        });
        return false;
      }
      if (iconFile.size > 2.5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Icon image must be smaller than 2.5 MB.",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
const backendMediaUrl = import.meta.env.VITE_BACKEND_URL_MEDIA;


  const handleCreateOrEdit = async () => {
    if (!validateForm()) return;

    try {
      if (editingId) {
        await editContent({
          variables: {
            id: editingId,
            title,
            description,
            iconBase64: iconBase64 || undefined,
          },
        });
        toast({
          title: "Content updated",
          description: "Trip content updated successfully.",
          variant: "default",
        });
      } else {
        await createContent({
          variables: {
            title,
            description,
            iconBase64,
          },
        });
        toast({
          title: "Content added",
          description: "New trip content added successfully.",
          variant: "default",
        });
      }

      setTitle("");
      setDescription("");
      setIconBase64("");
      setIconFile(null);
      setEditingId(null);
      await refetch();
    } catch (e) {
      console.error("Operation failed", e);
      toast({
        title: "Operation failed",
        description: (e as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      try {
        await deleteContent({ variables: { id } });
        toast({
          title: "Content deleted",
          description: "Trip content deleted successfully.",
          variant: "default",
        });
        await refetch();
      } catch (e) {
        console.error("Delete failed", e);
        toast({
          title: "Delete failed",
          description: (e as Error).message,
          variant: "destructive",
        });
      }
    }
  };

  const startEditing = (node: any) => {
    setEditingId(node.id);
    setTitle(node.title);
    setDescription(node.description);
    setIconBase64("");
    setIconFile(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size immediately to prevent malicious or large files
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Only image files are allowed for the icon.",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Icon image must be smaller than 2.5 MB.",
        variant: "destructive",
      });
      return;
    }

    setIconFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setIconBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="ltr:ml-16 ltr:md:ml-64 md:rtl:mr-64 min-h-screen bg-muted/50 py-10 px-6">
        <h1 className="text-2xl font-bold">{t("TripContent")}</h1>

        {/* Form */}
        <div className="space-y-2 mt-4">
          <Input
            placeholder={t("TitleSingle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder={t("DescriptionSingle")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input type="file" accept="image/*" onChange={handleFileUpload} />
          {iconBase64 && (
            <img
              src={iconBase64}
              alt="Icon preview"
              className="max-w-xs mt-2 rounded shadow"
            />
          )}

          <Button onClick={handleCreateOrEdit} className="flex items-center gap-2">
            <Send className="w-4 h-4" /> {editingId ? "Update" : t("AddItem")}
          </Button>
          {editingId && (
            <Button
              variant="ghost"
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setDescription("");
                setIconBase64("");
                setIconFile(null);
              }}
            >
              Cancel Edit
            </Button>
          )}
        </div>

        {loading && (
        <div className="flex items-center m-auto w-56 justify-center min-h-screen">
    <ProgressLogic />
  </div>
)}
        {error && <p className="text-red-500">Error loading trip contents.</p>}

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {data?.tripContents?.edges.map(({ node }: any) => (
            <Card key={node.id} className="rounded-2xl shadow-md">
              <CardContent className="p-4">
                <h3 className="font-semibold">{node.title}</h3>
                <p className="text-sm text-gray-600">{node.description}</p>
                {node.icon && (
                  <img
                    src={`${backendMediaUrl}/${node.icon}`}
                    alt={node.title}
                    className="w-16 h-16 object-cover rounded mt-2"
                  />
                )}
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-blue-500 flex items-center"
                    onClick={() => startEditing(node)}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> {t("EditItem")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 flex items-center"
                    onClick={() => handleDelete(node.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> {t("DeleteItem")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}