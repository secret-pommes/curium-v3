function not_found(req, service) {
  if (!service) service = "common";
  return {
    header: {
      "X-Epic-Error-Name": `errors.com.epicgames.${service}.not_found`,
      "X-Epic-Error-Code": 1004,
    },
    error: {
      errorCode: `errors.com.epicgames.${service}.not_found`,
      errorMessage:
        "Sorry the resource you were trying to find could not be found",
      messageVars: [req.originalUrl],
      numericErrorCode: 1004,
      originatingService: "fortnite",
      intent: "prod",
    },
  };
}

function method(req, service) {
  if (!service) service = "common";
  return {
    header: {
      "X-Epic-Error-Name": `errors.com.epicgames.${service}.method_not_allowed`,
      "X-Epic-Error-Code": 1009,
    },
    error: {
      errorCode: `errors.com.epicgames.${service}.method_not_allowed`,
      errorMessage:
        "Sorry the resource you were trying to access cannot be accessed with the HTTP method you used.",
      messageVars: [req.originalUrl],
      numericErrorCode: 1009,
      originatingService: "fortnite",
      intent: "prod",
    },
  };
}

function permission(req, service) {
  if (!service) service = "common";
  return {
    header: {
      "X-Epic-Error-Name": `errors.com.epicgames.${service}.missing_permission`,
      "X-Epic-Error-Code": 1023,
    },
    error: {
      errorCode: `errors.com.epicgames.${service}.missing_permission`,
      errorMessage: `Sorry your login does not posses the permissions '${req.originalUrl}' needed to perform the requested operation`,
      messageVars: [req.originalUrl],
      numericErrorCode: 1023,
      originatingService: "fortnite",
      intent: "prod",
    },
  };
}

function invalid_credentials(req, service) {
  if (!service) service = "common";
  return {
    header: {
      "X-Epic-Error-Name": `errors.com.epicgames.${service}.invalid_account_credentials`,
      "X-Epic-Error-Code": 18031,
    },
    error: {
      errorCode: `errors.com.epicgames.${service}.invalid_account_credentials`,
      errorMessage: `Your e-mail and/or passcode are incorrect. Please check them and try again.`,
      messageVars: [req.originalUrl],
      numericErrorCode: 18031,
      originatingService: "fortnite",
      intent: "prod",
    },
  };
}

function refresh_missing(req, service) {
  if (!service) service = "common";
  return {
    header: {
      "X-Epic-Error-Name": `errors.com.epicgames.${service}.oauth.invalid_request`,
      "X-Epic-Error-Code": 18031,
    },
    error: {
      errorCode: `errors.com.epicgames.${service}.oauth.invalid_request`,
      errorMessage: "Refresh token is required.",
      messageVars: [req.originalUrl],
      numericErrorCode: 18031,
      originatingService: "fortnite",
      intent: "prod",
    },
  };
}

function accountId_missing(req, service) {
  if (!service) service = "common";
  return {
    header: {
      "X-Epic-Error-Name": `errors.com.epicgames.${service}.oauth.invalid_request`,
      "X-Epic-Error-Code": 18031,
    },
    error: {
      errorCode: `errors.com.epicgames.${service}.oauth.invalid_request`,
      errorMessage: "Account Id is required.",
      messageVars: [req.originalUrl],
      numericErrorCode: 18031,
      originatingService: "fortnite",
      intent: "prod",
    },
  };
}

function oauth_unsupported_grand_type(req, service) {
  if (!service) service = "common";
  return {
    header: {
      "X-Epic-Error-Name": `errors.com.epicgames.${service}.oauth.unsupported_grant_type`,
      "X-Epic-Error-Code": 1016,
    },
    error: {
      errorCode: `errors.com.epicgames.${service}.oauth.unsupported_grant_type`,
      errorMessage: `Unsupported grant type: ${req.body.grant_type}`,
      messageVars: [req.originalUrl],
      numericErrorCode: 1016,
      originatingService: "fortnite",
      intent: "prod",
    },
  };
}

function authorization_failed(req, service) {
  if (!service) service = "common";
  return {
    header: {
      "X-Epic-Error-Name": `errors.com.epicgames.${service}.authorization.authorization_failed`,
      "X-Epic-Error-Code": 1016,
    },
    error: {
      errorCode: `errors.com.epicgames.${service}.authorization.authorization_failed`,
      errorMessage: `Authorization failed for ${req.originalUrl}`,
      messageVars: [req.originalUrl],
      numericErrorCode: 1016,
      originatingService: "fortnite",
      intent: "prod",
    },
  };
}

function server_error(req, service) {
  if (!service) service = "common";
  return {
    header: {
      "X-Epic-Error-Name": `errors.com.epicgames.${service}.server_error`,
      "X-Epic-Error-Code": 1012,
    },
    error: {
      errorCode: `errors.com.epicgames.${service}.server_error`,
      errorMessage: "Internal Server Error",
      messageVars: [req.originalUrl],
      numericErrorCode: 1012,
      originatingService: "fortnite",
      intent: "prod",
    },
  };
}

function account_banned(req, service) {
  if (!service) service = "common";
  return {
    header: {
      "X-Epic-Error-Name": `errors.com.epicgames.${service}.user_banned`,
      "X-Epic-Error-Code": null,
    },
    error: {
      errorCode: `errors.com.epicgames.${service}.user_banned`,
      errorMessage: "You are currently banned from playing Fortnite.",
      messageVars: [req.originalUrl],
      numericErrorCode: null,
      originatingService: "fortnite",
      intent: "prod",
    },
  };
}

function playlist_unavaible(req, service) {
  if (!service) service = "common";
  return {
    header: {
      "X-Epic-Error-Name": `errors.com.epicgames.${service}.playlist_unavaible`,
      "X-Epic-Error-Code": null,
    },
    error: {
      errorCode: `errors.com.epicgames.${service}.playlist_unavaible`,
      errorMessage: "This gamemode is currently unavaible.",
      messageVars: [req.originalUrl],
      numericErrorCode: null,
      originatingService: "fortnite",
      intent: "prod",
    },
  };
}

function operationNotFound(req, service) {
  if (!service) service = "common";
  return {
    header: {
      "X-Epic-Error-Name": `errors.com.epicgames.${service}.operation_not_found`,
      "X-Epic-Error-Code": 16035,
    },
    error: {
      errorCode: `errors.com.epicgames.${service}.operation_not_found`,
      errorMessage: `Operation ${req.params.operation} is not a valid mcp operation.`,
      messageVars: [req.params.operation],
      numericErrorCode: 16035,
      originatingService: "fortnite",
      intent: "prod",
    },
  };
}

function custom(req, service, errcode, errnumcode, errmessage, service2) {
  if (!service) service = "common";
  if (!errcode) errcode = "unknown";
  if (!errnumcode) errnumcode = 0;
  if (!errmessage) errmessage = "";
  if (!service2) service2 = "unknown";
  return {
    header: {
      "X-Epic-Error-Name": `errors.com.epicgames.${service}.${errcode}`,
      "X-Epic-Error-Code": errnumcode,
    },
    error: {
      errorCode: `errors.com.epicgames.${service}.${errcode}`,
      errorMessage: errmessage,
      messageVars: [req.originalUrl],
      numericErrorCode: errnumcode,
      originatingService: service2,
      intent: "prod",
    },
  };
}

module.exports = {
  not_found,
  method,
  permission,
  invalid_credentials,
  refresh_missing,
  accountId_missing,
  oauth_unsupported_grand_type,
  authorization_failed,
  server_error,
  account_banned,
  playlist_unavaible,
  operationNotFound,
  custom,
};
