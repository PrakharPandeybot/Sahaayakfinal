const Scheme = require("../models/Scheme");
const User = require("../models/User");

// ======================================
// CHECK SCHEME ELIGIBILITY
// ======================================

const checkSchemeEligibility = (scheme, worker) => {
  const reasons = [];
  const warnings = [];

  // --------------------------------------
  // WORKER TYPE
  // --------------------------------------

  if (
    scheme.eligibleWorkerTypes &&
    scheme.eligibleWorkerTypes.length > 0 &&
    !scheme.eligibleWorkerTypes.includes("all")
  ) {
    const workerType = worker.role || "worker";

    if (!scheme.eligibleWorkerTypes.includes(workerType)) {
      return {
        eligible: false,
        score: 0,
        reasons: [],
        warnings: ["Worker type does not match"],
      };
    }

    reasons.push("Worker type matches");
  }

  // --------------------------------------
  // AGE
  // --------------------------------------

  if (worker.age !== undefined && worker.age !== null) {
    if (
      scheme.minimumAge !== null &&
      scheme.minimumAge !== undefined &&
      worker.age < scheme.minimumAge
    ) {
      return {
        eligible: false,
        score: 0,
        reasons: [],
        warnings: [
          `Minimum age requirement is ${scheme.minimumAge}`,
        ],
      };
    }

    if (
      scheme.maximumAge !== null &&
      scheme.maximumAge !== undefined &&
      worker.age > scheme.maximumAge
    ) {
      return {
        eligible: false,
        score: 0,
        reasons: [],
        warnings: [
          `Maximum age requirement is ${scheme.maximumAge}`,
        ],
      };
    }

    reasons.push("Age eligibility matches");
  }

  // --------------------------------------
  // INCOME
  // --------------------------------------

  if (
    scheme.maximumIncome !== null &&
    scheme.maximumIncome !== undefined
  ) {
    if (
      worker.income !== undefined &&
      worker.income !== null
    ) {
      if (worker.income > scheme.maximumIncome) {
        return {
          eligible: false,
          score: 0,
          reasons: [],
          warnings: [
            `Income exceeds the maximum limit of ₹${scheme.maximumIncome}`,
          ],
        };
      }

      reasons.push("Income eligibility matches");
    } else {
      warnings.push("Income information is not available");
    }
  }

  // --------------------------------------
  // LOCATION / STATE
  // --------------------------------------

  if (
    scheme.eligibleStates &&
    scheme.eligibleStates.length > 0
  ) {
    const workerState =
      worker.location?.state ||
      worker.state ||
      "";

    if (workerState) {
      const normalizedWorkerState =
        workerState.trim().toLowerCase();

      const stateMatches = scheme.eligibleStates.some(
        (state) =>
          state.trim().toLowerCase() ===
          normalizedWorkerState
      );

      if (!stateMatches) {
        return {
          eligible: false,
          score: 0,
          reasons: [],
          warnings: ["Worker's state is not covered"],
        };
      }

      reasons.push("Location eligibility matches");
    } else {
      warnings.push("Worker location is not available");
    }
  }

  // --------------------------------------
  // OCCUPATION
  // --------------------------------------

  if (
    scheme.targetOccupations &&
    scheme.targetOccupations.length > 0
  ) {
    const workerOccupation =
      worker.occupation ||
      worker.profession ||
      worker.jobTitle ||
      "";

    if (workerOccupation) {
      const normalizedOccupation =
        workerOccupation.trim().toLowerCase();

      const occupationMatches =
        scheme.targetOccupations.some((occupation) =>
          normalizedOccupation.includes(
            occupation.trim().toLowerCase()
          )
        );

      if (!occupationMatches) {
        return {
          eligible: false,
          score: 0,
          reasons: [],
          warnings: ["Worker occupation does not match"],
        };
      }

      reasons.push("Occupation matches");
    } else {
      warnings.push("Worker occupation is not available");
    }
  }

  // --------------------------------------
  // SKILLS
  // --------------------------------------

  if (
    scheme.requiredSkills &&
    scheme.requiredSkills.length > 0
  ) {
    const workerSkills = Array.isArray(worker.skills)
      ? worker.skills.map((skill) =>
          skill.toString().trim().toLowerCase()
        )
      : [];

    const matchedSkills = scheme.requiredSkills.filter(
      (requiredSkill) =>
        workerSkills.includes(
          requiredSkill.trim().toLowerCase()
        )
    );

    if (matchedSkills.length === 0) {
      return {
        eligible: false,
        score: 0,
        reasons: [],
        warnings: ["Required skills do not match"],
      };
    }

    reasons.push(
      `${matchedSkills.length} required skill(s) match`
    );
  }

  // --------------------------------------
  // MATCH SCORE
  // --------------------------------------

  let score = 0;

  if (reasons.length > 0) {
    score = Math.min(100, reasons.length * 20);
  } else {
    // If a scheme has no additional eligibility
    // restrictions, it is broadly applicable.
    score = 100;
    reasons.push("General eligibility criteria match");
  }

  return {
    eligible: true,
    score,
    reasons,
    warnings,
  };
};

// ======================================
// GET RECOMMENDED SCHEMES
// ======================================

const getRecommendedSchemes = async (workerId) => {
  const worker = await User.findById(workerId).lean();

  if (!worker) {
    throw new Error("Worker not found");
  }

  const schemes = await Scheme.find({
    isActive: true,
  }).lean();

  const recommendations = [];

  for (const scheme of schemes) {
    const result = checkSchemeEligibility(
      scheme,
      worker
    );

    if (result.eligible) {
      recommendations.push({
        scheme,
        score: result.score,
        reasons: result.reasons,
        warnings: result.warnings,
      });
    }
  }

  // Highest matching score first
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations;
};

module.exports = {
  checkSchemeEligibility,
  getRecommendedSchemes,
};