import geolib from "geolib";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Ride from "../models/Ride.js";

const onDutyRiders = new Map();

const handleSocketConnection = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.headers.access_token;

      if (!token) {
        return next(
          new Error("Authentication invalid: No token")
        );
      }

      const payload = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );

      const user = await User.findById(payload.id);

      if (!user) {
        return next(
          new Error("Authentication invalid: User not found")
        );
      }

      socket.user = {
        id: payload.id,
        role: user.role,
      };

      next();
    } catch (error) {
      console.error("Socket Auth Error:", error);

      next(
        new Error(
          "Authentication invalid: Token verification failed"
        )
      );
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;

    console.log(
      `User Joined: ${user.id} (${user.role})`
    );

    // =========================================
    // GLOBAL STATE FOR THIS SOCKET
    // =========================================

    let retryInterval = null;
    let activeRideId = null;
    let rideAccepted = false;
    let canceled = false;

    // =========================================
    // RIDER EVENTS
    // =========================================

    if (user.role === "rider") {
      socket.on("goOnDuty", (coords) => {
        onDutyRiders.set(user.id, {
          socketId: socket.id,
          coords,
        });

        socket.join("onDuty");

        console.log(
          `Rider ${user.id} is now on duty`
        );

        updateNearbyRiders();
      });

      socket.on("goOffDuty", () => {
        onDutyRiders.delete(user.id);

        socket.leave("onDuty");

        console.log(
          `Rider ${user.id} is now off duty`
        );

        updateNearbyRiders();
      });

      socket.on("updateLocation", (coords) => {
        if (onDutyRiders.has(user.id)) {
          onDutyRiders.get(user.id).coords =
            coords;

          socket
            .to(`rider_${user.id}`)
            .emit("riderLocationUpdate", {
              riderId: user.id,
              coords,
            });

          updateNearbyRiders();
        }
      });
    }

    // =========================================
    // CUSTOMER EVENTS
    // =========================================

    if (user.role === "customer") {
      socket.on(
        "subscribeToZone",
        (customerCoords) => {
          socket.user.coords = customerCoords;

          sendNearbyRiders(
            socket,
            customerCoords
          );
        }
      );

      // =====================================
      // SEARCH RIDER
      // =====================================

      socket.on(
        "searchrider",
        async (rideId) => {
          try {
            // cleanup previous interval
            if (retryInterval) {
              clearInterval(retryInterval);
            }

            activeRideId = rideId;
            rideAccepted = false;
            canceled = false;

            const ride =
              await Ride.findById(
                rideId
              ).populate("customer rider");

            if (!ride) {
              return socket.emit("error", {
                message: "Ride not found",
              });
            }

            const {
              latitude: pickupLat,
              longitude: pickupLon,
            } = ride.pickup;

            let retries = 0;

            const MAX_RETRIES = 20;

            const retrySearch =
              async () => {
                if (
                  canceled ||
                  rideAccepted
                ) {
                  clearInterval(
                    retryInterval
                  );
                  return;
                }

                retries++;

                console.log(
                  `Searching riders... Attempt ${retries}`
                );

                const riders =
                  sendNearbyRiders(
                    socket,
                    {
                      latitude: pickupLat,
                      longitude: pickupLon,
                    },
                    ride
                  );

                if (
                  retries >= MAX_RETRIES
                ) {
                  clearInterval(
                    retryInterval
                  );

                  if (
                    !rideAccepted
                  ) {
                    await Ride.findByIdAndDelete(
                      rideId
                    );

                    socket.emit(
                      "error",
                      {
                        message:
                          "No riders found",
                      }
                    );
                  }
                }
              };

            // run immediately
            retrySearch();

            // retry every 10 sec
            retryInterval =
              setInterval(
                retrySearch,
                10000
              );
          } catch (error) {
            console.error(
              "Search Rider Error:",
              error
            );

            socket.emit("error", {
              message:
                "Error searching for rider",
            });
          }
        }
      );

      // =====================================
      // CANCEL RIDE
      // =====================================

      socket.on(
        "cancelRide",
        async () => {
          try {
            canceled = true;

            if (retryInterval) {
              clearInterval(
                retryInterval
              );
            }

            if (!activeRideId)
              return;

            const ride =
              await Ride.findById(
                activeRideId
              );

            if (!ride) return;

            await Ride.findByIdAndDelete(
              activeRideId
            );

            socket.emit(
              "rideCanceled",
              {
                message:
                  "Ride canceled",
              }
            );

            if (ride.rider) {
              const riderSocket =
                getRiderSocket(
                  ride.rider.toString()
                );

              riderSocket?.emit(
                "rideCanceled",
                {
                  message:
                    "Customer canceled ride",
                }
              );
            }

            console.log(
              `Ride ${activeRideId} canceled`
            );
          } catch (error) {
            console.error(
              "Cancel Ride Error:",
              error
            );
          }
        }
      );
    }

    // =========================================
    // RIDE ACCEPTED
    // =========================================

    socket.on("rideAccepted", () => {
      rideAccepted = true;

      if (retryInterval) {
        clearInterval(retryInterval);
      }

      console.log(
        `Ride ${activeRideId} accepted`
      );
    });

    // =========================================
    // SUBSCRIBE TO RIDER LOCATION
    // =========================================

    socket.on(
      "subscribeToriderLocation",
      (riderId) => {
        const rider =
          onDutyRiders.get(riderId);

        if (rider) {
          socket.join(
            `rider_${riderId}`
          );

          socket.emit(
            "riderLocationUpdate",
            {
              riderId,
              coords: rider.coords,
            }
          );
        }
      }
    );

    // =========================================
    // SUBSCRIBE TO RIDE
    // =========================================

    socket.on(
      "subscribeRide",
      async (rideId) => {
        socket.join(`ride_${rideId}`);

        try {
          const rideData =
            await Ride.findById(
              rideId
            ).populate(
              "customer rider"
            );

          socket.emit(
            "rideData",
            rideData
          );
        } catch (error) {
          socket.emit("error", {
            message:
              "Failed to receive ride data",
          });
        }
      }
    );

    // =========================================
    // DISCONNECT
    // =========================================

    socket.on("disconnect", () => {
      if (retryInterval) {
        clearInterval(retryInterval);
      }

      if (user.role === "rider") {
        onDutyRiders.delete(user.id);
      }

      console.log(
        `${user.role} ${user.id} disconnected`
      );
    });

    // =========================================
    // HELPERS
    // =========================================

    function updateNearbyRiders() {
      io.sockets.sockets.forEach(
        (clientSocket) => {
          if (
            clientSocket.user?.role ===
            "customer"
          ) {
            const customerCoords =
              clientSocket.user.coords;

            if (customerCoords) {
              sendNearbyRiders(
                clientSocket,
                customerCoords
              );
            }
          }
        }
      );
    }

    function sendNearbyRiders(
      socket,
      location,
      ride = null
    ) {
      const nearbyRiders = Array.from(
        onDutyRiders.values()
      )
        .map((rider) => ({
          ...rider,
          distance:
            geolib.getDistance(
              rider.coords,
              location
            ),
        }))
        .filter(
          (rider) =>
            rider.distance <= 60000
        )
        .sort(
          (a, b) =>
            a.distance - b.distance
        );

      socket.emit(
        "nearbyriders",
        nearbyRiders
      );

      if (ride) {
        nearbyRiders.forEach(
          (rider) => {
            io.to(
              rider.socketId
            ).emit(
              "rideOffer",
              ride
            );
          }
        );
      }

      return nearbyRiders;
    }

    function getRiderSocket(riderId) {
      const rider =
        onDutyRiders.get(riderId);

      return rider
        ? io.sockets.sockets.get(
            rider.socketId
          )
        : null;
    }
  });
};

export default handleSocketConnection;