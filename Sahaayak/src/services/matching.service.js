const User = require("../models/User");

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const findMatchingWorkers = async (
  location,
  occupation,
  maxDistanceKm = 10
) => {
  try {
    const customerLng = Number(
      location?.coordinates?.[0]
    );

    const customerLat = Number(
      location?.coordinates?.[1]
    );

    if (
      !Number.isFinite(customerLng) ||
      !Number.isFinite(customerLat)
    ) {
      console.log("Matching: invalid customer location");
      return [];
    }

    console.log(
      `Matching: searching for ${occupation}`
    );

    const users = await User.find({
      role: "worker",
    })
      .select(
        "name email phone role occupation skills location isVerified availability rating totalJobs experience serviceRadius"
      )
      .lean();

    console.log(
      `Matching: ${users.length} worker accounts found`
    );

    const occupationMatches = [];

    for (const worker of users) {
      // Must be verified
      if (worker.isVerified !== true) {
        continue;
      }

      // Must be available
      if (worker.availability === false) {
        continue;
      }

      // Match occupation
      if (
        occupation &&
        worker.occupation?.trim().toLowerCase() !==
          occupation.trim().toLowerCase()
      ) {
        continue;
      }

      const workerLng = Number(
        worker.location?.coordinates?.[0]
      );

      const workerLat = Number(
        worker.location?.coordinates?.[1]
      );

      if (
        !Number.isFinite(workerLng) ||
        !Number.isFinite(workerLat)
      ) {
        continue;
      }

      const distance = calculateDistanceKm(
        customerLat,
        customerLng,
        workerLat,
        workerLng
      );

      const rating =
        Number(worker.rating) || 0;

      const experience =
        Number(worker.experience) || 0;

      const totalJobs =
        Number(worker.totalJobs) || 0;

      const serviceRadius =
        Number(worker.serviceRadius) || 10;

      // Check whether worker is actually nearby
      const isNearby =
        distance <=
        Math.min(maxDistanceKm, serviceRadius);

      occupationMatches.push({
        ...worker,

        distance: Number(distance.toFixed(2)),

        distanceKm: Number(
          distance.toFixed(2)
        ),

        isNearby,

        rating,

        experience,

        totalJobs,

        serviceRadius,

        availability: true,

        verificationStatus: "verified",

        user: {
          _id: worker._id,
          name: worker.name,
          email: worker.email,
          phone: worker.phone,
        },
      });
    }

    console.log(
      `Matching: ${occupationMatches.length} verified ${occupation} workers found`
    );

    // ------------------------------------
    // FIRST PRIORITY: NEARBY WORKERS
    // ------------------------------------

    let matches = occupationMatches.filter(
      (worker) => worker.isNearby
    );

    // ------------------------------------
    // DEMO FALLBACK
    // If no nearby worker exists,
    // use verified available workers
    // of the requested occupation.
    // ------------------------------------

    if (matches.length === 0) {
      console.log(
        "Matching: no nearby worker found."
      );

      console.log(
        "Matching: using verified occupation fallback."
      );

      matches = occupationMatches;
    }

    // ------------------------------------
    // SMART MATCHING SCORE
    // ------------------------------------

    matches.forEach((worker) => {
      const distanceScore =
        worker.distance <= maxDistanceKm
          ? Math.max(
              0,
              1 -
                worker.distance /
                  Math.max(maxDistanceKm, 1)
            )
          : 0.25;

      const ratingScore = Math.min(
        worker.rating / 5,
        1
      );

      const experienceScore = Math.min(
        worker.experience / 10,
        1
      );

      worker.matchingScore = Number(
        (
          distanceScore * 0.45 +
          ratingScore * 0.35 +
          experienceScore * 0.2
        ).toFixed(4)
      );
    });

    // ------------------------------------
    // SORT
    // ------------------------------------

    matches.sort((a, b) => {
      // Nearby workers always get priority
      if (a.isNearby !== b.isNearby) {
        return a.isNearby ? -1 : 1;
      }

      // Then matching score
      if (
        b.matchingScore !==
        a.matchingScore
      ) {
        return (
          b.matchingScore -
          a.matchingScore
        );
      }

      // Then rating
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }

      // Then distance
      if (
        a.distance !== b.distance
      ) {
        return a.distance - b.distance;
      }

      // Then completed jobs
      return (
        a.totalJobs -
        b.totalJobs
      );
    });

    console.log(
      `Matching: returning ${matches.length} workers`
    );

    if (matches.length > 0) {
      console.log(
        "Best match:",
        matches[0].name,
        "|",
        matches[0].occupation,
        "|",
        matches[0].distance,
        "km",
        "| rating:",
        matches[0].rating
      );
    }

    return matches;

  } catch (error) {
    console.error(
      "Worker matching error:",
      error
    );

    return [];
  }
};

module.exports = {
  findMatchingWorkers,
};