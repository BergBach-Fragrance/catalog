import { storeConfig } from "../config/config.js";

// setup.js - Script to apply configuration to HTML
document.addEventListener("DOMContentLoaded", function () {
  // Set the page title
  document.getElementById(
    "site-title"
  ).textContent = `${storeConfig.site.name} - ${storeConfig.site.description}`;

  // Set the header
  document.getElementById("header-title").textContent =
    storeConfig.site.shortName;
  document.getElementById("header-subtitle").textContent =
    storeConfig.site.subtitle;

  // Set the search input placeholder
  document.getElementById("search-input").placeholder =
    storeConfig.search.placeholder;

  // Set filters
  const brandFilter = document.getElementById("brand-filter");
  brandFilter.innerHTML = '<option value="">Todas las marcas</option>';
  storeConfig.search.filters.brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand.value;
    option.textContent = brand.text;
    brandFilter.appendChild(option);
  });

  const typeFilter = document.getElementById("gender-filter");
  typeFilter.innerHTML = '<option value="">Todos los generos</option>';
  storeConfig.search.filters.genders.forEach((gender) => {
    const option = document.createElement("option");
    option.value = gender.value;
    option.textContent = gender.text;
    typeFilter.appendChild(option);
  });

  const sortFilter = document.getElementById("sort-filter");
  sortFilter.innerHTML = "";
  storeConfig.search.filters.sorting.forEach((sort) => {
    const option = document.createElement("option");
    option.value = sort.value;
    option.textContent = sort.text;
    sortFilter.appendChild(option);
  });

  // Set the footer
  document.getElementById("footer-title").textContent =
    storeConfig.footer.title;
  document.getElementById("footer-description").textContent =
    storeConfig.footer.description;

  // Set social media links
  const socialLinksContainer = document.getElementById(
    "social-links-container"
  );
  socialLinksContainer.innerHTML = "";
  storeConfig.footer.socialLinks.forEach((link) => {
    const a = document.createElement("a");
    a.href = link.url;
    const i = document.createElement("i");
    i.className = `fab fa-${link.platform}`;
    a.appendChild(i);
    socialLinksContainer.appendChild(a);
  });

  // Set the copyright
  document.getElementById(
    "copyright"
  ).textContent = `© ${storeConfig.site.copyright}`;

  // Open Graph and Twitter meta tags
  const metaTags = document.querySelector("head");
  const ogTitle = document.createElement("meta");
  ogTitle.setAttribute("property", "og:title");
  ogTitle.setAttribute("content", storeConfig.site.title);
  metaTags.appendChild(ogTitle);

  const ogDescription = document.createElement("meta");
  ogDescription.setAttribute("property", "og:description");
  ogDescription.setAttribute("content", storeConfig.site.description);
  metaTags.appendChild(ogDescription);

  const ogImage = document.createElement("meta");
  ogImage.setAttribute("property", "og:image");
  ogImage.setAttribute("content", storeConfig.site.previewImage);
  metaTags.appendChild(ogImage);

  const ogUrl = document.createElement("meta");
  ogUrl.setAttribute("property", "og:url");
  ogUrl.setAttribute("content", storeConfig.site.url);
  metaTags.appendChild(ogUrl);

  const twitterTitle = document.createElement("meta");
  twitterTitle.setAttribute("name", "twitter:title");
  twitterTitle.setAttribute("content", storeConfig.site.title);
  metaTags.appendChild(twitterTitle);

  const twitterDescription = document.createElement("meta");
  twitterDescription.setAttribute("name", "twitter:description");
  twitterDescription.setAttribute("content", storeConfig.site.description);
  metaTags.appendChild(twitterDescription);

  const twitterImage = document.createElement("meta");
  twitterImage.setAttribute("name", "twitter:image");
  twitterImage.setAttribute("content", storeConfig.site.previewImage);
  metaTags.appendChild(twitterImage);
});
