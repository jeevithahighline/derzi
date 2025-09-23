import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;
  private apiUrl: string | null = null;
  private configPromise: Promise<void>;

  constructor() {
    this.configPromise = this.loadConfig();
  }

  public async loadConfig(): Promise<void> {
    try {
      const response = await fetch('/assets/config.json');
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      this.config = await response.json();
      this.apiUrl = this.config?.apiUrl || environment.apiUrl; // Cache the API URL
    } catch (error) {
      console.error('Failed to load config.json:', error);
      this.apiUrl = environment.apiUrl; // Fallback to environment URL if config loading fails
    }
  }

  // This method now returns the cached apiUrl synchronously after the config is loaded
  getApiUrl(): string {
    if (this.apiUrl) {
      return this.apiUrl;
    } else {
      console.warn('API URL requested before config was loaded.');
      //return environment.apiUrl; // Default to environment API URL if called too early
    }
  }

  async ensureConfigLoaded(): Promise<void> {
    await this.configPromise;
  }
}
