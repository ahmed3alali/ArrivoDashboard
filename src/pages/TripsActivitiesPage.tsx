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
import NoItemsPage from "@/components/ui/NoItemsPage";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import LoaderExternal from "@/components/ui/Loader";

// GraphQL queries + mutations
const GET_TRIP_ACTIVITIES = gql`
  query GetTripActivities($first: Int = 10) {
    tripActivities(first: $first) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const CREATE_TRIP_ACTIVITY = gql`
  mutation CreateTripActivity($title: String!) {
    createTripActivity(title: $title) {
      tripActivity {
        id
        title
      }
    }
  }
`;

const EDIT_TRIP_ACTIVITY = gql`
  mutation EditTripActivity($id: ID!, $title: String!) {
    editTripActivity(id: $id, title: $title) {
      tripActivity {
        id
        title
      }
    }
  }
`;


const DELETE_TRIP_ACTIVITY = gql`
  mutation DeleteTripActivity($id: ID!) {
    deleteTripActivity(id: $id) {
      tripActivityId
    }
  }
`;

export default function TripActivitiesPage() {
  const { data, loading, error, refetch } = useQuery(GET_TRIP_ACTIVITIES);
  const [createActivity] = useMutation(CREATE_TRIP_ACTIVITY);
  const [editActivity] = useMutation(EDIT_TRIP_ACTIVITY);
  const [deleteActivity] = useMutation(DELETE_TRIP_ACTIVITY);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Regex allowing Arabic and Latin letters, numbers, spaces (3-100 chars)
  const titleRegex = /^[\p{L}\p{N}\s.,?!'\-()،]{3,100}$/u;

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Title missing",
        description: "Please enter an activity title.",
        variant: "destructive",
      });
      return false;
    }
    if (!titleRegex.test(title.trim())) {
      toast({
        title: "Invalid Title",
        description:
          "Title can contain Arabic/Latin letters, numbers, and punctuation (3-100 chars).",
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
        await editActivity({
          variables: {
            id: editingId,
            title: title.trim(),
          },
        });
        toast({
          title: "Activity updated",
          description: "Trip activity updated successfully.",
          variant: "default",
        });
      } else {
        await createActivity({
          variables: {
            title: title.trim(),
          },
        });
        toast({
          title: "Activity added",
          description: "New trip activity added successfully.",
          variant: "default",
        });
      }

      setTitle("");
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
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await deleteActivity({ variables: { id } });
        toast({
          title: "Activity deleted",
          description: "Trip activity deleted successfully.",
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
  };

  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
       <DashboardHeader 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="ltr:ml-16 ltr:md:ml-64 md:rtl:mr-64 min-h-screen bg-muted/50 py-10 px-6">
        <h1 className="text-2xl font-bold">{t("TripActivities")}</h1>

        {/* Form */}
        <div className="space-y-2">
          <Input
            placeholder={t("TripActivities")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button onClick={handleCreateOrEdit} className="flex items-center gap-2">
            <Send className="w-4 h-4" /> {editingId ? "Update" : t("AddItem")}
          </Button>
          {editingId && (
            <Button
              variant="ghost"
              onClick={() => {
                setEditingId(null);
                setTitle("");
              }}
            >
              Cancel Edit
            </Button>
          )}
        </div>

        {loading && (
    
<LoaderExternal/>

)}
        {error && <ErrorMessage message="error loading trip activities !"></ErrorMessage>}


      

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {data?.tripActivities?.edges.map(({ node }: any) => (
            <Card key={node.id} className="rounded-2xl shadow-md">
              <CardContent className="p-4">
                <h3 className="font-semibold">{node.title}</h3>
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
        {data?.tripActivities?.edges?.length === 0 && <p><NoItemsPage/></p>}
      </div>
    </>
  );
}