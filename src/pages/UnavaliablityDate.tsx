import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Sidebar } from "@/components/Sidebar";
import { ProgressLogic } from "@/components/ui/ProgressLogic";
import { t } from "i18next";


export const GET_UNAVAILABILITY_DATES = gql`
query {
  unavailabilityDates {
    edges {
      node {
        id
        startDate
        endDate
      }
    }
  }
}

`;

export const CREATE_UNAVAILABILITY_DATE = gql`
  mutation CreateUnavailabilityDate($startDate: Date!, $endDate: Date!) {
    createUnavailabilityDate(startDate: $startDate, endDate: $endDate) {
      unavailabilityDate {
        id
        startDate
        endDate
      }
    }
  }
`;

export const EDIT_UNAVAILABILITY_DATE = gql`
  mutation EditUnavailabilityDate($id: ID!, $startDate: Date, $endDate: Date) {
    editUnavailabilityDate(id: $id, startDate: $startDate, endDate: $endDate) {
      unavailabilityDate {
        id
        startDate
        endDate
      }
    }
  }
`;

export const DELETE_UNAVAILABILITY_DATE = gql`
  mutation DeleteUnavailabilityDate($id: ID!) {
    deleteUnavailabilityDate(id: $id) {
      unavailabilityDateId
    }
  }
`;

export default function UnavailabilityPage() {
  const { data, loading, error, refetch } = useQuery(GET_UNAVAILABILITY_DATES);
  const [createUnavailabilityDate] = useMutation(CREATE_UNAVAILABILITY_DATE);
  const [editUnavailabilityDate] = useMutation(EDIT_UNAVAILABILITY_DATE);
  const [deleteUnavailabilityDate] = useMutation(DELETE_UNAVAILABILITY_DATE);

  const [form, setForm] = useState({ startDate: "", endDate: "", id: null });
  const [isEditing, setIsEditing] = useState(false);
  const [loadingMutation, setLoadingMutation] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dates
    if (!form.startDate || !form.endDate) {
      alert("Please fill in both start and end dates.");
      return;
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      alert("Start date cannot be after end date.");
      return;
    }

    setLoadingMutation(true);
    try {
      if (isEditing) {
        await editUnavailabilityDate({
          variables: {
            id: form.id,
            startDate: form.startDate,
            endDate: form.endDate,
          },
        });
      } else {
        await createUnavailabilityDate({
          variables: {
            startDate: form.startDate,
            endDate: form.endDate,
          },
        });
      }
      await refetch();
      setForm({ startDate: "", endDate: "", id: null });
      setIsEditing(false);
    } catch (err: any) {
      alert("Operation failed: " + err.message);
    } finally {
      setLoadingMutation(false);
    }
  };

  const handleEdit = (item: any) => {
    setForm({
      startDate: item.startDate,
      endDate: item.endDate,
      id: item.id,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this date?")) return;

    try {
      await deleteUnavailabilityDate({ variables: { id } });
      await refetch();
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };



  return (
    <>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="ltr:ml-16 ltr:md:ml-64 md:rtl:mr-64 min-h-screen bg-muted/50 py-10 px-6">
        <h1 className="text-2xl font-bold mb-4">{t("Unavaliability")}</h1>

         {/* Loading Spinner */}
         {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <ProgressLogic />
        </div>
      )}
     {/* Error */}
     {error && (
        <div className="p-4 text-red-600">
          Error loading unavailability dates: {error.message}
        </div>
      )}

   {/* Guard rendering below until data is ready */}
   {!loading && !error && data?.unavailabilityDates?.edges && (
     <>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-4 mb-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="border rounded p-2 w-full"
              required
              max={form.endDate || undefined}
            />
            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="border rounded p-2 w-full"
              required
              min={form.startDate || undefined}
            />
          </div>
          <button
            type="submit"
            disabled={loadingMutation}
            className={`${
              loadingMutation
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-blue-900"
            } text-white font-semibold py-2 px-4 rounded`}
          >
            {isEditing ? t("EditItem") : t("AddItem")} 
          </button>
        </form>

        <div className="bg-white shadow-md rounded p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Start Date</th>
                <th className="p-2">End Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.unavailabilityDates.edges.map(({ node: item }: any) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{item.startDate}</td>
                  <td className="p-2">{item.endDate}</td>
                  <td className="p-2 space-x-2 ">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline rtl:ml-4"
                    >
                     {t("EditItem")}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
                    >
                   {t("DeleteItem")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
               </>
               )}

      </div>
      
    </>
  );
}