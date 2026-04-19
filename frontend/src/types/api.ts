export interface VehicleRegistrationPayload {
  plateType: string;
}

export interface CompleteRegistrationPayload {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
}

export interface OtpRequest {
  userId: string;
  countryCode: string;
  phoneNumber: string;
}

export interface OtpVerification {
  userId: string;
  otp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
