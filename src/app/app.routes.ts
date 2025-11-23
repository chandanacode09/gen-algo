import { Routes } from '@angular/router';
import { SortingVisualizerComponent } from './features/sorting/sorting-visualizer/sorting-visualizer.component';
import { PathfindingVisualizerComponent } from './features/pathfinding/pathfinding-visualizer/pathfinding-visualizer.component';
import { ProblemLibraryComponent } from './features/problems/problem-library/problem-library.component';
import { TwoSumComponent } from './features/problems/visualizations/two-sum/two-sum.component';

export const routes: Routes = [
  { path: '', redirectTo: '/problems', pathMatch: 'full' },
  { path: 'problems', component: ProblemLibraryComponent },
  { path: 'problems/two-sum', component: TwoSumComponent },
  { path: 'sorting', component: SortingVisualizerComponent },
  { path: 'pathfinding', component: PathfindingVisualizerComponent },
];

