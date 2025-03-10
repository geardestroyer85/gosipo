import { Route, RootRoute } from '@tanstack/react-router';
import App from '../App';

const rootRoute = new RootRoute({
  component: App,
});


export const routeTree = rootRoute