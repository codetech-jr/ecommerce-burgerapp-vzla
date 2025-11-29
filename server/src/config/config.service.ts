import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  private cachedTasa: number | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hora en milisegundos

  // URL de la API de DolarAPI.com (tasa oficial del BCV)
  private getBcvApiUrl(): string {
    return process.env.BCV_API_URL || 'https://ve.dolarapi.com/v1/dolares/oficial';
  }

  // Obtiene la tasa desde la API de DolarAPI.com (tasa oficial del BCV)
  async fetchTasaFromBcv(): Promise<number> {
    try {
      const apiUrl = this.getBcvApiUrl();
      this.logger.log(`Consultando tasa oficial del BCV desde: ${apiUrl}`);
      
      const response = await axios.get(apiUrl, {
        timeout: 10000, // 10 segundos de timeout
        headers: {
          'Accept': 'application/json',
        },
      });

      // La API retorna: { fuente: "oficial", nombre: "Oficial", promedio: 243.11, ... }
      const data = response.data as any;
      
      // Extraer el campo "promedio" que es la tasa oficial del BCV
      if (data.promedio !== null && data.promedio !== undefined) {
        const tasa = parseFloat(data.promedio.toString());
        if (!isNaN(tasa) && tasa > 0) {
          this.logger.log(`Tasa obtenida del BCV: ${tasa}`);
          return tasa;
        }
      }

      this.logger.warn('Campo "promedio" no válido en la respuesta, usando fallback');
      return this.getFallbackTasa();
      
    } catch (error: any) {
      this.logger.error(`Error al obtener tasa del BCV: ${error.message}`);
      return this.getFallbackTasa();
    }
  }

  // Tasa de respaldo si falla la API
  private getFallbackTasa(): number {
    const tasaFromEnv = process.env.TASA_CAMBIO;
    return tasaFromEnv ? parseFloat(tasaFromEnv) : 45;
  }

  // Obtiene la tasa con caché (para no hacer demasiadas llamadas)
  async getTasa(): Promise<number> {
    const now = Date.now();
    
    // Si tenemos caché válido, retornarlo
    if (this.cachedTasa && (now - this.lastFetchTime) < this.CACHE_DURATION) {
      return this.cachedTasa;
    }

    // Si no, obtener de la API
    const tasa = await this.fetchTasaFromBcv();
    this.cachedTasa = tasa;
    this.lastFetchTime = now;
    
    return tasa;
  }

  // Retorna toda la configuración
  async getConfig() {
    const tasa = await this.getTasa();
    return {
      tasa: tasa,
      lastUpdate: new Date().toISOString(),
      source: 'BCV',
    };
  }
}

