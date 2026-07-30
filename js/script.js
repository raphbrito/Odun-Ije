"use strict";

/* ==========================================================
   CONFIGURAÇÃO
========================================================== */

const config = {

    toast: {

        duration: 5000

    }

};

/* ==========================================================
   DADOS DO SISTEMA
========================================================== */

const system = {

    name: "Eventos de Axé",

    description:
        "Plataforma para gerenciamento de convites, RSVP e eventos de comunidades de matriz africana.",

    developer: {

        name: "Rafael Brito",

        github: "https://github.com/raphbrito",

        repository: "https://github.com/raphbrito/Eventos-de-Axe"

    },

    version: "1.0.0"

};

/* ==========================================================
   DOM
========================================================== */

const dom = {

    countdown: {

        days: document.getElementById("days"),

        hours: document.getElementById("hours"),

        minutes: document.getElementById("minutes"),

        seconds: document.getElementById("seconds")

    },

    event: {

        date: document.getElementById("eventDate"),

        time: document.getElementById("eventTime"),

        location: document.getElementById("eventLocation"),

        address: document.getElementById("eventAddress")

    },

    buttons: {

        rsvp: document.getElementById("btnRSVP"),

        googleMaps: document.getElementById("btnGoogleMaps"),

        waze: document.getElementById("btnWaze")

    },

    toast: {

        container: document.getElementById("toast"),

        title: document.getElementById("toastTitle"),

        message: document.getElementById("toastMessage"),

        close: document.getElementById("toastClose")

    },

    footer: {

        currentYear: document.getElementById("currentYear")

    }
    
    };

/* ==========================================================
   ESTADO DA APLICAÇÃO
========================================================== */

const state = {

    countdownTimer: null,

    toastTimer: null

};

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initialize

);

/* ==========================================================
   INFORMAÇÕES DO EVENTO
========================================================== */

function initializeEventInformation() {

    const eventDate = new Date(

        config.event.date

    );

    dom.event.date.textContent =

        eventDate.toLocaleDateString(

            "pt-BR",

            {

                weekday: "long",

                day: "2-digit",

                month: "long",

                year: "numeric"

            }

        );

    dom.event.time.textContent =

        eventDate.toLocaleTimeString(

            "pt-BR",

            {

                hour: "2-digit",

                minute: "2-digit"

            }

        );

    dom.event.location.textContent =

        config.event.location;

    dom.event.address.textContent =

        config.event.address;

}

/* ==========================================================
   CONTAGEM REGRESSIVA
========================================================== */

function initializeCountdown() {

    updateCountdown();

    state.countdownTimer = window.setInterval(

        updateCountdown,

        1000

    );

}

function updateCountdown() {

    const remainingTime = getRemainingTime();

    renderCountdown(

        remainingTime

    );

    if (!remainingTime.expired) {

        return;

    }

    window.clearInterval(

        state.countdownTimer

    );

}

/* ==========================================================
   CÁLCULO DO TEMPO
========================================================== */

function getRemainingTime() {

    const now = new Date();

    const eventDate = new Date(

        config.event.date

    );

    const difference = eventDate - now;

    if (difference <= 0) {

        return {

            expired: true,

            days: 0,

            hours: 0,

            minutes: 0,

            seconds: 0

        };

    }

    const totalSeconds = Math.floor(

        difference / 1000

    );

    return {

        expired: false,

        days: Math.floor(

            totalSeconds / 86400

        ),

        hours: Math.floor(

            (totalSeconds % 86400) / 3600

        ),

        minutes: Math.floor(

            (totalSeconds % 3600) / 60

        ),

        seconds:

            totalSeconds % 60

    };

}

/* ==========================================================
   RENDERIZAÇÃO
========================================================== */

function renderCountdown(time) {

    dom.countdown.days.textContent =

        time.days;

    dom.countdown.hours.textContent =

        formatNumber(

            time.hours

        );

    dom.countdown.minutes.textContent =

        formatNumber(

            time.minutes

        );

    dom.countdown.seconds.textContent =

        formatNumber(

            time.seconds

        );

}

function formatNumber(value) {

    return String(value).padStart(

        2,

        "0"

    );

}

/* ==========================================================
   RODAPÉ
========================================================== */

function initializeFooter() {

    dom.footer.currentYear.textContent =

        new Date().getFullYear();

    dom.system.name.textContent =

        system.name;

    dom.system.description.textContent =

        system.description;

    dom.system.developer.textContent =

        system.developer.name;

    dom.system.developer.href =

        system.developer.github;

    dom.system.github.href =

        system.developer.github;

    dom.system.repository.href =

        system.developer.repository;

}

/* ==========================================================
   BOTÕES E NAVEGAÇÃO
========================================================== */

function initializeButtons() {

    if (dom.buttons.rsvp) {

        dom.buttons.rsvp.addEventListener(

            "click",

            openRsvp

        );

    }

    if (dom.buttons.googleMaps) {

        dom.buttons.googleMaps.addEventListener(

            "click",

            openGoogleMaps

        );

    }

    if (dom.buttons.waze) {

        dom.buttons.waze.addEventListener(

            "click",

            openWaze

        );

    }

}

/* ==========================================================
   RSVP
========================================================== */

function openRsvp() {

    if (!config.urls.rsvp) {

        showToast(

            "Em breve",

            "O formulário de confirmação ainda não foi disponibilizado.",

            "warning"

        );

        return;

    }

    openExternalLink(

        config.urls.rsvp

    );

}

/* ==========================================================
   GOOGLE MAPS
========================================================== */

function openGoogleMaps() {

    if (!config.urls.googleMaps) {

        showToast(

            "Localização indisponível",

            "O link do Google Maps ainda não foi configurado.",

            "warning"

        );

        return;

    }

    openExternalLink(

        config.urls.googleMaps

    );

}

/* ==========================================================
   WAZE
========================================================== */

function openWaze() {

    if (!config.urls.waze) {

        showToast(

            "Localização indisponível",

            "O link do Waze ainda não foi configurado.",

            "warning"

        );

        return;

    }

    openExternalLink(

        config.urls.waze

    );

}

/* ==========================================================
   LINKS EXTERNOS
========================================================== */

function openExternalLink(url) {

    window.open(

        url,

        "_blank",

        "noopener,noreferrer"

    );

}

/* ==========================================================
   TOAST
========================================================== */

function initializeToast() {

    if (!dom.toast.close) {

        return;

    }

    dom.toast.close.addEventListener(

        "click",

        hideToast

    );

}

function showToast(title, message, type = "success") {

    const toast = dom.toast.container;

    if (!toast) {

        return;

    }

    window.clearTimeout(

        state.toastTimer

    );

    toast.classList.remove(

        "toast-success",
        "toast-warning",
        "toast-error"

    );

    toast.classList.add(

        `toast-${type}`

    );

    dom.toast.title.textContent =

        title;

    dom.toast.message.textContent =

        message;

    toast.classList.add(

        "is-visible"

    );

    state.toastTimer = window.setTimeout(

        hideToast,

        config.app.toastDuration

    );

}

function hideToast() {

    const toast = dom.toast.container;

    if (!toast) {

        return;

    }

    window.clearTimeout(

        state.toastTimer

    );

    toast.classList.remove(

        "is-visible"

    );

}

/* ==========================================================
   PÁGINA
========================================================== */

function initializePage() {

    initializeCountdown();

    initializeEventInformation();

    initializeFooter();

}

/* ==========================================================
   APLICAÇÃO
========================================================== */

function initialize() {

    initializePage();

    initializeButtons();

    initializeToast();

    initializeSystem();
}
