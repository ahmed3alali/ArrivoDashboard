import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Pencil } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { toast } from "sonner";
import { ProgressLogic } from "@/components/ui/ProgressLogic";
import { t } from "i18next";
import { DashboardHeader } from "@/components/DashboardHeader";
import LoaderExternal from "@/components/ui/Loader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import NoItemsPage from "@/components/ui/NoItemsPage";

const GET_CONDITIONS = gql`
  query {
    tripConditions(first: 100) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

const CREATE_CONDITION = gql`
  mutation ($title: String!) {
    createTripCondition(title: $title) {
      tripCondition {
        id
        title
      }
    }
  }
`;

const UPDATE_CONDITION = gql`
  mutation ($id: ID!, $title: String!) {
    editTripCondition(id: $id, title: $title) {
      tripCondition {
        id
        title
      }
    }
  }
`;

const DELETE_CONDITION = gql`
  mutation ($id: ID!) {
    deleteTripCondition(id: $id) {
      tripConditionId
    }
  }
`;

export default function TripConditionsPage() {
  const { data, loading, refetch, error } = useQuery(GET_CONDITIONS);
  const [createCondition] = useMutation(CREATE_CONDITION);
  const [updateCondition] = useMutation(UPDATE_CONDITION);
  const [deleteCondition] = useMutation(DELETE_CONDITION);

  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const resetForm = () => {
    setTitle("");
    setEditingId(null);
  };

  const isValidTitle = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      toast.error("Title cannot be empty.");
      return false;
    }
    if (trimmed.length > 100) {
      toast.error("Title must be 100 characters or fewer.");
      return false;
    }
    // **Use NOT test to detect invalid characters**
    if (!/^[\p{L}\p{N}\s.,?!'\-()،؟]+$/u.test(trimmed)) {
      toast.error("Title contains invalid characters.");
      return false;
    }
    return true;
  };
  

  const handleSubmit = async () => {
    const trimmed = title.trim();

    if (!isValidTitle(trimmed)) return;

    try {
      if (editingId) {
        await updateCondition({ variables: { id: editingId, title: trimmed } });
        toast.success("Condition updated successfully.");
      } else {
        await createCondition({ variables: { title: trimmed } });
        toast.success("Condition created successfully.");
      }
      resetForm();
      await refetch();
    } catch (err: any) {
      console.error("Submit failed:", err);
      toast.error("An error occurred while saving the condition.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this condition?")) return;

    try {
      await deleteCondition({ variables: { id } });
      toast.success("Condition deleted successfully.");
      await refetch();
    } catch (err: any) {
      console.error("Delete failed:", err);
      toast.error("An error occurred while deleting the condition.");
    }
  };

  const handleEdit = (cond: any) => {
    setEditingId(cond.id);
    setTitle(cond.title);
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
        <h1 className="text-2xl font-bold mb-4">{t("Conditions")}</h1>

        <div className="flex gap-2 mb-6">
          <Input
            placeholder={t("TitleSingle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button onClick={handleSubmit}>
            {editingId ? t("EditItem") : t("AddItem")}
          </Button>
          {editingId && (
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>

        {loading && (
        
<LoaderExternal/>

)}
        {error && (
          <ErrorMessage message={error.message}></ErrorMessage>
        )}

        {!loading && data?.tripConditions?.edges?.length > 0 && (
          <div className="grid gap-4">
            {data.tripConditions.edges.map(({ node }: any) => (
              <Card key={node.id} className="flex justify-between items-center p-4">
                <CardContent className="p-0 m-0 text-base">
                  {node.title}
                </CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(node)}
                  >
                    <Pencil className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(node.id)}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

        )}

        {data?.tripConditions?.edges?.length===0 && <NoItemsPage></NoItemsPage>}
      </div>
    </>
  );
}