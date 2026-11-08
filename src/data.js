// SINGLE SOURCE OF TRUTH: edit this file and both the site and the downloadable CV update.
export const D = {
  name: "Khawaja Anas Javed",
  title: "Data Science Undergraduate",
  roles: ["Data Science Student", "Python & C++ Developer", "Power BI Analyst", "RAG & Local LLM Builder", "Claude Code Power User"],
  summary: "BS Data Science student at Pak-Austria Fachhochschule building strong foundations in programming, data analysis and applied AI — from C++ problem solving to Power BI dashboards and local LLM / RAG workflows with Ollama and Claude Code.",
  location: "Pakistan",
  email: "hellowfromanas@gmail.com",
  github: "https://github.com/hellofromanas",
  linkedin: "https://www.linkedin.com/in/hellofromanas",
  formspree: "https://formspree.io/f/xzdarboq",
  nationality: "Pakistani",
  education: [
    { period: "29/10/2025 – Present", title: "Bachelors of Data Science", place: "Pak-Austria Fachhochschule IAST, Haripur", level: "EQF level 6",
      points: ["Programming fundamentals using C++", "Object-Oriented Programming", "Discrete Mathematics and logical reasoning", "Probability and Statistics for data analysis", "Algorithmic thinking and problem solving", "Basic data visualization and interpretation"] },
    { period: "01/08/2023 – 30/08/2025", title: "HSSC (FSc Pre-Engineering)", place: "Abbottabad Public School and College", level: "EQF level 4",
      points: ["Computer Science: programming fundamentals, basic data structures", "Advanced Mathematics: calculus, trigonometry, coordinate geometry", "Physics: mechanics, electricity & magnetism, wave motion"] },
    { period: "01/03/2021 – 30/03/2023", title: "SSC (Matriculation)", place: "Abbottabad Public School and College", level: "EQF level 3",
      points: ["Mathematics, Physics and introductory Computer Science", "Analytical thinking and problem-solving"] }
  ],
  skills: [
    { name: "Python", icon: "🐍", group: "Programming", note: "Data analysis, scripting, AI tooling" },
    { name: "C++", icon: "⚙️", group: "Programming", note: "OOP, algorithms, data structures" },
    { name: "Power BI", icon: "📊", group: "Data", note: "Dashboards & data storytelling" },
    { name: "RAG", icon: "🔎", group: "AI", note: "Retrieval-Augmented Generation pipelines" },
    { name: "Ollama", icon: "🦙", group: "AI", note: "Running LLMs locally" },
    { name: "Claude Code", icon: "🤖", group: "AI", note: "AI-assisted development workflows" },
    { name: "HTML / CSS / JS", icon: "🌐", group: "Web", note: "Responsive, animated front-ends" },
    { name: "Git & GitHub", icon: "🔀", group: "Tools", note: "Version control & collaboration" },
    { name: "Microsoft Office", icon: "📎", group: "Tools", note: "Documents, sheets, presentations" },
    { name: "Canva", icon: "🎨", group: "Tools", note: "Visual design" }
  ],
  projects: [
    { name: "Local RAG with Ollama", tag: "Python · RAG · Ollama", desc: "Retrieval-Augmented Generation pipeline that runs fully locally: chunking, embeddings, vector search and cited answers from a local LLM.", link: "https://github.com/hellofromanas/rag-ollama-local" },
    { name: "Student Performance EDA", tag: "Python · pandas · Matplotlib", desc: "End-to-end analysis workflow on a synthetic dataset: cleaning, visualisation and a regression model written with NumPy.", link: "https://github.com/hellofromanas/python-student-performance-eda" },
    { name: "Sales Dashboard (Power BI)", tag: "Power BI · DAX · Power Query", desc: "Star-schema data model, DAX measures and dashboard specification on synthetic sales data, validated against Python.", link: "https://github.com/hellofromanas/powerbi-sales-dashboard" },
    { name: "Student Management System", tag: "C++17 · OOP", desc: "Console application for student records and grades with ranking, statistics, CSV storage and unit tests.", link: "https://github.com/hellofromanas/student-management-cpp" },
    { name: "Bilal Sports", tag: "Client website · HTML/CSS/JS", desc: "Storefront website for a sports gear and sportswear shop in Havelian, deployed on Vercel.", link: "https://github.com/hellofromanas/Bilal-Sports", live: "https://bilalsports.vercel.app/" },
    { name: "Dr. Khalil Aesthetic Clinic", tag: "Client website · HTML/CSS/JS", desc: "Website built for an aesthetic clinic, deployed on Vercel.", live: "https://khalilaesthetics.vercel.app/" },
    { name: "Noor Al Hidayah Quran Academy", tag: "Client website · HTML/CSS/JS", desc: "Website for an online Quran academy, deployed on Netlify.", link: "https://github.com/hellofromanas/noor-al-hidayah", live: "https://noor-al-hidayah.netlify.app/" },
  ],
  experience: [
    { period: "2025 – Present", role: "Freelance Web Developer", org: "Client Projects", desc: "Designed, built and deployed responsive websites: Dr. Khalil Aesthetic Clinic (khalilaesthetics.vercel.app), Bilal Sports (bilalsports.vercel.app) and Noor Al Hidayah Quran Academy (noor-al-hidayah.netlify.app)." },
    { period: "2024 – Present", role: "Team Member — Registration & Security", org: "PAMUN", desc: "Managed delegate registration workflows, verified participant credentials and coordinated on-site security for the Pak-Austria Model United Nations." },
    { period: "2023 – 2024", role: "Team Member — Registrations", org: "IEEE", desc: "Facilitated member onboarding, managed participant databases and supported workshops and campus events." }
  ],
  goals: ["Build a strong C++ & Python project portfolio", "Master data structures and algorithms", "Ship RAG applications powered by local LLMs", "Contribute to open-source projects"]
};
export default D;
