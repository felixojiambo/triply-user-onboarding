export interface VerificationService {
  sendCode(email: string): Promise<void>;
  verifyCode(code: string): Promise<boolean>;
}

const verificationService: VerificationService = {
  sendCode(_email: string) {
    // Mock API call: resolve after 500ms
    return new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
  },

  verifyCode(_code: string) {
    // Mock API call: resolve “true” after 500ms
    return new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  }
};

export default verificationService;
