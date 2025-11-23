import { Routes } from '@angular/router';
import { SortingVisualizerComponent } from './features/sorting/sorting-visualizer/sorting-visualizer.component';
import { PathfindingVisualizerComponent } from './features/pathfinding/pathfinding-visualizer/pathfinding-visualizer.component';

export const routes: Routes = [
  { path: '', redirectTo: '/sorting', pathMatch: 'full' },
  { path: 'sorting', component: SortingVisualizerComponent },
  { path: 'pathfinding', component: PathfindingVisualizerComponent }
];

