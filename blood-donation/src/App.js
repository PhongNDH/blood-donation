import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import WebFont from "webfontloader";

import Navigation from "./routes/navigation/navigation.component.jsx";
import Home from "./routes/home/home.component.jsx";
import Signin from "./routes/signin/signin.component.jsx";
import Register from "./routes/register/register.component.jsx";
import Profile from "./routes/profile/profile.component.jsx";
import Main from "./routes/main/main.component.jsx";
import Gift from "./routes/gift/gift.component.jsx";
import Statistics from "./routes/statistics/statistic.component.jsx";
import UserDetail from "./routes/user-detail/user-details.component.jsx";
import DonationInspection from "./routes/donation-inspection/donation-inspection.component.jsx";
import RequestInspection from "./routes/request-inspection/request-inspection.component.jsx";
import Donation from "./routes/donation/donation.component.jsx";
import Request from "./routes/request/request.component.jsx";
import UserHistory from "./routes/user-history/user-history.component.jsx";
import AdminHistory from "./routes/admin-history/admin-history.component.jsx";

const App = () => {
  useEffect(() => {
    WebFont.load({
      google: {
        families: [
          "Rubik Bubbles",
          "Roboto",
          "Righteous",
          "Lilita One",
          "Kavoon",
          "Shantell Sans",
          "Fugaz One",
          "Niramit",
        ],
      },
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Navigate to="/home" />}></Route>
        <Route path="home" element={<Home />}>
          <Route index element={<Main />}></Route>
          <Route path="gift" element={<Gift />}></Route>
          <Route path="statistics" element={<Statistics />}></Route>
          <Route path="user-details" element={<UserDetail />}></Route>
          <Route path="admin-donation" element={<DonationInspection />}></Route>
          <Route path="admin-request" element={<RequestInspection />}></Route>
          <Route path="user-donate" element={<Donation />}></Route>
          <Route path="user-request" element={<Request />}></Route>
          <Route path="user-history" element={<UserHistory />}></Route>
          <Route path="admin-history" element={<AdminHistory />}></Route>
        </Route>
        <Route path="signin" element={<Signin />}></Route>
        <Route path="register" element={<Register />}></Route>
        <Route path="profile" element={<Profile />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
