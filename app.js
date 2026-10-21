const menu = document.querySelector(".menu-button"),
  nav = document.querySelector("#navigation");
const closeMenu = () => {
  menu.setAttribute("aria-expanded", "false");
  nav.classList.remove("open");
};
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
  if (open) nav.querySelector("a").focus();
});
nav
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("click", (e) => {
  if (!e.target.closest(".header")) closeMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menu.focus();
  }
});
document.querySelectorAll("[data-words]").forEach((el) => {
  let i = 0;
  const walk = (n) =>
    [...n.childNodes].forEach((x) => {
      if (x.nodeType === 3) {
        const f = document.createDocumentFragment();
        x.textContent.split(/(\s+)/).forEach((w) => {
          if (!w.trim()) return f.append(w);
          const s = document.createElement("span");
          s.className = "word";
          s.style.setProperty("--delay", `${0.1 + i++ * 0.07}s`);
          s.textContent = w;
          f.append(s);
        });
        x.replaceWith(f);
      } else walk(x);
    });
  walk(el);
});
if (
  !matchMedia("(prefers-reduced-motion: reduce)").matches &&
  "IntersectionObserver" in window
) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.1 },
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    el.classList.add("will-reveal");
    observer.observe(el);
  });
}
document
  .querySelectorAll("[data-service-index]")
  .forEach((a) =>
    a.addEventListener(
      "click",
      () =>
        (document.querySelector("[name=service]").selectedIndex = Number(
          a.dataset.serviceIndex,
        )),
    ),
  );
const form = document.querySelector(".inquiry-form");
const fr = form.dataset.lang === "fr";
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const date = d.get("date");
  const msg = fr
    ? `Bonjour, je m’appelle ${d.get("name")}. Je suis dans le secteur ${d.get("area")} et j’aimerais discuter de : ${d.get("service")}.\n\n${d.get("details")}\n\nPourrions-nous discuter des prochaines étapes ?`
    : `Hi, I’m ${d.get("name")}. I’m in ${d.get("area")} and would like to ask about ${d.get("service")}.${date ? " My preferred date is " + date + "." : ""}\n\n${d.get("details")}\n\nCould we discuss the details and next steps?`;
  form.querySelector("[name=prepared-message]").value = msg;
  form.querySelector(".prepared").hidden = false;
  const mail = form.querySelector(".email-message");
  if (mail)
    mail.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent((fr ? "Demande — " : "Inquiry — ") + form.dataset.business)}&body=${encodeURIComponent(msg)}`;
  form.querySelector("[name=prepared-message]").focus();
});
form.querySelector(".copy-message").addEventListener("click", async () => {
  const t = form.querySelector("[name=prepared-message]"),
    s = form.querySelector(".copy-status");
  try {
    await navigator.clipboard.writeText(t.value);
    s.textContent = fr
      ? "Message copié. Communiquez directement pour continuer."
      : "Message copied. Continue directly with the business.";
  } catch {
    t.focus();
    t.select();
    s.textContent = fr
      ? "Sélectionnez et copiez le message ci-dessus."
      : "Select and copy the message above to continue.";
  }
});
const dialog = document.querySelector(".lightbox");
let opener;
document.querySelectorAll(".gallery-open").forEach((b) =>
  b.addEventListener("click", () => {
    opener = b;
    dialog.querySelector("img").src = b.dataset.image;
    dialog.querySelector("img").alt = b.dataset.caption;
    dialog.querySelector("p").textContent = b.dataset.caption;
    dialog.showModal();
  }),
);
dialog
  .querySelector(".lightbox-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});
dialog.addEventListener("close", () => opener?.focus());
document.querySelectorAll("[data-filter]").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll("[data-filter]")
      .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    document.querySelectorAll("[data-tone]").forEach((card) => {
      card.hidden =
        b.dataset.filter !== "all" && card.dataset.tone !== b.dataset.filter;
    });
  }),
);
const systems = {
  heating: [
    "Start with the warmth.",
    "Share your furnace, boiler or hot water tank type, what you have noticed, and the work you are considering.",
  ],
  cooling: [
    "Make room for cooler days.",
    "Tell us about your air conditioner, your space and the cooling project or issue you would like to discuss.",
  ],
  ventilation: [
    "A little more breathing room.",
    "Discuss exhaust fans, make-up air and the ventilation requirements of your property.",
  ],
};
const tabs = [...document.querySelectorAll("[data-system]")];
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.setAttribute("aria-selected", String(t === tab));
      t.tabIndex = t === tab ? 0 : -1;
    });
    const panel = document.querySelector("#system-content");
    panel.setAttribute("aria-labelledby", tab.id);
    panel.querySelector("h3").textContent = systems[tab.dataset.system][0];
    panel.querySelector("p").textContent = systems[tab.dataset.system][1];
  });
  tab.addEventListener("keydown", (e) => {
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const n =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? tabs.length - 1
            : (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) %
              tabs.length;
      tabs[n].focus();
      tabs[n].click();
    }
  });
});
