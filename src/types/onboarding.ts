export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: File; // JPG/PNG ≤ 2 MB
}

export interface BusinessDetails {
  businessName: string;
  businessLogo: File; // JPG/PNG ≤ 2 MB
  industry: string; // from API
  companySize: CompanySize;
  businessDocument: File; // PDF ≤ 5 MB
}

export const CompanySize = {
  Small: "1-10",
  MediumSmall: "11-50",
  Medium: "51-200",
  MediumLarge: "201-500",
  Large: "500+",
} as const;

export type CompanySize = (typeof CompanySize)[keyof typeof CompanySize];

export interface VerificationState {
  emailCode: string; // 6-digit numeric
  isCodeSent: boolean;
  isVerified: boolean;
}
