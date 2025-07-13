import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Send } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { toast } from "sonner";
import { ProgressLogic } from "@/components/ui/ProgressLogic";
import { t } from "i18next";
import { DashboardHeader } from "@/components/DashboardHeader";
import LoaderExternal from "@/components/ui/Loader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import NoItemsPage from "@/components/ui/NoItemsPage";


    const GET_TRIP_EXCLUSIONS = gql`
    query GetTripExclusions($first: Int = 10) {
      tripExclusions(first: $first) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `;
  
  const CREATE_TRIP_EXCLUSION = gql`
    mutation CreateTripExclusion($title: String!) {
      createTripExclusion(title: $title) {
        tripExclusion {
          id
          title
        }
      }
    }
  `;
  
  const EDIT_TRIP_EXCLUSION = gql`
    mutation EditTripExclusion($id: ID!, $title: String!) {
      editTripExclusion(id: $id, title: $title) {
        tripExclusion {
          id
          title
        }
      }
    }
  `;
  
  const DELETE_TRIP_EXCLUSION = gql`
    mutation DeleteTripExclusion($id: ID!) {
      deleteTripExclusion(id: $id) {
        tripExclusionId
      }
    }
  `;
  


  export default function TripExclusionsPage() {
    const { data, loading, error, refetch } = useQuery(GET_TRIP_EXCLUSIONS);
    const [createExclusion] = useMutation(CREATE_TRIP_EXCLUSION);
    const [editExclusion] = useMutation(EDIT_TRIP_EXCLUSION);
    const [deleteExclusion] = useMutation(DELETE_TRIP_EXCLUSION);
  
    const [title, setTitle] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [collapsed, setCollapsed] = useState(false);
  
    const validateTitle = (value: string) => {
      return /^[\u0621-\u064Aa-zA-Z0-9\s.,\-()!?]{2,100}$/.test(value);
    };
  
    const handleCreateOrEdit = async () => {
      const trimmed = title.trim(); 
  
      if (!trimmed) {
        toast.error("Title cannot be empty.");
        return;
      }
  
      if (!validateTitle(trimmed)) {
        toast.error("Title contains invalid characters.");
        return;
      }
  
      try {
        if (editingId) {
          await editExclusion({
            variables: { id: editingId, title: trimmed },
          });
          toast.success("Exclusion updated.");
        } else {
          await createExclusion({
            variables: { title: trimmed },
          });
          toast.success("Exclusion created.");
        }
  
        setTitle("");
        setEditingId(null);
        await refetch();
      } catch (e: any) {
        console.error("Mutation failed:", e);
        toast.error("Operation failed. Check console for details.");
      }
    };
  
    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this exclusion?")) return;
  
      try {
        await deleteExclusion({ variables: { id } });
        await refetch();
        toast.success("Exclusion deleted.");
      } catch (e: any) {
        console.error("Delete failed:", e);
        toast.error("Failed to delete exclusion.");
      }
    };
  
    const startEditing = (node: any) => {
      setEditingId(node.id);
      setTitle(node.title);
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
          <h1 className="text-2xl font-bold mb-4">{t("TripExclusions")}</h1>
  
          {/* Form */}
          <div className="space-y-2 mb-6">
            <Input
              placeholder={t("TitleSingle")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button onClick={handleCreateOrEdit} className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              {editingId ? t("EditItem") : t("AddItem")}
            </Button>
            {editingId && (
              <Button
                variant="ghost"
                onClick={() => {
                  setTitle("");
                  setEditingId(null);
                }}
              >
                Cancel Edit
              </Button>
            )}
          </div>
  
          {/* Errors & Loading */}
          {loading && (
    
 <LoaderExternal/>

)}
          {error && <ErrorMessage message={error.message}></ErrorMessage>}
  
          {/* Table */}
          <div className="overflow-x-auto border rounded-xl shadow-sm">
        
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>

           
                {data?.tripExclusions?.edges.map(({ node }: any) => (
                  <tr key={node.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{node.id}</td>
                    <td className="px-4 py-2">{node.title}</td>
                    <td className="px-4 py-2 space-x-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.tripExclusions?.edges.length ===0 && <NoItemsPage/>}
        </div>
      </>
    );
  }
  