import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridCell, CellType, DEFAULT_GRID_CONFIG, GridConfig, PathfindingStep } from '../../../core/models/pathfinding.model';
import { BFSService } from '../algorithms/bfs.service';
import { DFSService } from '../algorithms/dfs.service';
import { ControlPanelComponent } from '../../../shared/components/control-panel/control-panel.component';
import { AnimationService } from '../../../core/services/animation.service';

@Component({
  selector: 'app-pathfinding-visualizer',
  standalone: true,
  imports: [CommonModule, FormsModule, ControlPanelComponent],
  templateUrl: './pathfinding-visualizer.component.html',
  styleUrl: './pathfinding-visualizer.component.scss'
})
export class PathfindingVisualizerComponent implements OnInit {
  grid: GridCell[][] = [];
  config: GridConfig = DEFAULT_GRID_CONFIG;
  selectedAlgorithm = 'bfs';
  isDrawingWall = false;
  isRunning = false;

  CellType = CellType;

  algorithms = [
    { id: 'bfs', name: 'Breadth-First Search (BFS)', service: this.bfsService },
    { id: 'dfs', name: 'Depth-First Search (DFS)', service: this.dfsService }
  ];

  constructor(
    private bfsService: BFSService,
    private dfsService: DFSService,
    private animationService: AnimationService
  ) {}

  ngOnInit(): void {
    this.initializeGrid();
  }

  initializeGrid(): void {
    this.grid = [];
    for (let row = 0; row < this.config.rows; row++) {
      const gridRow: GridCell[] = [];
      for (let col = 0; col < this.config.cols; col++) {
        let type = CellType.EMPTY;

        if (row === this.config.startCell.row && col === this.config.startCell.col) {
          type = CellType.START;
        } else if (row === this.config.endCell.row && col === this.config.endCell.col) {
          type = CellType.END;
        }

        gridRow.push({
          row,
          col,
          type,
          distance: Infinity,
          previousCell: null
        });
      }
      this.grid.push(gridRow);
    }
  }

  onCellClick(cell: GridCell): void {
    if (this.isRunning) return;

    if (cell.type === CellType.START || cell.type === CellType.END) {
      return;
    }

    cell.type = cell.type === CellType.WALL ? CellType.EMPTY : CellType.WALL;
  }

  onCellMouseDown(cell: GridCell): void {
    if (this.isRunning) return;
    if (cell.type === CellType.START || cell.type === CellType.END) return;

    this.isDrawingWall = cell.type !== CellType.WALL;
    cell.type = this.isDrawingWall ? CellType.WALL : CellType.EMPTY;
  }

  onCellMouseEnter(cell: GridCell): void {
    if (!this.isDrawingWall || this.isRunning) return;
    if (cell.type === CellType.START || cell.type === CellType.END) return;

    cell.type = this.isDrawingWall ? CellType.WALL : CellType.EMPTY;
  }

  onMouseUp(): void {
    this.isDrawingWall = false;
  }

  async visualize(): Promise<void> {
    this.isRunning = true;
    this.clearPath();

    const algorithm = this.algorithms.find(a => a.id === this.selectedAlgorithm);
    if (!algorithm) return;

    const steps = algorithm.service.findPath(this.grid, this.config);

    for (const step of steps) {
      await this.delay(50);

      if (step.type === 'visit' &&
          step.cell.type !== CellType.START &&
          step.cell.type !== CellType.END) {
        step.cell.type = CellType.VISITED;
      } else if (step.type === 'path' &&
                 step.cell.type !== CellType.START &&
                 step.cell.type !== CellType.END) {
        step.cell.type = CellType.PATH;
      }
    }

    this.isRunning = false;
  }

  clearPath(): void {
    for (const row of this.grid) {
      for (const cell of row) {
        if (cell.type === CellType.VISITED || cell.type === CellType.PATH || cell.type === CellType.CURRENT) {
          cell.type = CellType.EMPTY;
        }
        cell.distance = Infinity;
        cell.previousCell = null;
      }
    }
  }

  clearWalls(): void {
    for (const row of this.grid) {
      for (const cell of row) {
        if (cell.type === CellType.WALL) {
          cell.type = CellType.EMPTY;
        }
      }
    }
  }

  resetGrid(): void {
    this.initializeGrid();
  }

  getCellClass(cell: GridCell): string {
    return `cell ${cell.type}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
