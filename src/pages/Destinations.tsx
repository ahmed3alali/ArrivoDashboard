import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Pencil, Trash2 } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";
import { ProgressLogic } from "@/components/ui/ProgressLogic";
import { t } from "i18next";
import { DashboardHeader } from "@/components/DashboardHeader";
import LoaderExternal from "@/components/ui/Loader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import NoItemsPage from "@/components/ui/NoItemsPage";

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

const CREATE_DESTINATION = gql`
  mutation CreateDestination($title: String!) {
    createDestination(title: $title) {
      destination {
        id
        title
      }
    }
  }
`;

const EDIT_DESTINATION = gql`
  mutation EditDestination($id: ID!, $title: String!) {
    editDestination(id: $id, title: $title) {
      destination {
        id
        title
      }
    }
  }
`;

const DELETE_DESTINATION = gql`
  mutation DeleteDestination($id: ID!) {
    deleteDestination(id: $id) {
      destinationId
    }
  }
`;

const titleRegex = /^[\p{L}\p{N} .'-]{2,100}$/u; // Accepts Arabic and Latin letters, numbers, spaces, dashes

export default function DestinationsPage() {
  const { data, loading, error, refetch } = useQuery(GET_DESTINATIONS);
  const [createDestination] = useMutation(CREATE_DESTINATION);
  const [editDestination] = useMutation(EDIT_DESTINATION);
  const [deleteDestination] = useMutation(DELETE_DESTINATION);

  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const validateTitle = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      toast({ title: "Validation Error", description: "Title cannot be empty." });
      return false;
    }
    if (!titleRegex.test(trimmed)) {
      toast({
        title: "Invalid Title",
        description: "Title must be 2-100 characters and may include Arabic/Latin letters, numbers, and basic punctuation.",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateTitle()) return;

    try {
      if (editingId) {
        await editDestination({ variables: { id: editingId, title: title.trim() } });
        toast({ title: "Destination Updated", description: "The destination was updated successfully." });
      } else {
        await createDestination({ variables: { title: title.trim() } });
        toast({ title: "Destination Added", description: "New destination was added successfully." });
      }
      setTitle("");
      setEditingId(null);
      await refetch();
    } catch (e) {
      console.error("Operation failed", e);
      toast({ title: "Operation Failed", description: "Please try again later." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;

    try {
      await deleteDestination({ variables: { id } });
      toast({ title: "Destination Deleted", description: "The destination was deleted successfully." });
      await refetch();
    } catch (e) {
      console.error("Delete failed", e);
      toast({ title: "Operation Failed", description: "Please try again later." });
    }
  };

  const startEditing = (node: any) => {
    setEditingId(node.id);
    setTitle(node.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTitle("");
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
        <h1 className="text-2xl font-bold mb-4">{t("Destinations")}</h1>

        {/* Form */}
        <div className="space-y-2">
          <Input
            placeholder={t("TitleSingle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            {editingId ? t("EditItem") : t("AddItem")}
          </Button>
          {editingId && (
            <Button variant="ghost" onClick={cancelEditing}>
              Cancel Edit
            </Button>
          )}
        </div>

        {loading && (
      <LoaderExternal/>
)}
        {error && <ErrorMessage message={error.message}></ErrorMessage>}

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {data?.destinations?.edges.map(({ node }: any) => (
            <Card key={node.id} className="rounded-2xl shadow-md">
              <CardContent className="p-4">
                <p className="font-semibold">{node.title}</p>
                <p className="text-sm text-gray-600">ID: {node.id}</p>
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

        {data?.destinations?.edges.length ===0 && <NoItemsPage></NoItemsPage>}
      </div>
    </>
  );
}