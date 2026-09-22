import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [file, setFile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/roles`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load career roles");
        }
        return response.json();
      })
      .then((data) => {
        setRoles(data.roles);
      })
      .catch(() => {
        setError("Cannot connect to the backend. Make sure FastAPI is running.");
      });
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF resume.");
      return;
    }

    setFile(selectedFile);
    setError("");
    setResult(null);
  };

  const analyzeResume = async () => {
    if (!file) {
      setError("Please upload your resume.");
      return;
    }

    if (!role) {
      setError("Please select a career role.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("role", role);

    try {
      const response = await fetch(`${API_URL}/analyze-resume`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      <nav className="navbar">
        <div className="logo">
          Resume <span>AI</span> Analyzer
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#analyzer">Analyzer</a>
          <a href="#features">Features</a>
        </div>

        <button
          className="nav-button"
          onClick={() =>
            document
              .getElementById("analyzer")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          Analyze Resume
        </button>
      </nav>

      <section className="hero" id="home">
        <div className="badge">AI-Powered Resume Analysis</div>

        <h1>
          Turn Your Resume Into
          <span> Your Career Roadmap</span>
        </h1>

        <p>
          Upload your resume, choose your target career, and discover
          the skills you already have and the skills you need to develop.
        </p>

        <button
          className="hero-button"
          onClick={() =>
            document
              .getElementById("analyzer")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          Analyze My Resume
        </button>
      </section>

      <section className="analyzer-section" id="analyzer">

        <div className="section-heading">
          <p className="small-title">RESUME ANALYZER</p>
          <h2>Analyze Your Career Readiness</h2>
          <p>
            Upload your resume and select the career you want to target.
          </p>
        </div>

        <div className="workspace">

          <div className="panel">

            <h3>Upload Your Resume</h3>

            <p className="panel-description">
              Upload your resume in PDF format.
            </p>

            <label className="upload-box">

              <div className="upload-icon">↑</div>

              <strong>
                {file ? file.name : "Upload your resume"}
              </strong>

              <span>
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB`
                  : "Click here to select a PDF file"}
              </span>

              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />

            </label>

            {file && (
              <button
                className="remove-button"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
              >
                Remove file
              </button>
            )}

          </div>

          <div className="panel">

            <h3>Select Target Career</h3>

            <p className="panel-description">
              {file
                ? "Choose the career you want to analyze your resume for."
                : "Upload your resume first to select a target career."}
            </p>

            <select
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                setResult(null);
              }}
              disabled={!file || roles.length === 0}
            >
              <option value="">
                {!file
                  ? "Upload resume first"
                  : roles.length === 0
                  ? "Loading careers..."
                  : "Select a career role"}
              </option>

              {roles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              className="analyze-button"
              onClick={analyzeResume}
              disabled={loading || !file || !role}
            >
              {loading ? "Analyzing Resume..." : "Analyze Resume"}
            </button>

          </div>

        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <h3>Analyzing your resume...</h3>
            <p>
              Extracting skills and comparing them with your target career.
            </p>
          </div>
        )}

        {result && !loading && (
          <section className="results">

            <div className="result-header">
              <div>
                <p className="small-title">ANALYSIS COMPLETE</p>
                <h2>Resume Analysis</h2>
              </div>

              <div className="role-badge">
                {result.role}
              </div>
            </div>

            <div className="result-grid">

              <div className="score-card">

                <p>Skill Match</p>

                <div className="score">
                  {result.match_percentage}%
                </div>

                <h3>{result.role}</h3>

                <span>
                  Overall career skill match
                </span>

              </div>

              <div className="skills-card">

                <div className="card-title">
                  <h3>Skills Found</h3>
                  <span>{result.extracted_skills.length}</span>
                </div>

                <div className="skills">
                  {result.extracted_skills.length > 0 ? (
                    result.extracted_skills.map((skill) => (
                      <span className="skill" key={skill}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p>No skills detected.</p>
                  )}
                </div>

              </div>

            </div>

            <div className="skill-columns">

              <div className="skill-list-card">

                <div className="card-title">
                  <h3>Matched Skills</h3>
                  <span className="matched-count">
                    {result.matched_skills.length}
                  </span>
                </div>

                <div className="skills">
                  {result.matched_skills.length > 0 ? (
                    result.matched_skills.map((skill) => (
                      <span className="skill matched" key={skill}>
                        ✓ {skill}
                      </span>
                    ))
                  ) : (
                    <p>No matched skills.</p>
                  )}
                </div>

              </div>

              <div className="skill-list-card">

                <div className="card-title">
                  <h3>Skills To Develop</h3>
                  <span className="missing-count">
                    {result.missing_skills.length}
                  </span>
                </div>

                <div className="skills">
                  {result.missing_skills.length > 0 ? (
                    result.missing_skills.map((skill) => (
                      <span className="skill missing" key={skill}>
                        + {skill}
                      </span>
                    ))
                  ) : (
                    <p>No missing skills.</p>
                  )}
                </div>

              </div>

            </div>

          </section>
        )}

      </section>

      <section className="features" id="features">

        <div className="section-heading">
          <p className="small-title">FEATURES</p>
          <h2>What Resume AI Analyzer Does</h2>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Resume Skill Extraction</h3>
            <p>
              Extract technical skills from your uploaded resume.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Skill Gap Analysis</h3>
            <p>
              Compare your skills with the requirements of your target role.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Career Match</h3>
            <p>
              See your overall skill match percentage for the selected career.
            </p>
          </div>

        </div>

      </section>

      <footer>
        <strong>Resume AI Analyzer</strong>
        <p>AI-powered resume and career skill analysis.</p>
      </footer>

    </div>
  );
}

export default App;