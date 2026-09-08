import { useEffect, useState } from "react";
import API_URL from "../config/api";

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [workers, setWorkers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ==========================================
  // LOAD ADMIN + WORKERS
  // ==========================================

  const loadData = async (silent = false) => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [userResponse, workersResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API_URL}/api/workers`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const userData =
        await userResponse.json();

      const workersData =
        await workersResponse.json();

      if (!userResponse.ok) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!workersResponse.ok) {
        throw new Error(
          workersData.message ||
            "Unable to load workers."
        );
      }

      setUser(userData.user);

      setWorkers(
        workersData.workers || []
      );

    } catch (err) {
      console.error(
        "Admin dashboard error:",
        err
      );

      setError(
        err.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData(true);
    }, 15000);

    return () => clearInterval(interval);
  }, []);


  // ==========================================
  // APPROVE / REJECT WORKER
  // ==========================================

  const updateWorkerVerification = async (
    workerId,
    status
  ) => {
    if (!workerId) {
      setError("Worker ID is missing.");
      return;
    }

    try {
      setActionLoading(workerId);
      setError("");

      const approved =
        status === "verified";

      console.log(
        "Updating worker:",
        workerId,
        status
      );

      const response = await fetch(
        `${API_URL}/api/workers/${workerId}/verification`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            verificationStatus: status,
            isVerified: approved,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Verification response:",
        response.status,
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update worker verification."
        );
      }

      // Update UI immediately
      setWorkers((currentWorkers) =>
        currentWorkers.map((worker) => {
          if (worker._id !== workerId) {
            return worker;
          }

          return {
            ...worker,

            verificationStatus: status,

            isVerified: approved,

            availability:
              approved
                ? true
                : false,
          };
        })
      );

    } catch (err) {
      console.error(
        "Worker verification error:",
        err
      );

      setError(
        err.message ||
          "Unable to update worker."
      );
    } finally {
      setActionLoading(null);
    }
  };


  // ==========================================
  // STATS
  // ==========================================

  const totalWorkers =
    workers.length;

  const verifiedWorkers =
    workers.filter(
      (worker) =>
        worker.isVerified === true ||
        worker.verificationStatus ===
          "verified"
    ).length;

  const pendingWorkers =
    workers.filter(
      (worker) =>
        worker.verificationStatus ===
          "pending" ||
        (!worker.verificationStatus &&
          !worker.isVerified)
    ).length;

  const rejectedWorkers =
    workers.filter(
      (worker) =>
        worker.verificationStatus ===
        "rejected"
    ).length;

  const availableWorkers =
    workers.filter(
      (worker) =>
        (worker.isVerified === true ||
          worker.verificationStatus ===
            "verified") &&
        worker.availability === true
    ).length;


  // ==========================================
  // WORKER STATUS
  // ==========================================

  const getStatus = (worker) => {
    if (
      worker.verificationStatus ===
      "verified" ||
      worker.isVerified === true
    ) {
      return "verified";
    }

    if (
      worker.verificationStatus ===
      "rejected"
    ) {
      return "rejected";
    }

    return "pending";
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <div className="ad-loading">
          <div className="ad-spinner"></div>

          <h2>
            Loading Admin Dashboard...
          </h2>

          <p>
            Loading worker verification data
          </p>
        </div>
      </>
    );
  }


  return (
    <>
      <style>{styles}</style>

      <main className="ad-page">

        {/* ======================================
            HEADER
        ====================================== */}

        <header className="ad-header">

          <div>
            <div className="ad-eyebrow">
              SAHAAYAK ADMIN PANEL
            </div>

            <h1>
              Worker Verification
            </h1>

            <p>
              Review and manage local service
              providers.
            </p>
          </div>

          <button
            className="ad-refresh"
            onClick={() =>
              loadData(true)
            }
            disabled={refreshing}
          >
            {refreshing
              ? "Refreshing..."
              : "↻ Refresh Data"}
          </button>

        </header>


        {/* ======================================
            ADMIN INFO
        ====================================== */}

        <div className="ad-admin-bar">

          <div className="ad-admin-avatar">
            {(user?.name || "A")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>
              {user?.name || "Administrator"}
            </strong>

            <span>
              {user?.email ||
                "Admin account"}
            </span>
          </div>

        </div>


        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="ad-error">
            <strong>
              Action failed:
            </strong>{" "}
            {error}
          </div>
        )}


        {/* ======================================
            STATISTICS
        ====================================== */}

        <section className="ad-stats">

          <div className="ad-stat-card">

            <div className="ad-stat-icon">
              👥
            </div>

            <div>
              <span>
                TOTAL WORKERS
              </span>

              <strong>
                {totalWorkers}
              </strong>

              <p>
                Registered providers
              </p>
            </div>

          </div>


          <div className="ad-stat-card">

            <div className="ad-stat-icon pending">
              ⏳
            </div>

            <div>
              <span>
                PENDING REVIEW
              </span>

              <strong>
                {pendingWorkers}
              </strong>

              <p>
                Need verification
              </p>
            </div>

          </div>


          <div className="ad-stat-card">

            <div className="ad-stat-icon verified">
              ✓
            </div>

            <div>
              <span>
                VERIFIED WORKERS
              </span>

              <strong>
                {verifiedWorkers}
              </strong>

              <p>
                Approved providers
              </p>
            </div>

          </div>


          <div className="ad-stat-card">

            <div className="ad-stat-icon available">
              ●
            </div>

            <div>
              <span>
                AVAILABLE NOW
              </span>

              <strong>
                {availableWorkers}
              </strong>

              <p>
                Ready for jobs
              </p>
            </div>

          </div>


          <div className="ad-stat-card">

            <div className="ad-stat-icon rejected">
              !
            </div>

            <div>
              <span>
                REJECTED
              </span>

              <strong>
                {rejectedWorkers}
              </strong>

              <p>
                Verification rejected
              </p>
            </div>

          </div>

        </section>


        {/* ======================================
            WORKERS
        ====================================== */}

        <section className="ad-workers-section">

          <div className="ad-section-heading">

            <div>
              <div className="ad-eyebrow">
                PROVIDER MANAGEMENT
              </div>

              <h2>
                Registered Workers
              </h2>
            </div>

            <span className="ad-count">
              {workers.length}
            </span>

          </div>


          {workers.length === 0 ? (

            <div className="ad-empty">
              <div>
                👥
              </div>

              <h2>
                No workers found
              </h2>

              <p>
                Registered workers will appear
                here.
              </p>
            </div>

          ) : (

            <div className="ad-workers-grid">

              {workers.map((worker) => {

                const status =
                  getStatus(worker);

                const busy =
                  actionLoading ===
                  worker._id;

                return (
                  <article
                    className="ad-worker-card"
                    key={worker._id}
                  >

                    {/* TOP */}

                    <div className="ad-worker-top">

                      <div className="ad-worker-avatar">
                        {(worker.name ||
                          "W")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="ad-worker-name">

                        <h3>
                          {worker.name ||
                            "Unnamed Worker"}
                        </h3>

                        <p>
                          {worker.occupation ||
                            "Service Provider"}
                        </p>

                      </div>

                      <span
                        className={`ad-status ${status}`}
                      >
                        {status ===
                        "verified"
                          ? "✓ Verified"
                          : status ===
                            "rejected"
                          ? "Rejected"
                          : "Pending"}
                      </span>

                    </div>


                    {/* INFORMATION */}

                    <div className="ad-worker-info">

                      <div>
                        <span>
                          EMAIL
                        </span>

                        <strong>
                          {worker.email ||
                            "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          PHONE
                        </span>

                        <strong>
                          {worker.phone ||
                            "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          EXPERIENCE
                        </span>

                        <strong>
                          {worker.experience ||
                            0} years
                        </strong>
                      </div>

                      <div>
                        <span>
                          RATING
                        </span>

                        <strong>
                          ⭐{" "}
                          {Number(
                            worker.rating ||
                              0
                          ).toFixed(1)}
                        </strong>
                      </div>

                    </div>


                    {/* SKILLS */}

                    {worker.skills?.length >
                      0 && (

                      <div className="ad-skills">

                        {worker.skills
                          .slice(0, 4)
                          .map((skill) => (
                            <span
                              key={skill}
                            >
                              {skill}
                            </span>
                          ))}

                      </div>

                    )}


                    {/* ACTIONS */}

                    <div className="ad-actions">

                      {status !==
                        "verified" && (

                        <button
                          className="ad-approve"
                          disabled={busy}
                          onClick={() =>
                            updateWorkerVerification(
                              worker._id,
                              "verified"
                            )
                          }
                        >
                          {busy
                            ? "Updating..."
                            : "✓ Approve Worker"}
                        </button>

                      )}


                      {status !==
                        "rejected" && (

                        <button
                          className="ad-reject"
                          disabled={busy}
                          onClick={() =>
                            updateWorkerVerification(
                              worker._id,
                              "rejected"
                            )
                          }
                        >
                          {busy
                            ? "Updating..."
                            : "✕ Reject"}
                        </button>

                      )}

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </section>


        {/* ======================================
            FOOTER
        ====================================== */}

        <footer className="ad-footer">
          Sahaayak Admin · Worker verification
          and community service management
        </footer>

      </main>
    </>
  );
}


// =================================================
// STYLES
// =================================================

const styles = `
* {
  box-sizing: border-box;
}

.ad-page {
  min-height: 100vh;
  padding: 50px 6%;
  background: #ffffe3;
  color: #4a4a4a;
}

.ad-header {
  max-width: 1450px;
  margin: 0 auto 25px;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  gap: 25px;
}

.ad-eyebrow {
  color: #6d8196;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
}

.ad-header h1 {
  margin: 8px 0 5px;

  font-family: Poppins, sans-serif;
  font-size: clamp(34px, 4vw, 52px);

  color: #3f4650;
}

.ad-header p {
  margin: 0;
  color: #858d93;
}

.ad-refresh {
  border: 0;

  background: #6d8196;
  color: white;

  padding: 14px 22px;

  border-radius: 14px;

  font-weight: 800;
  cursor: pointer;
}

.ad-refresh:hover {
  transform: translateY(-2px);
}

.ad-refresh:disabled {
  opacity: .6;
  cursor: not-allowed;
}


/* ADMIN BAR */

.ad-admin-bar {
  max-width: 1450px;
  margin: 0 auto 25px;

  padding: 18px 22px;

  background: rgba(255,255,255,.8);

  border: 1px solid #e5e3d7;

  border-radius: 18px;

  display: flex;
  align-items: center;

  gap: 14px;
}

.ad-admin-avatar {
  width: 48px;
  height: 48px;

  border-radius: 15px;

  background: #6d8196;
  color: white;

  display: grid;
  place-items: center;

  font-size: 20px;
  font-weight: 800;
}

.ad-admin-bar strong {
  display: block;
  color: #414951;
}

.ad-admin-bar span {
  display: block;
  margin-top: 3px;
  color: #92999d;
  font-size: 12px;
}


/* ERROR */

.ad-error {
  max-width: 1450px;
  margin: 0 auto 25px;

  padding: 15px 18px;

  border-radius: 14px;

  background: #fff4f1;
  border: 1px solid #ebcbc3;

  color: #a34f42;
}


/* STATS */

.ad-stats {
  max-width: 1450px;
  margin: 0 auto 38px;

  display: grid;

  grid-template-columns:
    repeat(5, 1fr);

  gap: 18px;
}

.ad-stat-card {
  min-height: 170px;

  padding: 25px;

  background: rgba(255,255,255,.88);

  border: 1px solid #e5e3d7;

  border-radius: 22px;

  display: flex;
  align-items: center;

  gap: 16px;

  box-shadow:
    0 12px 30px rgba(74,74,74,.05);
}

.ad-stat-icon {
  width: 52px;
  height: 52px;

  flex: 0 0 52px;

  border-radius: 16px;

  background: #edf0f1;

  display: grid;
  place-items: center;

  font-size: 20px;

  color: #5d6d7d;
}

.ad-stat-icon.pending {
  background: #f7eedc;
}

.ad-stat-icon.verified {
  background: #e7f0e9;
}

.ad-stat-icon.available {
  background: #e8efed;
}

.ad-stat-icon.rejected {
  background: #f6e7e3;
}

.ad-stat-card span {
  display: block;

  color: #858d94;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1.5px;
}

.ad-stat-card strong {
  display: block;

  margin: 4px 0;

  color: #414951;

  font-family: Poppins, sans-serif;

  font-size: 36px;
}

.ad-stat-card p {
  margin: 0;

  color: #9a9fa3;

  font-size: 11px;
}


/* WORKERS */

.ad-workers-section {
  max-width: 1450px;
  margin: 0 auto;
}

.ad-section-heading {
  margin-bottom: 18px;

  display: flex;
  justify-content: space-between;
  align-items: end;
}

.ad-section-heading h2 {
  margin: 7px 0 0;

  color: #3f4650;

  font-family: Poppins, sans-serif;

  font-size: 28px;
}

.ad-count {
  width: 42px;
  height: 42px;

  border-radius: 13px;

  background: white;

  border: 1px solid #e3e1d6;

  display: grid;
  place-items: center;

  color: #6d8196;

  font-weight: 800;
}


/* GRID */

.ad-workers-grid {
  display: grid;

  grid-template-columns:
    repeat(auto-fill, minmax(350px, 1fr));

  gap: 20px;
}


/* CARD */

.ad-worker-card {
  padding: 24px;

  background: white;

  border: 1px solid #e4e2d7;

  border-radius: 22px;

  box-shadow:
    0 12px 30px rgba(74,74,74,.06);

  transition:
    transform .2s ease,
    box-shadow .2s ease;
}

.ad-worker-card:hover {
  transform: translateY(-3px);

  box-shadow:
    0 18px 40px rgba(74,74,74,.09);
}


/* WORKER TOP */

.ad-worker-top {
  display: flex;
  align-items: center;

  gap: 13px;

  margin-bottom: 22px;
}

.ad-worker-avatar {
  width: 55px;
  height: 55px;

  flex: 0 0 55px;

  border-radius: 17px;

  background: #edf0ef;

  color: #5c497d;

  display: grid;
  place-items: center;

  font-size: 21px;

  font-weight: 800;
}

.ad-worker-name {
  flex: 1;
  min-width: 0;
}

.ad-worker-name h3 {
  margin: 0;

  color: #414951;

  font-family: Poppins, sans-serif;

  font-size: 18px;
}

.ad-worker-name p {
  margin: 4px 0 0;

  color: #8e969b;

  font-size: 12px;
}


/* STATUS */

.ad-status {
  padding: 6px 9px;

  border-radius: 20px;

  font-size: 9px;

  font-weight: 800;

  white-space: nowrap;
}

.ad-status.pending {
  background: #fff3d9;
  color: #8a6b32;
}

.ad-status.verified {
  background: #e6f0e8;
  color: #4f7458;
}

.ad-status.rejected {
  background: #f8e7e3;
  color: #a25549;
}


/* INFO */

.ad-worker-info {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 16px;

  padding: 18px 0;

  border-top:
    1px solid #efede4;

  border-bottom:
    1px solid #efede4;
}

.ad-worker-info span {
  display: block;

  margin-bottom: 4px;

  color: #a0a5a8;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1px;
}

.ad-worker-info strong {
  display: block;

  color: #555d63;

  font-size: 12px;

  word-break: break-word;
}


/* SKILLS */

.ad-skills {
  display: flex;

  flex-wrap: wrap;

  gap: 7px;

  margin-top: 17px;
}

.ad-skills span {
  padding: 6px 9px;

  border-radius: 8px;

  background: #f1f0e8;

  color: #727b82;

  font-size: 10px;
}


/* ACTIONS */

.ad-actions {
  display: flex;

  gap: 9px;

  margin-top: 20px;
}

.ad-actions button {
  flex: 1;

  padding: 12px 10px;

  border-radius: 11px;

  font-size: 12px;

  font-weight: 800;

  cursor: pointer;

  transition: .2s ease;
}

.ad-approve {
  border: none;

  background: #6d8196;

  color: white;
}

.ad-approve:hover {
  transform: translateY(-1px);
}

.ad-reject {
  border: 1px solid #e4c5be;

  background: white;

  color: #a25549;
}

.ad-reject:hover {
  background: #fff6f3;
}

.ad-actions button:disabled {
  opacity: .55;
  cursor: not-allowed;
}


/* EMPTY */

.ad-empty {
  padding: 70px 25px;

  text-align: center;

  background: rgba(255,255,255,.75);

  border: 1px solid #e5e3d7;

  border-radius: 22px;
}

.ad-empty > div {
  font-size: 40px;
}

.ad-empty h2 {
  margin: 12px 0 5px;

  color: #414951;

  font-family: Poppins, sans-serif;
}

.ad-empty p {
  margin: 0;

  color: #92999d;
}


/* LOADING */

.ad-loading {
  min-height: 100vh;

  background: #ffffe3;

  display: grid;

  place-items: center;

  align-content: center;

  color: #6d8196;
}

.ad-loading h2 {
  margin: 15px 0 5px;
}

.ad-loading p {
  color: #92999d;
}

.ad-spinner {
  width: 44px;
  height: 44px;

  border: 4px solid #e2e3da;

  border-top-color: #6d8196;

  border-radius: 50%;

  animation: ad-spin .8s linear infinite;
}

@keyframes ad-spin {
  to {
    transform: rotate(360deg);
  }
}


/* FOOTER */

.ad-footer {
  max-width: 1450px;

  margin: 40px auto 0;

  padding-top: 20px;

  border-top: 1px solid #e4e2d7;

  text-align: center;

  color: #9ca1a4;

  font-size: 11px;
}


/* RESPONSIVE */

@media (max-width: 1200px) {
  .ad-stats {
    grid-template-columns:
      repeat(3, 1fr);
  }
}

@media (max-width: 750px) {

  .ad-page {
    padding: 30px 18px;
  }

  .ad-header {
    flex-direction: column;
  }

  .ad-refresh {
    width: 100%;
  }

  .ad-stats {
    grid-template-columns:
      1fr 1fr;
  }

  .ad-workers-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 500px) {

  .ad-stats {
    grid-template-columns: 1fr;
  }

  .ad-worker-top {
    flex-wrap: wrap;
  }

  .ad-status {
    margin-left: auto;
  }
}
`;

export default AdminDashboard;