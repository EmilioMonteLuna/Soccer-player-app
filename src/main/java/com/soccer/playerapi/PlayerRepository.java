package com.soccer.playerapi;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByNameContainingIgnoreCase(String name);
    List<Player> findByPosition(String position);
    List<Player> findByTeam(String team);
}
