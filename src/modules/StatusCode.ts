import serverStatus from "../constants/serverStatus";

class StatusCodeCheckManager {
  static checkIfIsRequestSucceeded(status: number): boolean {
    if (
      status === serverStatus.OK ||
      status === serverStatus.CREATED ||
      status === serverStatus.NO_CONTENT
    ) {
      return true;
    }
    return false;
  }
}

export default StatusCodeCheckManager;
