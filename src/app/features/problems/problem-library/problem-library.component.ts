import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  Problem,
  CodingPattern,
  Difficulty,
  PATTERN_INFO,
} from '../models/problem.model';
import {
  LEETCODE_PROBLEMS,
  getDifficultyStats,
  getPatternStats,
} from '../data/problems.data';

/**
 * Problem Library Component
 * Unified view of all LeetCode problems with filtering
 */
@Component({
  selector: 'app-problem-library',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './problem-library.component.html',
  styleUrls: ['./problem-library.component.scss'],
})
export class ProblemLibraryComponent implements OnInit {
  // All problems
  allProblems: Problem[] = LEETCODE_PROBLEMS;

  // Filtered problems
  filteredProblems: Problem[] = [];

  // Filter state
  selectedPattern: CodingPattern | 'ALL' = 'ALL';
  selectedDifficulty: Difficulty | 'ALL' = 'ALL';
  searchQuery: string = '';
  showOnlyVisualized: boolean = false;

  // Enums for template
  CodingPattern = CodingPattern;
  Difficulty = Difficulty;
  PATTERN_INFO = PATTERN_INFO;

  // Stats
  difficultyStats = getDifficultyStats();
  patternStats = getPatternStats();

  // Pattern list
  patterns = Object.values(CodingPattern);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  /**
   * Apply all filters
   */
  applyFilters(): void {
    let filtered = [...this.allProblems];

    // Pattern filter
    if (this.selectedPattern !== 'ALL') {
      filtered = filtered.filter((p) => p.pattern === this.selectedPattern);
    }

    // Difficulty filter
    if (this.selectedDifficulty !== 'ALL') {
      filtered = filtered.filter((p) => p.difficulty === this.selectedDifficulty);
    }

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.id.toString().includes(query)
      );
    }

    // Show only visualized
    if (this.showOnlyVisualized) {
      filtered = filtered.filter((p) => p.hasVisualization);
    }

    this.filteredProblems = filtered;
  }

  /**
   * Reset all filters
   */
  resetFilters(): void {
    this.selectedPattern = 'ALL';
    this.selectedDifficulty = 'ALL';
    this.searchQuery = '';
    this.showOnlyVisualized = false;
    this.applyFilters();
  }

  /**
   * Navigate to problem visualization
   */
  viewProblem(problem: Problem): void {
    if (problem.hasVisualization && problem.route) {
      this.router.navigate([problem.route]);
    }
  }

  /**
   * Get difficulty badge class
   */
  getDifficultyClass(difficulty: Difficulty): string {
    const map: Record<Difficulty, string> = {
      [Difficulty.EASY]: 'difficulty-easy',
      [Difficulty.MEDIUM]: 'difficulty-medium',
      [Difficulty.HARD]: 'difficulty-hard',
    };
    return map[difficulty];
  }

  /**
   * Get pattern color
   */
  getPatternColor(pattern: CodingPattern): string {
    return PATTERN_INFO[pattern].color;
  }

  /**
   * Get pattern icon
   */
  getPatternIcon(pattern: CodingPattern): string {
    return PATTERN_INFO[pattern].icon;
  }

  /**
   * Get total visualized count
   */
  get visualizedCount(): number {
    return this.allProblems.filter((p) => p.hasVisualization).length;
  }
}
