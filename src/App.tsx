import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProvincesPage from "./pages/ProvincesPage";
import CommonQuestionsPage from "./pages/CommonQuestionsPage";
import Login from "./adminAuth/Login";
import VisitLocationHighlightsPage from "./pages/VisitLocationHighlightsPage";
import TripContentPage from "./pages/TripContentPage";
import TripActivitiesPage from "./pages/TripsActivitiesPage";
import TripImportantInfoPage from "./pages/TripImportantInfoPage";
import TripExclusionsPage from "./pages/TripsExclusionsPage";
import GalleryImagePage from "./pages/GalleryImagePage";
import TripSubTypesPage from "./pages/TripsSubtypesPage";
import DestinationsPage from "./pages/Destinations";
import CreateOneDayTripPage from "./pages/CreateOneDayTripPage";
import TripsListPage from "./pages/TripsListPage";
import SubDestinations from "./pages/SubDestinations";
import CreateMultiDayTripPage from "./pages/MultiDayTripsPage";
import TripConditionsPage from "./pages/TripConditions";
import ResidenceCRUD from "./pages/Residence";
import MultiDayTripCRUD from "./pages/MultiDayCRUD";
import UnavailabilityPage from "./pages/UnavaliablityDate";
import LoginForm from "./pages/LoginTest";

import {Protection} from "./adminAuth/Protection"; 
import MultiTest from "./pages/ClaudeMulti";
import TripPackageCRUD from "./pages/PackagesManager";
import '../i18'; 
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginForm />} />

          {/* Protected routes */}
          <Route 
            path="/"
            element={
              <Protection>
                <Index />
              </Protection>
            }
          />
          <Route
            path="/provinces"
            element={
              <Protection>
                <ProvincesPage />
              </Protection>
            }
          />
          <Route
            path="/common"
            element={
              <Protection>
                <CommonQuestionsPage />
              </Protection>
            }
          />
          <Route
            path="/tripContent"
            element={
              <Protection>
                <TripContentPage />
              </Protection>
            }
          />
          <Route
            path="/tripsAct"
            element={
              <Protection>
                <TripActivitiesPage />
              </Protection>
            }
          />
          <Route
            path="/subtypes"
            element={
              <Protection>
                <TripSubTypesPage />
              </Protection>
            }
          />
          <Route
            path="/gallery"
            element={
              <Protection>
                <GalleryImagePage />
              </Protection>
            }
          />
          <Route
            path="/unavdate"
            element={
              <Protection>
                <UnavailabilityPage />
              </Protection>
            }
          />
           
          <Route
            path="/package"
            element={
              <Protection>
                <TripPackageCRUD />
              </Protection>
            }
          />
          <Route
            path="/destinations"
            element={
              <Protection>
                <DestinationsPage />
              </Protection>
            }
          />
          <Route
            path="/residence"
            element={
              <Protection>
                <ResidenceCRUD />
              </Protection>
            }
          />
          <Route
            path="/subDest"
            element={
              <Protection>
                <SubDestinations />
              </Protection>
            }
          />


<Route
            path="/testMulti"
            element={
              <Protection>
                <MultiTest />
              </Protection>
            }
          />
          <Route
            path="/tripsEx"
            element={
              <Protection>
                <TripExclusionsPage />
              </Protection>
            }
          />
          <Route
            path="/visitLhighlights"
            element={
              <Protection>
                <VisitLocationHighlightsPage />
              </Protection>
            }
          />
          <Route
            path="/oneday-trip"
            element={
              <Protection>
                <CreateOneDayTripPage />
              </Protection>
            }
          />
          <Route
            path="/multi-trip"
            element={
              <Protection>
                <MultiDayTripCRUD />
              </Protection>
            }
          />
          <Route
            path="/conditions"
            element={
              <Protection >
                <TripConditionsPage />
              </Protection>
            }
          />
          <Route
            path="/tripsOne"
            element={
              <Protection>
                <TripsListPage />
              </Protection>
            }
          />
          <Route
            path="/importantInfo"
            element={
              <Protection>
                <TripImportantInfoPage />
              </Protection>
            }
          />

          {/* Catch-all 404 */}
          <Route
            path="*"
            element={
              <Protection>
                <NotFound />
              </Protection>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
