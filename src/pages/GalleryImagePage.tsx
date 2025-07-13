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
import { DashboardHeader } from "@/components/DashboardHeader";
import LoaderExternal from "@/components/ui/Loader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import NoItemsPage from "@/components/ui/NoItemsPage";

// GraphQL queries & mutations

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

const CREATE_GALLERY_IMAGE = gql`
  mutation CreateGalleryImage(
    $title: String
    $pictureBase64: String!
    $tags: [String!]
  ) {
    createGalleryImage(
      title: $title
      pictureBase64: $pictureBase64
      tags: $tags
    ) {
      gallery {
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
`;

const EDIT_GALLERY_IMAGE = gql`
  mutation EditGalleryImage(
    $id: ID!
    $title: String
    $pictureBase64: String
    $tags: [String!]
  ) {
    editGalleryImage(
      id: $id
      title: $title
      pictureBase64: $pictureBase64
      tags: $tags
    ) {
      gallery {
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
`;

const DELETE_GALLERY_IMAGE = gql`
  mutation DeleteGalleryImage($id: ID!) {
    deleteGalleryImage(id: $id) {
      galleryId
    }
  }
`;


export default function GalleryImagesPage() {
  const { data, loading, error, refetch } = useQuery(GET_GALLERY_IMAGES);
  const [createGalleryImage] = useMutation(CREATE_GALLERY_IMAGE);
  const [editGalleryImage] = useMutation(EDIT_GALLERY_IMAGE);
  const [deleteGalleryImage] = useMutation(DELETE_GALLERY_IMAGE);

  const [title, setTitle] = useState("");
  const [tagsInput, setTagsInput] = useState(""); // comma separated tags string
  const [iconBase64, setIconBase64] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);


  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const backendMediaUrl = import.meta.env.VITE_BACKEND_URL_MEDIA;
  




  const tagsArray = tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const startEditing = (node: any) => {
    setEditingId(node.id);
    setTitle(node.title || "");
    setTagsInput(
      node.tags?.edges?.map(({ node }: any) => node.name).join(", ") || ""
    );
    setIconBase64("");
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setTagsInput("");
    setIconBase64("");
  };

  // Validate title (optional) to allow Arabic/Latin letters, numbers, punctuation, max 100 chars
  const titleRegex = /^[\p{L}\p{N}\s.,?!'\-()،]{0,100}$/u;

  // Validate uploaded file (image only, max 2.5MB)
  const validateFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSizeMB = 2.5;
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPG, PNG, GIF, and WEBP images are allowed.",
        variant: "destructive",
      });
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Image must be smaller than ${maxSizeMB}MB.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      e.target.value = ""; // clear invalid file input
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setIconBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!iconBase64 && !editingId) {
      toast({
        title: "Image required",
        description: "Please upload an image.",
        variant: "destructive",
      });
      return false;
    }
    if (title && !titleRegex.test(title)) {
      toast({
        title: "Invalid title",
        description:
          "Title can contain Arabic/Latin letters, numbers, punctuation (max 100 chars).",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleCreateOrEdit = async () => {
    if (!validateForm()) return;

    try {
      if (editingId) {
        await editGalleryImage({
          variables: {
            id: editingId,
            title: title || undefined,
            tags: tagsArray.length ? tagsArray : undefined,
            pictureBase64: iconBase64 || undefined,
          },
        });
        toast({
          title: "Image updated",
          description: "Gallery image updated successfully.",
          variant: "default",
        });
      } else {
        await createGalleryImage({
          variables: {
            title: title || undefined,
            tags: tagsArray.length ? tagsArray : undefined,
            pictureBase64: iconBase64,
          },
        });
        toast({
          title: "Image added",
          description: "New gallery image added successfully.",
          variant: "default",
        });
      }
      resetForm();
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
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteGalleryImage({
        variables: { id },
      });
      toast({
        title: "Image deleted",
        description: "Gallery image deleted successfully.",
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
  };

  const [collapsed, setCollapsed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>

<DashboardHeader 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />


      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="ltr:ml-16 ltr:md:ml-64 md:rtl:mr-64 min-h-screen bg-muted/50 py-10 px-6">
        <h1 className="text-2xl font-bold">{t("TripGallery")}</h1>

        {/* Form */}
        <div className="space-y-2 mt-4">
          <Input
            placeholder={t("TitleSingle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder={t("Tags")}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
          <Input type="file" accept="image/*" onChange={handleFileUpload} />
          {iconBase64 && (
            <img
              src={iconBase64}
              alt="Image preview"
              className="max-w-xs mt-2 rounded shadow"
            />
          )}

          <Button onClick={handleCreateOrEdit} className="flex items-center gap-2">
            <Send className="w-4 h-4" /> {editingId ? "Update Image" : t("AddItem")}
          </Button>
          {editingId && (
            <Button variant="ghost" onClick={resetForm}>
              Cancel Edit
            </Button>
          )}
        </div>

        {loading && (
  
<LoaderExternal/>
  
)}
        {error && (
      <ErrorMessage message={error.message}/>
        )}



        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {data?.galleryImages?.edges.map(({ node }: any) => (
            <Card key={node.id} className="rounded-2xl shadow-md">
              <CardContent className="p-4">
                <h3 className="font-semibold">{node.title || "Untitled"}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {node.tags?.edges.map(({ node: tagNode }: any) => (
                    <span
                      key={tagNode.id}
                      className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded"
                    >
                      {tagNode.name}
                    </span>
                  ))}
                </div>
                {node.picture && (
                  <img
                    src={`${backendMediaUrl}/${node.picture}`}
                    alt={node.title}
                    className="w-32 h-32 object-cover rounded mt-2"
                  />
                )}

                <div className="flex gap-2 mt-4">
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

        {data?.galleryImages?.edges?.length === 0 && <NoItemsPage/>}

        
      </div>
    </>
  );
}