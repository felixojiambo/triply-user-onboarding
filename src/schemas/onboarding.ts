import { z } from 'zod';
import { CompanySize } from '@/types/onboarding';

// Reusable file validators
const fileType = (types: string[]) =>
  (file: File) => types.includes(file.type);
const fileSizeMax = (maxBytes: number) =>
  (file: File) => file.size <= maxBytes;

// Step 1: PersonalDetails
export const personalDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  email:     z.string().email('Invalid email address'),
  phone:     z.string()
               .regex(/^\+?\d{7,15}$/, 'Invalid phone number'),
  profileImage: z
    .instanceof(File)
    .refine(fileType(['image/jpeg', 'image/png']), 'Must be JPG or PNG')
    .refine(fileSizeMax(2 * 1024 * 1024),      'Max 2 MB'),
});

// Step 2: BusinessDetails
export const businessDetailsSchema = z.object({
  businessName:     z.string().min(1, 'Business name is required'),
  businessLogo:     z
    .instanceof(File)
    .refine(fileType(['image/jpeg','image/png']), 'Logo must be JPG or PNG')
    .refine(fileSizeMax(2 * 1024 * 1024),         'Max 2 MB'),
  industry:         z.string().min(1, 'Industry is required'),
  companySize:      z.nativeEnum(CompanySize),
  businessDocument: z
    .instanceof(File)
    .refine(fileType(['application/pdf']), 'Document must be PDF')
    .refine(fileSizeMax(5 * 1024 * 1024),  'Max 5 MB'),
});

// Step 3: VerificationState
export const verificationSchema = z.object({
  emailCode:  z.string()
                .length(6, 'Code must be 6 digits')
                .regex(/^\d{6}$/, 'Numeric only'),
  isCodeSent: z.boolean(),
  isVerified: z.boolean(),
});
