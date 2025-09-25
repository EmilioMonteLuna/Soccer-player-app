import React, { useState, useEffect } from 'react';
import { Player } from '../types/Player';
import PlayerService from '../services/PlayerService';
import './PlayerForm.css';

interface PlayerFormProps {
  player?: Player | null;
  onSave: () => void;
  onCancel: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ player, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Player>({
    name: '',
    position: '',
    age: 18,
    team: '',
    goals: 0,
    assists: 0
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (player) {
      setFormData(player);
    }
  }, [player]);

  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'goals' || name === 'assists'
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (player?.id) {
        await PlayerService.updatePlayer(player.id, formData);
      } else {
        await PlayerService.createPlayer(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving player:', error);
      alert('Error saving player. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>{player ? 'Edit Player' : 'Add New Player'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Player Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter player name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Position *</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              >
                <option value="">Select Position</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="16"
                max="50"
              />
            </div>
            <div className="form-group">
              <label htmlFor="team">Team *</label>
              <input
                type="text"
                id="team"
                name="team"
                value={formData.team}
                onChange={handleChange}
                required
                placeholder="Enter team name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="goals">Goals</label>
              <input
                type="number"
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="assists">Assists</label>
              <input
                type="number"
                id="assists"
                name="assists"
                value={formData.assists}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="cancel-btn"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={saving}
            >
              {saving ? 'Saving...' : (player ? 'Update Player' : 'Add Player')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerForm;
