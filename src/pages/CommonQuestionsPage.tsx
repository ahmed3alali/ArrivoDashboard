import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Send, Edit, Check, X } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { toast } from '@/hooks/use-toast';

import { ProgressLogic } from "@/components/ui/ProgressLogic"; // adjust path as needed
import { t } from 'i18next';
import { DashboardHeader } from '@/components/DashboardHeader';
import LoaderExternal from '@/components/ui/Loader';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import NoItemsPage from '@/components/ui/NoItemsPage';

// GraphQL queries & mutations
const GET_COMMON_QUESTIONS = gql`
  query {
    commonQuestions {
      edges {
        node {
          id
          question
          answer
        }
      }
    }
  }
`;

const CREATE_COMMON_QUESTION = gql`
  mutation CreateCommonQuestion($question: String!, $answer: String!) {
    createCommonQuestion(question: $question, answer: $answer) {
      commonQuestion {
        id
        question
        answer
      }
    }
  }
`;



const EDIT_COMMON_QUESTION = gql`
  mutation EditCommonQuestion($id: ID!, $question: String, $answer: String) {
    editCommonQuestion(id: $id, question: $question, answer: $answer) {
      commonQuestion {
        id
        question
        answer
      }
    }
  }
`;




const DELETE_COMMON_QUESTION = gql`
  mutation DeleteCommonQuestion($id: ID!) {
    deleteCommonQuestion(id: $id) {
      commonQuestionId
    }
  }
`;

export default function CommonQuestionsPage() {
  const { data, loading, error, refetch } = useQuery(GET_COMMON_QUESTIONS);
  const [createCommonQuestion] = useMutation(CREATE_COMMON_QUESTION);
  const [editCommonQuestion] = useMutation(EDIT_COMMON_QUESTION);
  const [deleteCommonQuestion] = useMutation(DELETE_COMMON_QUESTION, {
    update(cache, { data: { deleteCommonQuestion } }) {
      cache.modify({
        fields: {
          commonQuestions(existing = {}, { readField }) {
            const deletedId = deleteCommonQuestion.commonQuestionId;
            return {
              ...existing,
              edges: existing.edges.filter(
                edge => readField('id', edge.node) !== deletedId
              ),
            };
          },
        },
      });
    },
  });
  

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");




  const handleCreate = async () => {
    if (!question.trim() || !answer.trim()) return;


    const questionAnswerRegex = /^[\p{L}\p{N}\s.,?!'\-()،؟]+$/u;



if (!questionAnswerRegex.test(question.trim())) {
  toast({
    title: "Invalid Question",
    description: "Question contains invalid characters or length (5-500 chars).",
    variant: "destructive",
  });
  return;
}

if (!questionAnswerRegex.test(answer.trim())) {
  toast({
    title: "Invalid Answer",
    description: "Answer contains invalid characters or length (5-500 chars).",
    variant: "destructive",
  });
  return;
}

    


    try {
      await createCommonQuestion({
        variables: { question, answer }
      });
      setQuestion('');
      setAnswer('');
      refetch();
     
          toast({
            variant: "default",
            title: t("Success"),
            description: t("AddedSuccessfully"),
          });
          
        
      

    } catch (e) {
      console.error('Create failed', e);
      toast({
        title: "Creation failed",
        description: "Question creation failed",
        variant: "destructive",
      });
    }
  };



  const startEditing = (id: string, currentQuestion: string, currentAnswer: string) => {
    setEditingId(id);
    setEditQuestion(currentQuestion);
    setEditAnswer(currentAnswer);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  const handleEditSave = async () => {
    if (!editingId) return;
    try {
      await editCommonQuestion({
        variables: { id: editingId, question: editQuestion, answer: editAnswer },
      });
      cancelEditing();
      await refetch();
      toast({
        title: "Success",
        description: "Question updated successfully.",
        variant: "default", // use this instead of "success"
      });
      
    } catch (e) {
      alert("Edit failed: " + e.message);
      toast({
        title: "Error",
        description: "Failed to update question.",
        variant: "destructive",
      });
      
    }
  };


  



  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteCommonQuestion({ variables: { id } });
        await refetch();  // Refetch the list to update UI
      } catch (e) {
        alert("Delete failed: " + e.message);
      }
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
      <h1 className="text-2xl font-bold">{t("CommonQuestions")}</h1>

      {/* Create Form */}
      <div className="space-y-2 mt-4">
        <Input
          placeholder={t("Question")}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Input
          placeholder={t("Answer")}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Send className="w-4 h-4" /> {t("AddItem")}
        </Button>
      </div>

      {loading && (

<LoaderExternal/>
  
)}

      {error && <ErrorMessage message='error loading questions ! '></ErrorMessage>}



    



      {/* Table */}
      {data?.commonQuestions?.edges.length > 0 && (
        <div className="overflow-x-auto border mt-5 rounded-xl shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Question</th>
                <th className="px-4 py-2">Answer</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.commonQuestions.edges.map(({ node }: any) => (
                <tr key={node.id} className="border-t">
                  <td className="px-4 py-2">{node.id}</td>
                  <td className="px-4 py-2">
                    {editingId === node.id ? (
                      <Input
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
                      />
                    ) : (
                      node.question
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === node.id ? (
                      <Input
                        value={editAnswer}
                        onChange={(e) => setEditAnswer(e.target.value)}
                      />
                    ) : (
                      node.answer || <em className="text-gray-400">No answer</em>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {editingId === node.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={handleEditSave}
                        >
                          <Check className="w-4 h-4" /> Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex items-center gap-1"
                          onClick={cancelEditing}
                        >
                          <X className="w-4 h-4" /> Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex items-center gap-1"
                          onClick={() =>
                            startEditing(node.id, node.question, node.answer || "")
                          }
                        >
                          <Edit className="w-4 h-4" /> {t("EditItem")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 flex items-center gap-1"
                          onClick={() => handleDelete(node.id)}
                        >
                          <Trash2 className="w-4 h-4" /> {t("DeleteItem")}
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{data?.commonQuestions?.edges?.length === 0 && <p><NoItemsPage/></p>}
      {/* Card View */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {data?.commonQuestions?.edges.map(({ node }: any) => (
          <Card key={node.id} className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <h3 className="font-semibold">{node.question}</h3>
              <p className="text-sm text-gray-600 mt-1">{node.answer || <em>No answer</em>}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-red-500 flex items-center"
                onClick={() => handleDelete(node.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" /> {t("DeleteItem")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </>
  );
}
