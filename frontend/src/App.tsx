import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AIInsightsWidget from './components/AIInsightsWidget/AIInsightsWidget';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './App.css';
const Home = lazy(() => import('./pages/Home/Home'));
const HealthcareOverview = lazy(() => import('./pages/HealthcareOverview/HealthcareOverview'));
const PatientAnalytics = lazy(() => import('./pages/PatientAnalytics/PatientAnalytics'));
const HospitalAnalytics = lazy(() => import('./pages/HospitalAnalytics/HospitalAnalytics'));
const ReadmissionAnalytics = lazy(() => import('./pages/ReadmissionAnalytics/ReadmissionAnalytics'));
const PredictionHub = lazy(() => import('./pages/PredictionHub/PredictionHub'));
const DiabetesPrediction = lazy(() => import('./pages/DiabetesPrediction/DiabetesPrediction'));
const ReadmissionPrediction = lazy(() => import('./pages/ReadmissionPrediction/ReadmissionPrediction'));
// const AIInsights = lazy(() => import('./pages/AIInsights/AIInsights'));
const About = lazy(() => import('./pages/About/About'));
const HospitalStayPrediction = lazy(
  () => import('./pages/HospitalStayPrediction/HospitalStayPrediction')
);
export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <ErrorBoundary>
          <Suspense fallback={<div style={{ height: '100vh' }} />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analytics" element={<HealthcareOverview />} />
              <Route path="/analytics/overview" element={<HealthcareOverview />} />
              <Route path="/analytics/patients" element={<PatientAnalytics />} />
              <Route path="/analytics/hospital" element={<HospitalAnalytics />} />
              <Route path="/analytics/readmission" element={<ReadmissionAnalytics />} />
              <Route path="/prediction" element={<PredictionHub />} />
              <Route path="/prediction/diabetes" element={<DiabetesPrediction />} />
              <Route path="/prediction/readmission" element={<ReadmissionPrediction />} />
              <Route path="/prediction/hospital-stay" element={<HospitalStayPrediction />}/>
              {/* <Route path="/insights" element={<AIInsights />} /> */}
              <Route path="/about" element={<About />} />
              <Route path="*" element={<div className="eb"><h2>Page not found</h2></div>} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <AIInsightsWidget />
    </div>
  );
}
