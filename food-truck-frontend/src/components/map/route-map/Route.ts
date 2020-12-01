import DayOfWeek from './DayOfWeek';

interface Route {
  routeId: number;
  routeName: string;
  active: boolean;
  days: DayOfWeek[];
}

export default Route;