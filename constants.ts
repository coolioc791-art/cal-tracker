
export const STORAGE_KEY = 'WELLNESS_APP_DATA_V1';

export const HEALTH_RESOURCES = [
  {
    title: "CDC Healthy Weight",
    url: "https://www.cdc.gov/healthyweight/index.html",
    description: "Reliable information on maintaining a healthy lifestyle."
  },
  {
    title: "MyPlate - USDA",
    url: "https://www.myplate.gov/",
    description: "Guidance on balanced eating and food groups."
  },
  {
    title: "KidsHealth",
    url: "https://kidshealth.org/",
    description: "Doctor-approved advice for kids, teens, and parents."
  }
];

export const calculateBMI = (weightLbs: number, feet: number, inches: number): number => {
  const totalInches = (feet * 12) + inches;
  if (totalInches === 0) return 0;
  return (weightLbs * 703) / (totalInches * totalInches);
};

export const getHealthyWeightRange = (feet: number, inches: number, age: number) => {
  const totalInches = (feet * 12) + inches;
  if (totalInches === 0) return { min: 0, max: 0 };
  
  // Simplified BMI ranges for target setting
  // Adults: 18.5 - 25.0
  // Teens (simplified approximation): 17.5 - 24.0
  const minBMI = age < 18 ? 17.5 : 18.5;
  const maxBMI = age < 18 ? 24.0 : 25.0;
  
  const minWeight = (minBMI * (totalInches * totalInches)) / 703;
  const maxWeight = (maxBMI * (totalInches * totalInches)) / 703;
  
  return {
    min: Math.round(minWeight * 10) / 10,
    max: Math.round(maxWeight * 10) / 10
  };
};
