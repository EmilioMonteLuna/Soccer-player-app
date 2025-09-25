package com.soccer.playerapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;

    // Get all players
    @GetMapping
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    // Get player by ID
    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id) {
        Optional<Player> player = playerRepository.findById(id);
        return player.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Create new player
    @PostMapping
    public ResponseEntity<Player> createPlayer(@RequestBody Player player) {
        Player savedPlayer = playerRepository.save(player);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPlayer);
    }

    // Update existing player
    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable Long id, @RequestBody Player playerDetails) {
        Optional<Player> optionalPlayer = playerRepository.findById(id);
        if (optionalPlayer.isPresent()) {
            Player player = optionalPlayer.get();
            player.setName(playerDetails.getName());
            player.setPosition(playerDetails.getPosition());
            player.setAge(playerDetails.getAge());
            player.setTeam(playerDetails.getTeam());
            player.setGoals(playerDetails.getGoals());
            player.setAssists(playerDetails.getAssists());
            return ResponseEntity.ok(playerRepository.save(player));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete player
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlayer(@PathVariable Long id) {
        if (playerRepository.existsById(id)) {
            playerRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Search players by name
    @GetMapping("/search")
    public List<Player> searchPlayersByName(@RequestParam String name) {
        return playerRepository.findByNameContainingIgnoreCase(name);
    }

    // Get players by position
    @GetMapping("/position/{position}")
    public List<Player> getPlayersByPosition(@PathVariable String position) {
        return playerRepository.findByPosition(position);
    }

    // Get players by team
    @GetMapping("/team/{team}")
    public List<Player> getPlayersByTeam(@PathVariable String team) {
        return playerRepository.findByTeam(team);
    }
}
