import { Injectable } from '@angular/core';
import { GridCell, CellType, PathfindingStep, GridConfig } from '../../../core/models/pathfinding.model';
import { AlgorithmMetadata, AlgorithmCategory } from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class BFSService {
  getMetadata(): AlgorithmMetadata {
    return {
      id: 'bfs',
      name: 'Breadth-First Search',
      category: AlgorithmCategory.PATHFINDING,
      description: 'Explores nodes level by level, guarantees shortest path in unweighted graphs',
      timeComplexity: {
        best: 'O(V + E)',
        average: 'O(V + E)',
        worst: 'O(V + E)'
      },
      spaceComplexity: 'O(V)',
      pseudocode: [
        'create a queue Q',
        'mark start as visited',
        'enqueue start into Q',
        '',
        'while Q is not empty:',
        '    current = Q.dequeue()',
        '    ',
        '    if current is the goal:',
        '        return path',
        '    ',
        '    for each neighbor of current:',
        '        if neighbor not visited:',
        '            mark neighbor as visited',
        '            set neighbor.previous = current',
        '            enqueue neighbor'
      ]
    };
  }

  findPath(grid: GridCell[][], config: GridConfig): PathfindingStep[] {
    const steps: PathfindingStep[] = [];
    const queue: GridCell[] = [];
    const visited = new Set<string>();

    const startCell = grid[config.startCell.row][config.startCell.col];
    const endCell = grid[config.endCell.row][config.endCell.col];

    queue.push(startCell);
    visited.add(`${startCell.row},${startCell.col}`);

    while (queue.length > 0) {
      const current = queue.shift()!;

      steps.push({
        cell: current,
        type: 'visit',
        description: `Visiting cell (${current.row}, ${current.col})`
      });

      if (current.row === endCell.row && current.col === endCell.col) {
        // Reconstruct path
        const path = this.reconstructPath(current);
        path.forEach(cell => {
          steps.push({
            cell,
            type: 'path',
            description: `Part of shortest path`
          });
        });

        steps.push({
          cell: endCell,
          type: 'complete',
          description: 'Path found!'
        });
        return steps;
      }

      const neighbors = this.getNeighbors(current, grid);
      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(key) && neighbor.type !== CellType.WALL) {
          visited.add(key);
          neighbor.previousCell = current;
          queue.push(neighbor);
        }
      }
    }

    steps.push({
      cell: startCell,
      type: 'complete',
      description: 'No path found'
    });

    return steps;
  }

  private getNeighbors(cell: GridCell, grid: GridCell[][]): GridCell[] {
    const neighbors: GridCell[] = [];
    const directions = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 },  // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 }   // right
    ];

    for (const dir of directions) {
      const newRow = cell.row + dir.row;
      const newCol = cell.col + dir.col;

      if (newRow >= 0 && newRow < grid.length &&
          newCol >= 0 && newCol < grid[0].length) {
        neighbors.push(grid[newRow][newCol]);
      }
    }

    return neighbors;
  }

  private reconstructPath(endCell: GridCell): GridCell[] {
    const path: GridCell[] = [];
    let current: GridCell | null = endCell;

    while (current !== null) {
      path.unshift(current);
      current = current.previousCell;
    }

    return path;
  }
}
