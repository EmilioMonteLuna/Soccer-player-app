package com.soccer.playerapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private PlayerRepository playerRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only add sample data if database is empty
        if (playerRepository.count() == 0) {
            initializeSampleData();
        }
    }

    private void initializeSampleData() {
        // Add sample players from famous soccer teams
        Player[] samplePlayers = {
            new Player("Lionel Messi", "Forward", 36, "Inter Miami", 25, 12),
            new Player("Cristiano Ronaldo", "Forward", 39, "Al Nassr", 28, 8),
            new Player("Virgil van Dijk", "Defender", 32, "Liverpool", 3, 1),
            new Player("Kevin De Bruyne", "Midfielder", 32, "Manchester City", 8, 15),
            new Player("Alisson Becker", "Goalkeeper", 30, "Liverpool", 0, 0),
            new Player("Kylian Mbappé", "Forward", 25, "PSG", 22, 7),
            new Player("Luka Modrić", "Midfielder", 38, "Real Madrid", 5, 9),
            new Player("Sergio Ramos", "Defender", 37, "Sevilla", 4, 2),
            new Player("Robert Lewandowski", "Forward", 35, "Barcelona", 20, 6),
            new Player("Thibaut Courtois", "Goalkeeper", 31, "Real Madrid", 0, 0),
            new Player("Erling Haaland", "Forward", 23, "Manchester City", 31, 4),
            new Player("Joshua Kimmich", "Midfielder", 28, "Bayern Munich", 7, 11)
        };

        for (Player player : samplePlayers) {
            playerRepository.save(player);
        }

        System.out.println("✅ Sample data initialized with " + samplePlayers.length + " players");
    }
}
