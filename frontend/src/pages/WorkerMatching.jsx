import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function WorkerMatching() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const serviceId = params.get("service");
  const date = params.get("date") || "";
  const time = params.get("time") || "";
  const address = params.get("address") || "";
  const description = params.get("description") || "";

  const [service, setService] = useState(null);
  const [matchedWorker, setMatchedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    findWorker();
  }, []);

  async function findWorker() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      // Load service
      const serviceResponse = await fetch(
        `${API_URL}/api/services/${serviceId}`
      );

      if (!serviceResponse.ok) {
        throw new Error("Unable to load service.");
      }

      const serviceData = await serviceResponse.json();

      setService(
        serviceData.service ||
          serviceData.data ||
          serviceData
      );

      const serviceObject =
        serviceData.service ||
        serviceData.data ||
        serviceData;

      // Get customer location
      let lat = Number(params.get("lat"));
      let lng = Number(params.get("lng"));

      // If location wasn't passed, use browser location
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 8000,
            }
          );
        });

        lat = position.coords.latitude;
        lng = position.coords.longitude;
      }

      const occupation =
        serviceObject.category || "";

      const matchingUrl =
        `${API_URL}/api/workers/matching` +
        `?lat=${encodeURIComponent(lat)}` +
        `&lng=${encodeURIComponent(lng)}` +
        `&occupation=${encodeURIComponent(occupation)}` +
        `&maxDistanceKm=10`;

      console.log("Matching URL:", matchingUrl);

      const response = await fetch(matchingUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const responseText = await response.text();

      console.log(
        "Matching response:",
        response.status,
        responseText
      );

      if (!response.ok) {
        throw new Error(
          `Matching failed (${response.status})`
        );
      }

      let matchingData;

      try {
        matchingData = JSON.parse(responseText);
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      const workers =
        matchingData.workers ||
        matchingData.matchingWorkers ||
        matchingData.data ||
        [];

      if (workers.length === 0) {
        setError(
          `No ${occupation} workers are currently available near you.`
        );
        return;
      }

      setMatchedWorker(workers[0]);

    } catch (err) {
      console.error("Worker matching error:", err);
      setError(err.message || "Unable to find a Sahaayak.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmBooking() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      if (!serviceId) {
        throw new Error("Service information is missing.");
      }

      const lat = Number(params.get("lat"));
      const lng = Number(params.get("lng"));

      let finalLat = lat;
      let finalLng = lng;

      if (
        !Number.isFinite(finalLat) ||
        !Number.isFinite(finalLng)
      ) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 8000,
            }
          );
        });

        finalLat = position.coords.latitude;
        finalLng = position.coords.longitude;
      }

      const bookingResponse = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service: serviceId,
            scheduledDate: date
              ? `${date}T${time || "09:00"}`
              : new Date().toISOString(),
            address,
            location: {
              type: "Point",
              coordinates: [
                finalLng,
                finalLat,
              ],
            },
            description,
          }),
        }
      );

      const bookingText =
        await bookingResponse.text();

      if (!bookingResponse.ok) {
        throw new Error(
          `Booking failed (${bookingResponse.status})`
        );
      }

      let bookingData;

      try {
        bookingData = JSON.parse(bookingText);
      } catch {
        throw new Error("Invalid booking response.");
      }

      console.log("Booking created:", bookingData);

      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert(
        err.message ||
          "Unable to create booking."
      );
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>

          <div style={styles.eyebrow}>
            SMART MATCHING
          </div>

          <h1>Finding your Sahaayak</h1>

          <p>
            We're looking for the best verified
            professional near you...
          </p>

          <div style={styles.steps}>
            <div>✓ Checking nearby workers</div>
            <div>✓ Checking availability</div>
            <div>✓ Comparing ratings & experience</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !matchedWorker) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <button
            style={styles.backButton}
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div style={styles.logo}>
            SAHAAYAK
          </div>

          <button
            style={styles.homeButton}
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </header>

        <main style={styles.center}>
          <div style={styles.errorIcon}>!</div>

          <div style={styles.eyebrow}>
            MATCHING ERROR
          </div>

          <h1>
            We couldn't find your Sahaayak.
          </h1>

          <p style={styles.errorText}>
            {error || "No worker is available."}
          </p>

          <div style={styles.actions}>
            <button
              style={styles.secondaryButton}
              onClick={() => navigate(-1)}
            >
              ← Change details
            </button>

            <button
              style={styles.primaryButton}
              onClick={findWorker}
            >
              Try again →
            </button>
          </div>
        </main>
      </div>
    );
  }

  const workerName =
    matchedWorker.name ||
    matchedWorker.user?.name ||
    "Sahaayak";

  const occupation =
    matchedWorker.occupation ||
    service?.category ||
    "Service Professional";

  const rating =
    Number(matchedWorker.rating) || 0;

  const experience =
    Number(matchedWorker.experience) || 0;

  const distance =
    matchedWorker.distanceKm ??
    matchedWorker.distance ??
    "Nearby";

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button
          style={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div style={styles.logo}>
          SAHAAYAK
        </div>

        <button
          style={styles.homeButton}
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </header>

      <main style={styles.container}>

        <div style={styles.successIcon}>
          ✓
        </div>

        <div style={styles.eyebrow}>
          SAHAAYAK FOUND
        </div>

        <h1 style={styles.title}>
          We've found the right professional.
        </h1>

        <p style={styles.subtitle}>
          Based on availability, distance,
          experience and rating.
        </p>

        <div style={styles.workerCard}>

          <div style={styles.avatar}>
            {workerName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div style={styles.workerInfo}>
            <div style={styles.verified}>
              ✓ VERIFIED
            </div>

            <h2>{workerName}</h2>

            <p style={styles.occupation}>
              {occupation}
            </p>

            <div style={styles.stats}>
              <span>
                ⭐ {rating.toFixed(1)}
              </span>

              <span>
                📍 {distance} km
              </span>

              <span>
                🧰 {experience} yrs experience
              </span>
            </div>
          </div>
        </div>

        <div style={styles.summary}>
          <h3>Service summary</h3>

          <div style={styles.summaryRow}>
            <span>Service</span>
            <strong>
              {service?.name || "Requested service"}
            </strong>
          </div>

          <div style={styles.summaryRow}>
            <span>Date</span>
            <strong>
              {date || "Today"}
            </strong>
          </div>

          {time && (
            <div style={styles.summaryRow}>
              <span>Time</span>
              <strong>{time}</strong>
            </div>
          )}

          {address && (
            <div style={styles.summaryRow}>
              <span>Address</span>
              <strong>{address}</strong>
            </div>
          )}

          {service?.basePrice && (
            <div style={styles.priceRow}>
              <span>Estimated price</span>
              <strong>
                ₹{service.basePrice}
              </strong>
            </div>
          )}
        </div>

        <button
          style={styles.confirmButton}
          onClick={confirmBooking}
        >
          Confirm & Book Sahaayak →
        </button>

        <button
          style={styles.changeButton}
          onClick={() => navigate(-1)}
        >
          Change service details
        </button>

      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        button {
          font-family: inherit;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.08);
            opacity: .7;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#FFFFE3",
    color: "#4A4A4A",
    fontFamily: "Inter, Arial, sans-serif",
  },

  header: {
    height: "126px",
    borderBottom: "1px solid #D8D8C8",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 5%",
  },

  logo: {
    fontFamily: "Poppins, Arial, sans-serif",
    fontWeight: 700,
    fontSize: "30px",
    letterSpacing: "4px",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#6D8196",
    fontSize: "20px",
    fontWeight: 600,
    cursor: "pointer",
  },

  homeButton: {
    border: "none",
    background: "transparent",
    color: "#6D8196",
    fontSize: "20px",
    fontWeight: 600,
    cursor: "pointer",
  },

  center: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "90px 25px",
    textAlign: "center",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "70px 25px 100px",
    textAlign: "center",
  },

  loadingCard: {
    maxWidth: "650px",
    margin: "0 auto",
    padding: "160px 25px",
    textAlign: "center",
  },

  spinner: {
    width: "70px",
    height: "70px",
    border: "6px solid #E6E5D6",
    borderTop: "6px solid #6D8196",
    borderRadius: "50%",
    margin: "0 auto 35px",
    animation: "spin 1s linear infinite",
  },

  eyebrow: {
    color: "#6D8196",
    fontWeight: 700,
    letterSpacing: "3px",
    fontSize: "13px",
    marginBottom: "18px",
  },

  title: {
    fontFamily: "Poppins, Arial, sans-serif",
    fontSize: "44px",
    lineHeight: 1.15,
    margin: "0 auto 15px",
    maxWidth: "750px",
  },

  loadingCard_h1: {
    fontSize: "40px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#777",
    marginBottom: "45px",
  },

  loadingCard_p: {
    color: "#777",
    fontSize: "17px",
  },

  steps: {
    marginTop: "35px",
    display: "grid",
    gap: "12px",
    color: "#6D8196",
  },

  successIcon: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "#E5EEE9",
    color: "#567565",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 25px",
    fontSize: "32px",
    fontWeight: 700,
  },

  errorIcon: {
    width: "90px",
    height: "90px",
    borderRadius: "25px",
    background: "#F0E8E8",
    color: "#876D6D",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 35px",
    fontSize: "42px",
    fontWeight: 700,
  },

  errorText: {
    color: "#777",
    fontSize: "17px",
    marginBottom: "35px",
  },

  workerCard: {
    maxWidth: "700px",
    margin: "0 auto 30px",
    background: "#fff",
    border: "1px solid #D9D9CE",
    borderRadius: "24px",
    padding: "30px",
    display: "flex",
    alignItems: "center",
    gap: "25px",
    textAlign: "left",
    boxShadow: "0 15px 40px rgba(74,74,74,.08)",
  },

  avatar: {
    minWidth: "85px",
    height: "85px",
    borderRadius: "50%",
    background: "#6D8196",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "34px",
    fontWeight: 700,
  },

  workerInfo: {
    flex: 1,
  },

  verified: {
    display: "inline-block",
    background: "#E5EEE9",
    color: "#567565",
    borderRadius: "20px",
    padding: "6px 12px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
    marginBottom: "8px",
  },

  occupation: {
    margin: "5px 0 15px",
    color: "#777",
    fontSize: "17px",
  },

  stats: {
    display: "flex",
    flexWrap: "wrap",
    gap: "18px",
    color: "#5F6870",
    fontSize: "14px",
    fontWeight: 600,
  },

  summary: {
    maxWidth: "700px",
    margin: "0 auto 25px",
    background: "#fff",
    border: "1px solid #D9D9CE",
    borderRadius: "20px",
    padding: "25px 30px",
    textAlign: "left",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "12px 0",
    borderBottom: "1px solid #EEEEDF",
  },

  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "18px",
    marginTop: "5px",
    fontSize: "18px",
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
  },

  primaryButton: {
    border: "none",
    background: "#6D8196",
    color: "#fff",
    padding: "15px 25px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
  },

  secondaryButton: {
    background: "#fff",
    color: "#6D8196",
    border: "1px solid #C9C9BE",
    padding: "15px 25px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
  },

  confirmButton: {
    width: "100%",
    maxWidth: "700px",
    border: "none",
    background: "#6D8196",
    color: "#fff",
    padding: "18px",
    borderRadius: "14px",
    fontSize: "18px",
    fontWeight: 700,
    cursor: "pointer",
  },

  changeButton: {
    marginTop: "15px",
    border: "none",
    background: "transparent",
    color: "#6D8196",
    fontSize: "15px",
    cursor: "pointer",
  },
};