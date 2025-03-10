import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routes';

export const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className="flex items-center justify-center h-screen text-text">Loading...</div>
  ),
});