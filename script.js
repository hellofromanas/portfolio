document.addEventListener("DOMContentLoaded", () => {
  const routes = ["home", "about", "skills", "experience", "education", "contact"];
  const views = document.querySelectorAll(".page-view");
  const navLinks = document.querySelectorAll(".nav-link");

  function navigateTo(hash) {
    let cleanRoute = hash.replace("#", "").toLowerCase() || "home";

    // Handle jump to contact section smoothly on the home page
    if (cleanRoute === "contact") {
      views.forEach((view) => view.classList.remove("active"));
      const homeView = document.getElementById("home");
      if (homeView) homeView.classList.add("active");
      
      const contactEl = document.getElementById("contact");
      if (contactEl) contactEl.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!routes.includes(cleanRoute)) {
      cleanRoute = "home";
    }

    // Toggle active views
    views.forEach((view) => {
      view.classList.toggle("active", view.id === cleanRoute);
    });

    // Update nav active link state
    navLinks.forEach((link) => {
      const target = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active-link", target === cleanRoute);
    });

    window.scrollTo(0, 0);
  }

  // Handle browser back/forward and initial page loads
  window.addEventListener("hashchange", () => navigateTo(window.location.hash));
  navigateTo(window.location.hash);
});