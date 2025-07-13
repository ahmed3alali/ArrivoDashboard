import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Send, Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Sidebar } from "@/components/Sidebar";
import { ProgressLogic } from "@/components/ui/ProgressLogic";
import { t } from "i18next";
import { DashboardHeader } from "@/components/DashboardHeader";
import LoaderExternal from "@/components/ui/Loader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import NoItemsPage from "@/components/ui/NoItemsPage";

// Queries and Mutations
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

const EDIT_SUB_DESTINATION = gql`
  mutation EditSubDestination($id: ID!, $title: String!, $destinationId: ID!) {
    editSubDestination(id: $id, title: $title, destinationId: $destinationId) {
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

const DELETE_SUB_DESTINATION = gql`
  mutation DeleteSubDestination($id: ID!) {
    deleteSubDestination(id: $id) {
      subDestinationId
    }
  }
`;
export default function SubDestinationsPage() {
  const { data, loading, error, refetch } = useQuery(GET_SUB_DESTINATIONS);
  const {
    data: destinationsData,
    loading: destinationsLoading,
    error: destinationsError,
  } = useQuery(GET_DESTINATIONS);

  const [createSubDestination] = useMutation(CREATE_SUB_DESTINATION);
  const [editSubDestination] = useMutation(EDIT_SUB_DESTINATION);
  const [deleteSubDestination] = useMutation(DELETE_SUB_DESTINATION);

  const [title, setTitle] = useState("");
  const [selectedDestinationId, setSelectedDestinationId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const resetForm = () => {
    setTitle("");
    setSelectedDestinationId("");
    setEditingId(null);
  };

  const validateInput = () => {
    const titleRegex = /^[\w\s\u0600-\u06FF\-'.]{3,100}$/;
    if (!title.trim()) return "Title is required.";
    if (!titleRegex.test(title)) return "Title format is invalid.";
    if (!selectedDestinationId) return "Destination must be selected.";
    return null;
  };

  const handleSubmit = async () => {
    const error = validateInput();
    if (error) return toast.error(error);

    try {
      if (editingId) {
        await editSubDestination({
          variables: {
            id: editingId,
            title: title.trim(),
            destinationId: selectedDestinationId,
          },
        });
        toast.success("Sub-destination updated.");
      } else {
        await createSubDestination({
          variables: {
            title: title.trim(),
            destinationId: selectedDestinationId,
          },
        });
        toast.success("Sub-destination created.");
      }

      resetForm();
      await refetch();
    } catch (e: any) {
      toast.error("Operation failed: " + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sub-destination?")) return;
    try {
      await deleteSubDestination({ variables: { id } });
      toast.success("Sub-destination deleted.");
      await refetch();
    } catch (e: any) {
      toast.error("Delete failed: " + e.message);
    }
  };

  const startEditing = (node: any) => {
    setEditingId(node.id);
    setTitle(node.title);
    setSelectedDestinationId(node.destination?.id || "");
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
        <h1 className="text-2xl font-bold mb-4">{t("Subdestinations")}</h1>

        <div className="space-y-3">
          <Input
            placeholder={t("TitleSingle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Select
            value={selectedDestinationId}
            onValueChange={setSelectedDestinationId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("SelectDestination")} />
            </SelectTrigger>
            <SelectContent>
              {destinationsData?.destinations?.edges.map(({ node }: any) => (
                <SelectItem key={node.id} value={node.id}>
                  {node.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            {editingId && (
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || !selectedDestinationId}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {editingId ? t("EditItem") : t("AddItem")}
            </Button>
          </div>
        </div>
{(loading || destinationsLoading) && <LoaderExternal></LoaderExternal>}


{(error || destinationsError) && (
  <ErrorMessage message={error?.message || destinationsError?.message || "Unknown error"} />
)}




        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {data?.subDestinations?.edges.map(({ node }: any) => (
            <Card key={node.id} className="rounded-2xl shadow-md">
              <CardContent className="p-4">
                <p className="font-semibold">{node.title}</p>
                <p className="text-sm text-gray-600">ID: {node.id}</p>
                <p className="text-sm text-gray-500">
                  Destination: {node.destination?.title}
                </p>
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
        {data?.subDestinations?.edges.length===0 && <NoItemsPage></NoItemsPage>}
      </div>
    </>
  );
}