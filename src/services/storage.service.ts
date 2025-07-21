import fs from 'fs/promises';
import path from 'path';

export class StorageService {
  private dataPath: string;

  constructor() {
    // In production, this would be a database
    // For development, we use JSON files
    this.dataPath = path.join(process.cwd(), 'src', 'data');
  }

  /**
   * Read JSON file
   */
  async readJSON<T>(filename: string): Promise<T> {
    try {
      const filePath = path.join(this.dataPath, filename);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      throw new Error(`Failed to read ${filename}`);
    }
  }

  /**
   * Write JSON file
   */
  async writeJSON<T>(filename: string, data: T): Promise<void> {
    try {
      const filePath = path.join(this.dataPath, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      throw new Error(`Failed to write ${filename}`);
    }
  }

  /**
   * Update JSON file with a transformer function
   */
  async updateJSON<T>(
    filename: string, 
    transformer: (data: T) => T
  ): Promise<T> {
    const data = await this.readJSON<T>(filename);
    const updated = transformer(data);
    await this.writeJSON(filename, updated);
    return updated;
  }

  /**
   * Check if file exists
   */
  async exists(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.dataPath, filename);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Ensure data directory exists
   */
  async ensureDataDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
    } catch (error) {
      console.error('Error creating data directory:', error);
    }
  }
}

// Export singleton instance for server-side use
export const storageService = new StorageService();