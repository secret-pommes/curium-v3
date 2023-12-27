module.exports = async (ws) => {
  let waitingTime = 10;

  // Connect
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        name: "StatusUpdate",
        payload: {
          state: "Connecting",
        },
      })
    );
  }, 1000);

  // Wait
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        name: "StatusUpdate",
        payload: {
          totalPlayers: 1,
          connectedPlayers: 1,
          state: "Waiting",
        },
      })
    );
  }, 2000);

  // Queue & Finding Match
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        name: "StatusUpdate",
        payload: {
          estimatedWaitSec: waitingTime,
          queuedPlayers: 0,
          state: "Queued",
          status: {},
          ticketId: "GEGGG486435464EEHRH45HHRH",
        },
      })
    );
  }, 3000);

  // set server
  setTimeout(() => {
    ws.send(
      JSON.stringify(
        {
          payload: {
            matchId: "hr14hjr4ht53rht456rt1h3r5t5h3t2r",
            state: "SessionAssignment",
          },
          name: "StatusUpdate",
        },
        4000 + waitingTime * 60
      )
    );

    setTimeout(() => {
      ws.send(
        JSON.stringify({
          payload: {
            matchId: "hr14hjr4ht53rht456rt1h3r5t5h3t2r",
            sessionId: "4h4reh45r6ht4r6ht42rht4rt3h4rhr",
            joinDelaySec: 1,
          },
          name: "Play",
        })
      );
    }, 1000);
  }, 4000 + waitingTime * 60);
};
