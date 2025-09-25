import React, { useState, useEffect } from 'react';
import { Player } from '../types/Player';
import PlayerService from '../services/PlayerService';
import PlayerForm from './PlayerForm';
import './PlayerList.css';

const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    filterAndSortPlayers();
  }, [players, searchTerm, selectedPosition, sortBy]);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PlayerService.getAllPlayers();
      setPlayers(data);
    } catch (error) {
      console.error('Error loading players:', error);
      setError('Failed to load players. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPlayers = () => {
    let filtered = [...players];

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.team.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by position
    if (selectedPosition) {
      filtered = filtered.filter(player => player.position === selectedPosition);
    }

    // Sort players
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'age':
          return a.age - b.age;
        case 'goals':
          return (b.goals || 0) - (a.goals || 0);
        case 'assists':
          return (b.assists || 0) - (a.assists || 0);
        default:
          return 0;
      }
    });

    setFilteredPlayers(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDelete = async (id: number, playerName: string) => {
    if (window.confirm(`Are you sure you want to delete ${playerName}? This action cannot be undone.`)) {
      try {
        await PlayerService.deletePlayer(id);
        await loadPlayers();
        // Show success message
        setTimeout(() => {
          alert(`${playerName} has been successfully removed from the roster.`);
        }, 100);
      } catch (error) {
        console.error('Error deleting player:', error);
        setError(`Failed to delete ${playerName}. Please try again.`);
      }
    }
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setShowForm(true);
  };

  const handlePlayerSaved = () => {
    setShowForm(false);
    setEditingPlayer(null);
    loadPlayers();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPosition('');
    setSortBy('name');
  };

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case 'goalkeeper': return '#ff6b6b';
      case 'defender': return '#4ecdc4';
      case 'midfielder': return '#45b7d1';
      case 'forward': return '#96ceb4';
      default: return '#feca57';
    }
  };

  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  if (loading) {
    return (
      <div className="player-list-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading players...
        </div>
      </div>
    );
  }

  return (
    <div className="player-list-container">
      <header className="header">
        <h1>⚽ Soccer Player Manager</h1>

        {/* Enhanced Search and Filter Section */}
        <div className="controls-section">
          <div className="search-filters">
            <input
              type="text"
              placeholder="Search by name or team..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />

            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="filter-select"
            >
              <option value="">All Positions</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Sort by Name</option>
              <option value="age">Sort by Age</option>
              <option value="goals">Sort by Goals</option>
              <option value="assists">Sort by Assists</option>
            </select>

            <button onClick={clearFilters} className="clear-btn">
              Clear Filters
            </button>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="add-player-btn"
          >
            + Add New Player
          </button>
        </div>
      </header>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      {showForm && (
        <PlayerForm
          player={editingPlayer}
          onSave={handlePlayerSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingPlayer(null);
          }}
        />
      )}

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-number">{filteredPlayers.length}</span>
          <span className="stat-label">Players Shown</span>
        </div>
        <div className="stat">
          <span className="stat-number">{players.length}</span>
          <span className="stat-label">Total Players</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {filteredPlayers.reduce((sum, player) => sum + (player.goals || 0), 0)}
          </span>
          <span className="stat-label">Total Goals</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {filteredPlayers.reduce((sum, player) => sum + (player.assists || 0), 0)}
          </span>
          <span className="stat-label">Total Assists</span>
        </div>
      </div>

      <div className="players-grid">
        {filteredPlayers.length === 0 ? (
          <div className="no-players">
            {players.length === 0 ? (
              <>
                <h3>No players in your roster yet</h3>
                <p>Add your first player to get started building your team!</p>
              </>
            ) : (
              <>
                <h3>No players match your search criteria</h3>
                <p>Try adjusting your filters or search terms.</p>
              </>
            )}
          </div>
        ) : (
          filteredPlayers.map(player => (
            <div key={player.id} className="player-card">
              <div
                className="position-badge"
                style={{ backgroundColor: getPositionColor(player.position) }}
              >
                {player.position}
              </div>
              <div className="player-info">
                <h3 className="player-name">{player.name}</h3>
                <p className="player-team">🏆 {player.team}</p>
                <p className="player-age">Age: {player.age}</p>
                <div className="player-stats">
                  <span className="stat-item">⚽ {player.goals || 0} goals</span>
                  <span className="stat-item">🎯 {player.assists || 0} assists</span>
                </div>
              </div>
              <div className="card-actions">
                <button
                  onClick={() => handleEdit(player)}
                  className="edit-btn"
                  title="Edit player information"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(player.id!, player.name)}
                  className="delete-btn"
                  title="Delete player from roster"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <button
        className="fab-add-player"
        onClick={() => setShowForm(true)}
        title="Add New Player"
      >
        +
      </button>
    </div>
  );
};

export default PlayerList;
