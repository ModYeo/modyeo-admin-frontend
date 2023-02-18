import serverStatus from "../constants/serverStatus";

class StatusCodeCheckManager {
  static checkIfIsValidStatus(status: number): boolean {
    if (status === serverStatus.OK || status === serverStatus.NO_CONTENT) {
      return true;
    }
    return false;
  }
}

export default StatusCodeCheckManager;
