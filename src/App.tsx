import './styles/global.css';
import './styles/index.scss';
import './styles/scss/main.scss';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from './pages';
import Message from './pages/message';
import UserDashboardPage from './pages/dashboard/user';
import ShopPage from './pages/dashboard/user/shop';
import Review from './pages/dashboard/user/shop/review';
import AdditionalInformationPage from './pages/dashboard/user/additional-information';
import AssessmentRequestInformationPage from './pages/dashboard/user/assestment-request';
import NoticeDetail from './layouts/notices-list/detail';
import ForgetPasswordView from './pages/forgot-password';
import PasswordResetView from './pages/password-reset';
import ProtectedRoute from './pages/login/routeProtect';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div translate="no">
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/message/:senderId/:receiverId" element={<Message />} />
          <Route path="/notice/:noticeId" element={<NoticeDetail />} />
          <Route path="/forget-password" element={<ForgetPasswordView />} />
          <Route path="/reset-password" element={<PasswordResetView />} />

          {/* <Route element={<ProtectedRoute allowedRoles={['ROLE_USER']} />}> */}
            <Route path="/user" element={<UserDashboardPage />} />
            <Route path="/user/extra/information/:shopId" element={<AdditionalInformationPage />} />
            <Route
              path="/user/assessement/information/:shopId"
              element={<AssessmentRequestInformationPage />}
            />
            <Route path="/user/:shopId" element={<ShopPage />} />
            <Route path="/user/review/:shopId" element={<Review />} />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
