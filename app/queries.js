import Relay from 'react-relay';

export const TerminalMarkerPopupFragments = {
  terminal: () => Relay.QL`
    fragment on Stop{
      gtfsId
      lat
      lon
      name
      desc
      stops {
        gtfsId
        platformCode
        routes {
          shortName
          longName
          type
        }
      }
    }
  `,
};

export const RouteHeaderFragments = {
  pattern: () => Relay.QL`
    fragment on Pattern {
      code
      headsign
      route {
        gtfsId
        type
        shortName
        longName
        patterns {
          code
        }
      }
      stops {
        name
      }
    }
  `,
};

export class StopListContainerRoute extends Relay.Route {
  static queries = {
    stops: (Component, variables) => Relay.QL`
      query {
        viewer {
          ${Component.getFragment('stops', {
            lat: variables.lat,
            lon: variables.lon,
            date: variables.date,
          })}
        }
      }
    `,
  };
  static paramDefinitions = {
    lat: { required: true },
    lon: { required: true },
    date: { required: true },
  };
  static routeName = 'StopListContainerRoute';
}

export const NearestStopListContainerFragments = {
  stops: ({ date }) => Relay.QL`
    fragment on QueryType {
      stopsByRadius(lat: $lat, lon: $lon, radius: $radius, agency: $agency, first: $numberOfStops) {
        edges{
          node {
            stop {
              gtfsId
              ${require('./component/stop-cards/stop-card-container').getFragment('stop', { date })}
            }
            distance
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `,
};

export class FavouriteStopListContainerRoute extends Relay.Route {
  static queries = {
    stops: (Component, variables) => Relay.QL`
      query {
        stops(ids: $ids) {
          ${Component.getFragment('stops', {
            ids: variables.ids,
            date: variables.date,
          })}
        }
      }
    `,
  };
  static paramDefinitions = {
    ids: { required: true },
    date: { required: true },
  };
  static routeName = 'FavouriteStopListContainerRoute';
}

export const FavouriteStopListContainerFragments = {
  stops: ({ date }) => Relay.QL`
    fragment on Stop @relay(plural:true){
      gtfsId
      ${require('./component/stop-cards/stop-card-container').getFragment('stop', { date })}
    }
  `,
};

export const StopCardContainerFragments = {
  stop: () => Relay.QL`
    fragment on Stop{
      gtfsId
      stoptimes: stoptimesForServiceDate(date: $date) {
        ${require('./component/departure/departure-list-container').getFragment('stoptimes')}
      }
      ${require('./component/stop-cards/StopCardHeader').default.getFragment('stop')}
    }
  `,
};

export const StopPageFragments = {
  stop: () => Relay.QL`
    fragment on Stop {
      lat
      lon
      name
      code
      routes {
        gtfsId
        shortName
        longName
        type
        color
      }
      stoptimes: stoptimesForServiceDate(date: $date) {
        ${require('./component/departure/departure-list-container').getFragment('stoptimes')}
      }
      ${require('./component/stop-cards/StopCardHeader').default.getFragment('stop')}
    }
  `,
};

export const StopMapPageFragments = {
  stop: () => Relay.QL`
    fragment on Stop {
      lat
      lon
      ${require('./component/stop-cards/StopCardHeader').default.getFragment('stop')}
    }
  `,
};

export const StopMarkerPopupFragments = {
  stop: ({ date }) => Relay.QL`
    fragment on Stop{
      gtfsId
      lat
      lon
      name
      ${require('./component/stop-cards/stop-card-container').getFragment('stop', { date })}
    }
  `,
};

export const StopAtDistanceListContainerFragments = {
  stopAtDistance: () => Relay.QL`
  fragment on stopAtDistance {
    distance
    stop {
      stoptimes: stoptimesForPatterns(numberOfDepartures:2) {
        pattern {
          alerts {
            effectiveStartDate
            effectiveEndDate
            trip {
            gtfsId
            }
          }
          route {
            gtfsId
            shortName
            longName
            type
            color
          }
          code
          headsign
        }
        stoptimes {
          realtimeState
          realtimeDeparture
          scheduledDeparture
          realtime
          serviceDay
          trip {
            gtfsId
          }
        }
      }
    }
  }
  `,
};

export const DepartureListFragments = {
  stoptimes: () => Relay.QL`
    fragment on StoptimesInPattern @relay(plural:true) {
      pattern {
        alerts {
          effectiveStartDate
          effectiveEndDate
          trip {
            gtfsId
          }
        }
        route {
          gtfsId
          shortName
          longName
          type
          color
        }
        code
        headsign
      }
      stoptimes {
        realtimeState
        realtimeDeparture
        scheduledDeparture
        realtime
        serviceDay
        stop {
          code
        }
        trip {
          gtfsId
        }
      }
    }
  `,
};

export const CityBikeStatusQuery = Relay.QL`
query Test{
  bikeRentalStation(id: $id) {
    bikesAvailable
    spacesAvailable
  }
}`;

export const CityBikePopupFragments = {
  station: () => Relay.QL`
    fragment on BikeRentalStation {
      stationId
      name
      lat
      lon
      bikesAvailable
      spacesAvailable
    }
  `,
};

export const RouteMarkerPopupFragments = {
  trip: () => Relay.QL`
    fragment on QueryType {
      fuzzyTrip(route: $route, direction: $direction, time: $time, date: $date) {
        gtfsId
        pattern {
          code
          headsign
          stops {
            name
          }
        }
      }
      route(id: $route) {
        gtfsId
        type
        shortName
        longName
      }
    }
  `,
};

export class FavouriteRouteListContainerRoute extends Relay.Route {
  static queries = {
    routes: (Component, variables) => Relay.QL`
      query {
        routes (ids:$ids) {
          ${Component.getFragment('routes', {
            ids: variables.ids,
          }
        )
      }
    }}`,
  };
  static paramDefinitions = {
    ids: { required: true },
  };
  static routeName = 'FavouriteRouteRowRoute';
}

export class FavouriteLocationContainerRoute extends Relay.Route {
  static queries = {
    plan: (Component, variables) => Relay.QL`
    query {
      viewer {
        ${Component.getFragment('plan', {
          from: variables.from,
          to: variables.to,
          maxWalkDistance: variables.maxWalkDistance,
          wheelchair: variables.wheelchair,
          preferred: variables.preferred,
          arriveBy: variables.arriveBy,
          disableRemainingWeightHeuristic: variables.disableRemainingWeightHeuristic,
        })}
      }
    }`,
  };
  static paramDefinitions = {
    from: { required: true },
    to: { required: true },
  };
  static routeName = 'FavouriteLocationsContainerRoute';
}

export const FavouriteLocationContainerFragments = {
  plan: () => Relay.QL`
    fragment on QueryType {
      plan(from: $from, to: $to, numItineraries: $numItineraries, walkReluctance: $walkReluctance, walkBoardCost: $walkBoardCost, minTransferTime: $minTransferTime, walkSpeed: $walkSpeed, maxWalkDistance: $maxWalkDistance, wheelchair: $wheelchair, disableRemainingWeightHeuristic: $disableRemainingWeightHeuristic, arriveBy: $arriveBy, preferred: $preferred) {
        itineraries {
          startTime
          endTime
          legs {
            realTime
            transitLeg
            mode
            route {
              shortName
            }
          }
        }
      }
    }
  `,
};

export class SummaryPlanContainerRoute extends Relay.Route {
  static queries = {
    plan: (Component, variables) => Relay.QL`
    query {
      viewer {
        ${Component.getFragment('plan', {
          fromPlace: variables.fromPlace,
          toPlace: variables.toPlace,
          walkReluctance: variables.walkReluctance,
          modes: variables.modes,
          date: variables.date,
          time: variables.time,
          walkBoardCost: variables.walkBoardCost,
          walkSpeed: variables.walkSpeed,
          minTransferTime: variables.minTransferTime,
          numItineraries: variables.numItineraries,
          maxWalkDistance: variables.maxWalkDistance,
          wheelchair: variables.wheelchair,
          preferred: variables.preferred,
          arriveBy: variables.arriveBy,
          disableRemainingWeightHeuristic: variables.disableRemainingWeightHeuristic,
        })}
      }
    }`,
  };
  static paramDefinitions = {
  };
  static routeName = 'PlanListContainerRoute';
}

export const ItinerarySummaryListContainerFragments = {
  itineraries: () => Relay.QL`
    fragment on Itinerary @relay(plural:true){
      walkDistance
      startTime
      endTime
      legs {
        realTime
        transitLeg
        startTime
        endTime
        mode
        distance
        duration
        rentedBike
        route {
          shortName
        }
      }
    }
  `,
};
