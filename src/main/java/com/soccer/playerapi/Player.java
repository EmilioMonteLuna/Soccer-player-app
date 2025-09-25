package com.soccer.playerapi;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;

@Entity
@Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String position;
    private Integer age;
    private String team;
    private Integer goals = 0;
    private Integer assists = 0;

    // Default constructor
    public Player() {}

    // Constructor without ID (for creating new players)
    public Player(String name, String position, Integer age, String team, Integer goals, Integer assists) {
        this.name = name;
        this.position = position;
        this.age = age;
        this.team = team;
        this.goals = goals;
        this.assists = assists;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getTeam() { return team; }
    public void setTeam(String team) { this.team = team; }

    public Integer getGoals() { return goals; }
    public void setGoals(Integer goals) { this.goals = goals; }

    public Integer getAssists() { return assists; }
    public void setAssists(Integer assists) { this.assists = assists; }
}
