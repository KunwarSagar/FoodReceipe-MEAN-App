// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_DOMAIN: "localhost:8000",
  API_BASE_URL: "http://localhost:8000/api",
  ITEMS_COUNT_PER_PAGE: 10,
  ITEMS_OFFSET: 0,
  RADIX: 10,
  
  // Alert Messages
  ALERT_HIDE_TIME_IN_SECOND: 3000,
  ERROR_ALERT_TYPE : "danger",
  SUCCESS_ALERT_TYPE : "success",
  REPEAT_PASSWORD_NOT_MATCH : "Repeat password did not match.",
  REGISTRATION_SUCCESS : "Registration success.",
  REGISTRATION_FAILED : "Registration failed.",
  REGISTRATION_SUCCESS_REDIRECTION : "Success, Please login with your username and password",
  LOGIN_SUCCESS : "Login success.",
  LOGIN_ERROR_WITH_UNKNOWN_REASON : "Something went wrong please try again.",
  LOGIN_ERROR_BY_USERNAME_PASSWORD_WRONG : "Something went wrong please try again.",

  UPDATE_FAIL : "Food update failed.",
  ADD_FAIL : "Food add failed.",
  UPDATE_SUCCESS : "Updated.",
  ADD_SUCCESS : "Food added.",
  DELETE_FAILED : "Delete failed.",
  DELETE_SUCCESS : "Deleted.",

  ALL_FIELDS_REQUIRED : "All fields are required."
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
