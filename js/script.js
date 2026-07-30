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

        instagram: "https://www.instagram.com/raphbrito",

        github: "https://github.com/raphbrito",
    
    },

    repository: "https://github.com/raphbrito/Eventos-de-Axe",

    version: "1.0.0"

};


/* ==========================================================
   DADOS DO EVENTO
========================================================== */

const event = EVENTO;

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

    eventInfo: {

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

    },

    system: {

        name: document.getElementById("systemName"),

        description: document.getElementById("systemDescription"),

        developer: document.getElementById("systemDeveloper"),

        instagram: document.getElementById("systemInstagram"),

        github: document.getElementById("systemGithub"),

        repository: document.getElementById("systemRepository")

    },

};

/* ==========================================================
   UTILITÁRIOS
========================================================== */

const DateUtils = (() => {

    "use strict";

    /* ==========================================================
       CONSTANTES
    ========================================================== */

    const BRAZILIAN_DATE_PATTERN =
        /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2}|\d{4})$/;

    const ISO_DATE_PATTERN =
        /^\d{4}-\d{2}-\d{2}(T.*)?$/;

    /* ==========================================================
       PARSER
    ========================================================== */

    function parse(value) {

        if (value instanceof Date) {

            return new Date(value.getTime());

        }

        if (
            typeof value === "number" &&
            Number.isFinite(value)
        ) {

            const date = new Date(value);

            if (Number.isNaN(date.getTime())) {

                throw new Error(
                    `Data inválida: ${value}`
                );

            }

            return date;

        }

        if (typeof value !== "string") {

            throw new Error(
                `Tipo de data não suportado: ${typeof value}`
            );

        }

        const input = value.trim();

        if (!input) {

            throw new Error(
                "A data informada está vazia."
            );

        }

        if (ISO_DATE_PATTERN.test(input)) {

            const date = new Date(input);

            if (Number.isNaN(date.getTime())) {

                throw new Error(
                    `Data ISO inválida: "${value}".`
                );

            }

            return date;

        }

        const brazilianMatch =
            input.match(BRAZILIAN_DATE_PATTERN);

        if (brazilianMatch) {

            let [
                ,
                day,
                month,
                year
            ] = brazilianMatch;

            day = Number(day);
            month = Number(month);

            if (year.length === 2) {

                year = Number(`20${year}`);

            } else {

                year = Number(year);

            }

            const date = new Date(
                year,
                month - 1,
                day
            );

            if (

                date.getFullYear() !== year ||

                date.getMonth() !== (month - 1) ||

                date.getDate() !== day

            ) {

                throw new Error(
                    `Data inválida: "${value}".`
                );

            }

            return date;

        }

        throw new Error(
            `Formato de data não suportado: "${value}".`
        );

    }

    /* ==========================================================
       VALIDAÇÃO
    ========================================================== */

    function isValid(value) {

        try {

            parse(value);

            return true;

        } catch {

            return false;

        }

    }

    /* ==========================================================
       FORMATAÇÃO
    ========================================================== */

    function short(value) {

        return parse(value).toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    }

    function long(value) {

        return parse(value).toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    }

    function time(value) {

        return parse(value).toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }

    function dateTime(value) {

        return `${short(value)} às ${time(value)}`;

    }

    function iso(value) {

        return parse(value).toISOString();

    }

    function rfc(value) {

        return parse(value).toUTCString();

    }

    /* ==========================================================
       API PÚBLICA
    ========================================================== */

    return {

        parse,

        isValid,

        short,

        long,

        time,

        dateTime,

        iso,

        rfc

    };

})();

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

    dom.eventInfo.date.textContent =

        DateUtils.long(
            event.data
        );

    dom.eventInfo.time.textContent =

        event.horario;

    dom.eventInfo.location.textContent =

        event.local;

    dom.eventInfo.address.textContent =

        `${event.endereco} - ${event.bairro} - ${event.cidade} - ${event.estado} - ${event.cep}`;

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

    const eventDate = DateUtils.parse(

        `${event.data} ${event.horario}`

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

    dom.system.instagram.href =

        system.developer.instagram;

    dom.system.github.href =

        system.developer.github;

    dom.system.repository.href =

        system.repository;

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

    if (!event.rsvp) {

        showToast(

            "Em breve",

            "O formulário de confirmação ainda não foi disponibilizado.",

            "warning"

        );

        return;

    }

    openExternalLink(

        event.rsvp

    );

}

/* ==========================================================
   GOOGLE MAPS
========================================================== */

function openGoogleMaps() {

    if (!event.googleMaps) {

        showToast(

            "Localização indisponível",

            "O link do Google Maps ainda não foi configurado.",

            "warning"

        );

        return;

    }

    openExternalLink(

        event.googleMaps

    );

}

/* ==========================================================
   WAZE
========================================================== */

function openWaze() {

    if (!event.waze) {

        showToast(

            "Localização indisponível",

            "O link do Waze ainda não foi configurado.",

            "warning"

        );

        return;

    }

    openExternalLink(

        event.waze

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

        config.toast.duration

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

}
