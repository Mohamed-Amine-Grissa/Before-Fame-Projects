import type {
  VehicleRegistrationPayload,
  CompleteRegistrationPayload,
  OtpRequest,
  OtpVerification,
  ApiResponse,
} from "../types/api";

const API_URL = "http://localhost:8080"; // Ton Backend Spring Boot
const API_BASE = `${API_URL}/api`;

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const defaultOptions: RequestInit = {
      headers: { "Content-Type": "application/json" },
      ...options,
    };

    const response = await fetch(url, defaultOptions);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }
    return response.json();
  }

  // --- FLUX IDENTIFICATION (ÉTAPE 1 & 2) ---

  // Initialise la session (Renvoie le verificationId)
  async initializePlateType(plateType: string): Promise<{ success: boolean; verificationId: string }> {
    return this.request("/v1/vehicles/identify", {
      method: "POST",
      body: JSON.stringify({ plateType }),
    });
  }

  // Vérifie le VIN + Plaque (Utilise le verificationId)
  async verifyVehicleDetails(verificationId: string, chassisNumber: string, plateNumber: string): Promise<{ success: boolean; message: string }> {
    return this.request("/v1/vehicles/verify", {
      method: "POST",
      body: JSON.stringify({ verificationId, chassisNumber, plateNumber }),
    });
  }

  // --- FLUX INSCRIPTION (ÉTAPE 3) ---

  // Crée l'utilisateur (Renvoie l'ID utilisateur pour l'OTP)
  async registerUser(data: any): Promise<{ id: string; success: boolean }> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // --- FLUX SÉCURITÉ OTP (ÉTAPE 4) ---

  // Envoie le SMS via Twilio
  async sendOtp(userId: string, countryCode: string, phoneNumber: string): Promise<any> {
    return this.request("/otp/send", {
      method: "POST",
      body: JSON.stringify({ userId, countryCode, phoneNumber }),
    });
  }

  // Vérifie le code saisi
  async verifyOtp(userId: string, otp: string): Promise<{ success: boolean; retriesRemaining: number }> {
    return this.request("/otp/verify", {
      method: "POST",
      body: JSON.stringify({ userId, otp }),
    });
  }

  // Option Resend
  async resendOtp(userId: string, countryCode: string, phoneNumber: string): Promise<any> {
    return this.request("/otp/resend", {
      method: "POST",
      body: JSON.stringify({ userId, countryCode, phoneNumber }),
    });
  }
}

export const apiService = new ApiService();
