import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Send } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { ProgressLogic } from "@/components/ui/ProgressLogic";


const GET_TRIP_IMPORTANT_INFOS = gql`
  query GetTripImportantInfos($first: Int = 10) {
    tripImportantInfos(first: $first) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;


const CREATE_TRIP_IMPORTANT_INFO = gql`
  mutation CreateTripImportantInfo($title: String!) {
    createTripImportantInfo(title: $title) {
      tripImportantInfo {
        id
        title
      }
    }
  }
`;

const EDIT_TRIP_IMPORTANT_INFO = gql`
  mutation EditTripImportantInfo($id: ID!, $title: String!) {
    editTripImportantInfo(id: $id, title: $title) {
      tripImportantInfo {
        id
        title
      }
    }
  }
`;




const DELETE_TRIP_IMPORTANT_INFO = gql`
  mutation DeleteTripImportantInfo($id: ID!) {
    deleteTripImportantInfo(id: $id) {
      tripImportantInfoId
    }
  }
`;


export default function TripImportantInfoPage() {
  const { data, loading, error, refetch } = useQuery(GET_TRIP_IMPORTANT_INFOS);
  const [createInfo] = useMutation(CREATE_TRIP_IMPORTANT_INFO);
  const [editInfo] = useMutation(EDIT_TRIP_IMPORTANT_INFO);
  const [deleteInfo] = useMutation(DELETE_TRIP_IMPORTANT_INFO);

  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreateOrEdit = async () => {
    if (!title.trim()) return;
  
    try {
      if (editingId) {
        await editInfo({
          variables: {
            id: editingId,
            title: title.trim(),
          },
        });
      } else {
        await createInfo({
          variables: {
            title: title.trim(),
          },
        });
      }
  
      setTitle("");
      setEditingId(null);
      await refetch();
    } catch (e) {
      console.error("Operation failed", e);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this info?")) {
      try {
        await deleteInfo({ variables: { id } });
        await refetch();
      } catch (e) {
        console.error("Delete failed", e);
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
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="ml-16 md:ml-64 min-h-screen bg-muted/50 py-10 px-6">
      
      <h1 className="text-2xl font-bold">Trip Important Info</h1>

      <div className="space-y-2">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Button onClick={handleCreateOrEdit} className="flex items-center gap-2">
          <Send className="w-4 h-4" /> {editingId ? "Update" : "Add Info"}
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
        <div className="flex items-center m-auto w-56 justify-center min-h-screen">
    <ProgressLogic />
  </div>
)}
      {error && <p className="text-red-500">Error loading info.</p>}

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
            {data?.tripImportantInfos?.edges.map(({ node }: any) => (
              <tr key={node.id} className="border-t">
                <td className="px-4 py-2">{node.id}</td>
                <td className="px-4 py-2">{node.title}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing(node)}
                    className="flex items-center text-blue-500"
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(node.id)}
                    className="flex items-center text-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
