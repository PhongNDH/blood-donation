export const BloodType = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
];

export const BloodTypeAndSQLName = [
  { blood_type: "A+", name: "Group_A_Plus" },
  { blood_type: "A-", name: "Group_A_Minus" },
  { blood_type: "B+", name: "Group_B_Plus" },
  { blood_type: "B-", name: "Group_B_Minus" },
  { blood_type: "AB+", name: "Group_AB_Plus" },
  { blood_type: "AB-", name: "Group_AB_Minus" },
  { blood_type: "O+", name: "Group_O_Plus" },
  { blood_type: "O-", name: "Group_O_Minus" },
];

export const Diseases = [
  { value: "AIDS", label: "AIDS" },
  { value: "Anemia", label: "Anemia" },
  { value: "Asthma", label: "Asthma" },
  { value: "Bleeding disorders", label: "Bleeding disorders" },
  { value: "Cancer", label: "Cancer" },
  { value: "Heart disease, severe", label: "Heart disease, severe" },
  { value: "Hepatitis B", label: "Hepatitis B" },
  { value: "Hepatitis C", label: "Hepatitis C" },
  { value: "High blood pressure", label: "High blood pressure" },
  { value: "Low blood pressure", label: "Low blood pressure" },
  { value: "Malaria", label: "Malaria" },
  { value: "Hemochromatosis", label: "Hemochromatosis" },
  { value: "Syphilis or Gonorrhea ", label: "Syphilis or Gonorrhea" },
  { value: "Active tuberculosis", label: "Active tuberculosis" },
  { value: "Pregnancy", label: "Pregnancy" },
  { value: "Other", label: "Other" },
];

export const Reasons = [
  { value: "Kidney disease", label: "Kidney disease" },
  { value: "Anemia", label: "Anemia" },
  { value: "Hemophilia", label: "Hemophilia" },
  { value: "Liver disease", label: "Liver disease" },
  { value: "Cancer", label: "Cancer" },
  { value: "Severe infection", label: "Severe infection" },
  { value: "Sickle cell disease", label: "Sickle cell disease" },
  { value: "Thrombocytopenia", label: "Thrombocytopenia" },
  { value: "Iron deficiency", label: "Iron deficiency" },
  { value: "Bleeding disorder", label: "Bleeding disorder" },
  { value: "Fever", label: "Fever" },
  { value: "Other", label: "Other" },
];

export const SQLReasons = [
  "'Kidney disease'",
  "'Anemia'",
  "'Hemophilia'",
  "'Liver disease'",
  "'Cancer'",
  "'Severe infection'",
  "'Sickle cell disease'",
  "'Thrombocytopenia'",
  "'Iron deficiency'",
  "'Bleeding disorder'",
  "'Fever'",
];

export const Unit = [
  { value: "250", label: "250 ml" },
  { value: "350", label: "350 ml" },
  { value: "450", label: "450 ml" },
];

export const GenderType = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const State = [
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export const BloodRecieved = [
  {
    blood_type: "O+",
    received: [
      {
        value: "Group_O_Plus",
        label: "O+",
      },
      {
        value: "Group_O_Minus",
        label: "O-",
      },
    ],
  },
  {
    blood_type: "O-",
    received: [
      {
        value: "Group_O_Minus",
        label: "O-",
      },
    ],
  },
  {
    blood_type: "A+",
    received: [
      {
        value: "Group_A_Plus",
        label: "A+",
      },
      {
        value: "Group_A_Minus",
        label: "A-",
      },
      {
        value: "Group_O_Plus",
        label: "O+",
      },
      {
        value: "Group_O_Minus",
        label: "O-",
      },
    ],
  },
  {
    blood_type: "A-",
    received: [
      {
        value: "Group_A_Minus",
        label: "A-",
      },
      {
        value: "Group_O_Minus",
        label: "O-",
      },
    ],
  },
  {
    blood_type: "B+",
    received: [
      {
        value: "Group_B_Plus",
        label: "B+",
      },
      {
        value: "Group_B_Minus",
        label: "B-",
      },
      {
        value: "Group_O_Plus",
        label: "O+",
      },
      {
        value: "Group_O_Minus",
        label: "O-",
      },
    ],
  },
  {
    blood_type: "B-",
    received: [
      {
        value: "Group_B_Minus",
        label: "B-",
      },
      {
        value: "Group_O_Minus",
        label: "O-",
      },
    ],
  },
  {
    blood_type: "AB+",
    received: [
      {
        value: "Group_O_Plus",
        label: "O+",
      },
      {
        value: "Group_O_Minus",
        label: "O-",
      },
      {
        value: "Group_A_Plus",
        label: "A+",
      },
      {
        value: "Group_A_Minus",
        label: "A-",
      },
      {
        value: "Group_B_Plus",
        label: "B+",
      },
      {
        value: "Group_B_Minus",
        label: "B-",
      },
      {
        value: "Group_AB_Plus",
        label: "AB+",
      },
      {
        value: "Group_AB_Minus",
        label: "AB-",
      },
    ],
  },
  {
    blood_type: "AB-",
    received: [
      {
        value: "Group_O_Minus",
        label: "O-",
      },
      {
        value: "Group_A_Minus",
        label: "A-",
      },
      {
        value: "Group_AB_Minus",
        label: "B-",
      },
      {
        value: "Group_AB_Minus",
        label: "AB-",
      },
    ],
  },
];
