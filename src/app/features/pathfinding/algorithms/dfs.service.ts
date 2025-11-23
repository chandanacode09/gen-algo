import { Injectable } from '@angular/core';
import { GridCell, CellType, PathfindingStep, GridConfig } from '../../../core/models/pathfinding.model';
import { AlgorithmMetadata, AlgorithmCategory } from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class DFSService {
  getMetadata(): AlgorithmMetadata {
    return {
      id: 'dfs',
      name: 'Depth-First Search',
      category: AlgorithmCategory.PATHFINDING,
      description: 'Explores as far as possible along each branch before backtracking',
      timeComplexity: {
        best: 'O(V + E)',
        average: 'O(V + E)',
        worst: 'O(V + E)'
      },
      spaceComplexity: 'O(V)',
      pseudocode: [
        'create a stack S',
        'push start onto S',
        '',
        'while S is not empty:',
        '    current = S.pop()',
        '    ',
        '    if current is the goal:',
        '        return path',
        '    ',
        '    if current not visited:',
        '        mark current as visited',
        '        ',
        '        for each neighbor of current:',
        '            if neighbor not visited:',
        '                push neighbor onto S'
      ]
    };
  }

  findPath(grid: GridCell[][], config: GridConfig): PathfindingStep[] {
    const steps: PathfindingStep[] = [];
    const stack: GridCell[] = [];
    const visited = new Set<string>();

    const startCell = grid[config.startCell.row][config.startCell.col];
    const endCell = grid[config.endCell.row][config.endCell.col];

    stack.push(startCell);

    while (stack.length > 0) {
      const current = stack.pop()!;
      const key = `${current.row},${current.col}`;

      if (visited.has(key)) continue;

      visited.add(key);

      steps.push({
        cell: current,
        type: 'visit',
        description: `Visiting cell (${current.row}, ${current.col})`
      });

      if (current.row === endCell.row && current.col === endCell.col) {
        const path = this.reconstructPath(current);
        path.forEach(cell => {
          steps.push({
            cell,
            type: 'path',
            description: `Part of path`
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
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(neighborKey) && neighbor.type !== CellType.WALL) {
          neighbor.previousCell = current;
          stack.push(neighbor);
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
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 }
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
