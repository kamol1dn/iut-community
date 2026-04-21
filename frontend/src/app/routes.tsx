import { createBrowserRouter } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { OverviewPage } from "./components/OverviewPage";
import { TimetablePage } from "./components/TimetablePage";
import { RoomsPage } from "./components/RoomsPage";
import { CommunityPage } from "./components/CommunityPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: OverviewPage },
      { path: "timetable", Component: TimetablePage },
      { path: "rooms", Component: RoomsPage },
      { path: "community", Component: CommunityPage },
    ],
  },
]);
