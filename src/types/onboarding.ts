export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: File;        // JPG/PNG ≤ 2 MB
}

export interface BusinessDetails {
  businessName: string;
  businessLogo: File;        // JPG/PNG ≤ 2 MB
  industry: string;          // from API
  companySize: CompanySize;
  businessDocument: File;    // PDF ≤ 5 MB
}

export type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '500+';

export interface VerificationState {
  emailCode: string;         // 6-digit numeric
  isCodeSent: boolean;
  isVerified: boolean;
}
