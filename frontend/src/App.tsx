import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Users from './pages/Users';
import UserProfile from './pages/UserProfile';
import MealPlans from './pages/MealPlans';
import MealPlanDetail from './pages/MealPlanDetail';
import GroceryList from './pages/GroceryList';
import Constraints from './pages/Constraints';
import Foods from './pages/Foods';
import StyleGuide from './pages/StyleGuide';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/users"
          element={
            <Layout>
              <Users />
            </Layout>
          }
        />
        <Route
          path="/users/:userId/profile"
          element={
            <Layout>
              <UserProfile />
            </Layout>
          }
        />
        <Route
          path="/users/:userId/constraints"
          element={
            <Layout>
              <Constraints />
            </Layout>
          }
        />
        <Route
          path="/meal-plans"
          element={
            <Layout>
              <MealPlans />
            </Layout>
          }
        />
        <Route
          path="/meal-plans/:id"
          element={
            <Layout>
              <MealPlanDetail />
            </Layout>
          }
        />
        <Route
          path="/meal-plans/:id/grocery-list"
          element={
            <Layout>
              <GroceryList />
            </Layout>
          }
        />
        <Route
          path="/foods"
          element={
            <Layout>
              <Foods />
            </Layout>
          }
        />
        <Route path="/style-guide" element={<StyleGuide />} />
      </Routes>
    </Router>
  );
}

export default App;

