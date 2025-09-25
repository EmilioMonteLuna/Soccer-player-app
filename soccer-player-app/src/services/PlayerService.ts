import axios from 'axios';
import { Player } from '../types/Player';

class PlayerService {
  private BASE_URL = 'http://localhost:8080/api/players';

  async getAllPlayers(): Promise<Player[]> {
    const response = await axios.get(this.BASE_URL);
    return response.data;
  }

  async getPlayerById(id: number): Promise<Player> {
    const response = await axios.get(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async createPlayer(player: Player): Promise<Player> {
    const response = await axios.post(this.BASE_URL, player);
    return response.data;
  }

  async updatePlayer(id: number, player: Player): Promise<Player> {
    const response = await axios.put(`${this.BASE_URL}/${id}`, player);
    return response.data;
  }

  async deletePlayer(id: number): Promise<void> {
    await axios.delete(`${this.BASE_URL}/${id}`);
  }

  async searchPlayers(name: string): Promise<Player[]> {
    const response = await axios.get(`${this.BASE_URL}/search?name=${name}`);
    return response.data;
  }

  async getPlayersByPosition(position: string): Promise<Player[]> {
    const response = await axios.get(`${this.BASE_URL}/position/${position}`);
    return response.data;
  }

  async getPlayersByTeam(team: string): Promise<Player[]> {
    const response = await axios.get(`${this.BASE_URL}/team/${team}`);
    return response.data;
  }
}

export default new PlayerService();
