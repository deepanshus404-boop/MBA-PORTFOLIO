(function () {
  const content = window.PORTFOLIO_CONTENT || {};
  const profile = content.profile || {};
  const $ = (id) => document.getElementById(id);

  function text(id, value) {
    const element = $(id);
    if (element && value) element.textContent = value;
  }

  function addTag(parent, label, className) {
    const tag = document.createElement("span");
    tag.className = className;
    tag.textContent = label;
    parent.appendChild(tag);
  }

  function renderCapabilities(capabilities) {
    const tabs = $("capability-tabs");
    const panel = $("capability-panel");
    if (!tabs || !panel || !capabilities.length) return;

    function selectCapability(index, moveFocus) {
      const capability = capabilities[index];
      const buttons = tabs.querySelectorAll("button");
      buttons.forEach((button, buttonIndex) => {
        const selected = buttonIndex === index;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      panel.innerHTML = "";
      const title = document.createElement("h3");
      title.textContent = capability.label;
      const summary = document.createElement("p");
      summary.className = "capability-summary";
      summary.textContent = capability.summary;
      const evidence = document.createElement("p");
      evidence.className = "capability-evidence";
      evidence.textContent = capability.evidence;
      panel.append(title, summary, evidence);
      if (moveFocus) panel.focus();
    }

    capabilities.forEach((capability, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.role = "tab";
      button.id = `capability-tab-${index}`;
      button.setAttribute("aria-controls", "capability-panel");
      button.textContent = capability.label;
      button.addEventListener("click", () => selectCapability(index, false));
      button.addEventListener("keydown", (event) => {
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % capabilities.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + capabilities.length) % capabilities.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = capabilities.length - 1;
        selectCapability(nextIndex, false);
        tabs.querySelectorAll("button")[nextIndex].focus();
      });
      tabs.appendChild(button);
    });
    selectCapability(0, false);
  }

  function addProject(project, index) {
    const article = document.createElement("article");
    article.className = `project-card project-card-${index % 3}`;

    const visual = document.createElement("div");
    visual.className = "project-visual";
    visual.setAttribute("aria-hidden", "true");
    const graphic = document.createElement("div");
    graphic.className = `project-graphic graphic-${index % 3}`;
    visual.appendChild(graphic);

    const meta = document.createElement("div");
    meta.className = "project-meta";
    const category = document.createElement("span");
    category.textContent = project.category || "Project";
    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    meta.append(category, number);

    const heading = document.createElement("h3");
    heading.textContent = project.title || "Untitled project";
    const summary = document.createElement("p");
    summary.className = "project-summary";
    summary.textContent = project.summary || "Add a short project summary in portfolio-content.js.";

    const tags = document.createElement("div");
    tags.className = "project-tags";
    (project.tags || []).filter(Boolean).forEach((label) => addTag(tags, label, "tag"));

    const links = document.createElement("div");
    links.className = "project-links";
    (project.links || []).forEach((item) => {
      const href = safeUrl(item.url);
      if (!href) return;
      const link = document.createElement("a");
      link.className = "project-file-link";
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${item.label || "Open project"} ↗`;
      links.appendChild(link);
    });

    const details = document.createElement("details");
    details.className = "project-details";
    const summaryToggle = document.createElement("summary");
    summaryToggle.textContent = "Read the project story";
    details.appendChild(summaryToggle);

    const detailBody = document.createElement("div");
    detailBody.className = "project-detail-body";
    if (project.workType) addDetail(detailBody, "Work type", project.workType);
    addDetail(detailBody, "The question", project.challenge);
    addDetail(detailBody, "My role", project.role);
    addDetail(detailBody, "My approach", project.approach);
    addDetail(detailBody, "The output", project.output);
    addDetail(detailBody, "Learning or outcome", project.learning);
    details.appendChild(detailBody);

    article.append(visual, meta, heading, summary, tags);
    if (links.childElementCount) article.appendChild(links);
    article.appendChild(details);
    return article;
  }

  function addDetail(parent, label, value) {
    if (!value) return;
    const row = document.createElement("div");
    row.className = "detail-row";
    const title = document.createElement("h4");
    title.textContent = label;
    const copy = document.createElement("p");
    copy.textContent = value;
    row.append(title, copy);
    parent.appendChild(row);
  }

  function addJourneyItem(item, index) {
    const article = document.createElement("article");
    article.className = "journey-step";
    const number = document.createElement("span");
    number.className = "step-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const heading = document.createElement("h3");
    heading.textContent = item.stage || "Milestone";
    const detail = document.createElement("p");
    detail.textContent = item.detail || "Add a short milestone description.";
    article.append(number, heading, detail);
    return article;
  }

  function addExperienceItem(item) {
    const article = document.createElement("article");
    article.className = "experience-card";
    const top = document.createElement("div");
    top.className = "experience-meta";
    const period = document.createElement("span");
    period.textContent = item.period || "Period to confirm";
    const location = document.createElement("span");
    location.textContent = item.location || "";
    top.append(period, location);
    const heading = document.createElement("h3");
    heading.textContent = item.role || "Role";
    const organization = document.createElement("p");
    organization.className = "experience-organization";
    organization.textContent = item.organization || "Organization";
    const summary = document.createElement("p");
    summary.className = "experience-summary";
    summary.textContent = item.summary || "Add a short description.";
    article.append(top, heading, organization, summary);
    const reportHref = safeUrl(item.reportUrl);
    if (reportHref) {
      const reportLink = document.createElement("a");
      reportLink.className = "project-file-link experience-report-link";
      reportLink.href = reportHref;
      reportLink.target = "_blank";
      reportLink.rel = "noopener noreferrer";
      reportLink.textContent = "View internship report ↗";
      article.appendChild(reportLink);
    }
    if (item.details) {
      const details = document.createElement("details");
      details.className = "experience-details";
      const toggle = document.createElement("summary");
      toggle.textContent = "More about this experience";
      const copy = document.createElement("p");
      copy.textContent = item.details;
      details.append(toggle, copy);
      article.appendChild(details);
    }
    return article;
  }

  function safeUrl(url) {
    if (!url) return "";
    // Accept relative links such as a locally stored resume.pdf, but reject
    // protocol-relative URLs and untrusted explicit schemes.
    if (!/^[a-z][a-z\d+.-]*:/i.test(url)) {
      return url.startsWith("//") ? "" : url;
    }
    try {
      const parsed = new URL(url, window.location.href);
      return ["http:", "https:", "mailto:"].includes(parsed.protocol) ? parsed.href : "";
    } catch (_) {
      return "";
    }
  }

  function addContactLink(parent, label, url) {
    const href = safeUrl(url);
    if (!href) return;
    const link = document.createElement("a");
    link.className = "contact-link";
    link.href = href;
    if (href.startsWith("http:") || href.startsWith("https:")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    link.textContent = label;
    parent.appendChild(link);
  }

  text("brand-name", profile.displayName);
  text("footer-name", profile.displayName);
  text("hero-eyebrow", profile.eyebrow);
  text("hero-headline", profile.headline);
  text("hero-intro", profile.intro);
  text("degree-label", profile.degree);
  text("university-label", profile.university);
  text("location-label", profile.location);
  text("about-heading", profile.aboutHeading);
  text("about-text", profile.about);
  text("contact-note", profile.contactNote);
  renderCapabilities(profile.capabilities || []);

  const publication = content.publication || {};
  text("publication-label", publication.label);
  text("publication-title", publication.title);
  text("publication-summary", publication.summary);
  text("publication-journal", publication.journal);
  const publicationLink = $("publication-link");
  const publicationHref = safeUrl(publication.url);
  if (publicationLink && publicationHref) {
    publicationLink.href = publicationHref;
    publicationLink.target = "_blank";
    publicationLink.rel = "noopener noreferrer";
  }
  const publicationGallery = $("publication-gallery");
  (publication.images || []).forEach((item, index) => {
    const imageUrl = safeUrl(item.src);
    if (!publicationGallery || !imageUrl) return;
    let figure = publicationGallery.querySelector(`.publication-photo-${index + 1}`);
    if (!figure) {
      figure = document.createElement("figure");
      figure.className = `publication-photo publication-photo-${index + 1}`;
      const image = document.createElement("img");
      const caption = document.createElement("figcaption");
      figure.append(image, caption);
      publicationGallery.appendChild(figure);
    }
    let image = figure.querySelector("img");
    if (!image) {
      image = document.createElement("img");
      figure.prepend(image);
    }
    image.src = imageUrl;
    image.alt = item.alt || "Photo from a research presentation";
    let caption = figure.querySelector("figcaption");
    if (!caption) {
      caption = document.createElement("figcaption");
      figure.appendChild(caption);
    }
    caption.textContent = item.caption || "";
  });

  const year = $("portfolio-year");
  if (year) year.textContent = String(new Date().getFullYear());

  const projects = $("project-grid");
  (content.projects || []).forEach((project, index) => projects.appendChild(addProject(project, index)));

  const experience = $("experience-grid");
  (content.experience || []).forEach((item) => experience.appendChild(addExperienceItem(item)));

  const journey = $("journey-grid");
  (content.journey || []).forEach((item, index) => journey.appendChild(addJourneyItem(item, index)));

  const contact = $("contact-links");
  addContactLink(contact, "Email me ↗", profile.email ? `mailto:${profile.email}` : "");
  addContactLink(contact, "LinkedIn ↗", profile.linkedinUrl);
  addContactLink(contact, "View resume ↗", profile.resumeUrl);
})();
