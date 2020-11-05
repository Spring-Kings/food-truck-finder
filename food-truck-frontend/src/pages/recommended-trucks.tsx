import React from 'react';
import CreateTruckForm from "../components/CreateTruckForm";
import CoolLayout from '../components/CoolLayout';
import RecommendedTrucksForm from '../components/recommended-trucks/SearchRecommendedTrucksForm';

function CreateTruckPage() {
  return (
    <CoolLayout>
      <RecommendedTrucksForm/>
    </CoolLayout>
  );
}

export default CreateTruckPage;