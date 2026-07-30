/**
 * ============================================================
 * Exports
 * ============================================================
 * Responsável pela geração dos arquivos exportáveis do sistema.
 *
 * O módulo não conhece o Dashboard, a Tabela ou o estado global.
 * Toda exportação é construída a partir do contexto recebido.
 *
 * Tipos suportados:
 * - PDF - Lista Oficial
 * - PDF - Lista de Recepção
 * - Excel (.xlsx)
 * ============================================================
 */

const Exports = (() => {

    "use strict";

    // ============================================================
    // Configuração
    // ============================================================

    const CONFIG = {

        //company: {
        //    application: "Dashboard - Odún Ìjé"
        //},

        exportTypes: {

            official: "Lista-Convidados",

            reception: "Lista-Recepcao",

            excel: "Convidados"

        },

        titles: {

            official: "Lista Oficial de Convidados",

            reception: "Lista de Recepção"

        },

        pdf: {

            pageSize: "a4",

            orientation: "portrait",

            margin: 15

        },

        columns: {

            official: [
                "Convidado",
                "Acompanhantes"
            ],

            reception: [
                "Convidado",
                "Acompanhantes",
                "Check-in"
            ],

            excel: [
                "Convidado",
                "Confirmação",
                "Acompanhantes",
                "Total",
                "Data da Resposta"
            ]

        }

    };

    // ============================================================
    // Fim da Configuração
    // ============================================================

    // ============================================================
    // Inicialização
    // ============================================================

    /**
     * Inicializa o módulo de exportação.
     */
    function init() {

        console.info("Módulo Exports inicializado.");

    }

    // ============================================================
    // Fim da Inicialização
    // ============================================================

    // ============================================================
    // Exportações Públicas
    // ============================================================

    /**
     * Exporta a Lista Oficial de Convidados em PDF.
     *
     * @param {Object} context Contexto da exportação.
     */
    function exportOfficialPdf(context) {

        createOfficialPdf(context);

    }

    /**
     * Exporta a Lista de Recepção em PDF.
     *
     * @param {Object} context Contexto da exportação.
     */
    function exportReceptionPdf(context) {

        createReceptionPdf(context);

    }

    /**
     * Exporta a lista completa em Excel.
     *
     * @param {Object} context Contexto da exportação.
     */
    function exportExcel(context) {

        createWorkbook(context);

    }

    // ============================================================
    // Fim das Exportações Públicas
    // ============================================================

    // ============================================================
    // Preparação dos Dados
    // ============================================================

    /**
     * Retorna apenas os convidados confirmados.
     *
     * @param {Object} context Contexto da exportação.
     * @returns {Array}
     */
    function getConfirmedGuests(context) {

        return context.guests.filter((guest) => guest.confirmado);

    }

    /**
     * Calcula o resumo utilizado na Lista Oficial.
     *
     * @param {Object} context Contexto da exportação.
     * @returns {Object}
     */
    function getSummary(context) {

        const confirmedGuests = getConfirmedGuests(context);

        const totalGuests = confirmedGuests.length;

        const totalCompanions = confirmedGuests.reduce((total, guest) => {

            return total + Number(guest.acompanhantes || 0);

        }, 0);

        return {

            totalResponses: context.guests.length,

            totalConfirmed: totalGuests,

            totalCompanions: totalCompanions,

            totalExpected: totalGuests + totalCompanions

        };

    }

    // ============================================================
    // Fim da Preparação dos Dados
    // ============================================================

    // ============================================================
    // Construção dos PDFs
    // ============================================================

    /**
     * Cria o PDF da Lista Oficial de Convidados.
     *
     * @param {Object} context Contexto da exportação.
     */
    function createOfficialPdf(context) {

        const confirmedGuests = getConfirmedGuests(context);

        const summary = getSummary(context);

        const document = new jspdf.jsPDF({

            orientation: CONFIG.pdf.orientation,

            unit: "mm",

            format: CONFIG.pdf.pageSize

        });

        buildOfficialHeader(document, context);

        buildOfficialSummary(document, summary);

        buildOfficialTable(document, confirmedGuests);

        document.save(
            `${generateFilename(
                context.event,
                CONFIG.exportTypes.official
            )}.pdf`
        );

    }

    /**
     * Cria o PDF da Lista de Recepção.
     *
     * @param {Object} context Contexto da exportação.
     */
    function createReceptionPdf(context) {

        const confirmedGuests = getConfirmedGuests(context);

        const document = new jspdf.jsPDF({

            orientation: CONFIG.pdf.orientation,

            unit: "mm",

            format: CONFIG.pdf.pageSize

        });

        buildReceptionHeader(document, context);

        buildReceptionTable(document, confirmedGuests);

        document.save(
            `${generateFilename(
                context.event,
                CONFIG.exportTypes.reception
            )}.pdf`
        );

    }

    // ============================================================
    // Início do Cabeçalho da Lista Oficial
    // ============================================================

    /**
     * Monta o cabeçalho da Lista Oficial.
     *
     * @param {Object} document Instância do jsPDF.
     * @param {Object} context Contexto da exportação.
     */
    function buildOfficialHeader(document, context) {

        const event = context.event;

        const left = CONFIG.pdf.margin;

        let top = CONFIG.pdf.margin;

        document.setFont("helvetica", "normal");

        document.setFontSize(8);

        document.setTextColor(110);

        document.text(
            "Documento gerado automaticamente pelo sistema Eventos de Axé © 2026.",
            left,
            top
        );

        top += 10;

        document.setFont("helvetica", "bold");

        document.setFontSize(18);

        document.setTextColor(40);

        document.text(
            "[Logo do evento]",
            left,
            top
        );

        top += 10;

        document.setFontSize(16);

        document.text(
            "Painel Administrativo",
            left,
            top
        );

        top += 12;

        document.setFont("helvetica", "bold");

        document.setFontSize(10);

        document.text(
            "Evento:",
            left,
            top
        );

        document.setFont("helvetica", "normal");

        document.text(
            String(event.nome),
            left + 22,
            top
        );

        top += 8;

        document.setFont("helvetica", "bold");

        document.text(
            "Data do evento:",
            left,
            top
        );

        document.setFont("helvetica", "normal");

        document.text(
            `${event.data} às ${event.horario}`,
            left + 32,
            top
        );

        top += 8;

        document.setFont("helvetica", "bold");

        document.text(
            "Documento gerado em:",
            left,
            top
        );

        document.setFont("helvetica", "normal");

        document.text(
            context.generatedAt.toLocaleString("pt-BR"),
            left + 45,
            top
        );

        top += 8;

        document.setDrawColor(180);

        document.line(
            left,
            top,
            210 - left,
            top
        );

    }

    // ============================================================
    // Fim do Cabeçalho da Lista Oficial
    // ============================================================

    /**
     * Monta o resumo da Lista Oficial.
     *
     * @param {Object} document Instância do jsPDF.
     * @param {Object} summary Resumo da exportação.
     */
    function buildOfficialSummary(document, summary) {

        const left = CONFIG.pdf.margin;

        let top = 73;

        document.setFont("helvetica", "bold");

        document.setFontSize(12);

        document.setTextColor(40);

        document.text(
            "Resumo",
            left,
            top
        );

        top += 8;

        document.setFont("helvetica", "normal");

        document.setFontSize(10);

        document.text(
            `Respostas recebidas: ${summary.totalResponses}`,
            left,
            top
        );

        top += 7;

        document.text(
            `Total de Confirmados: ${summary.totalConfirmed}`,
            left,
            top
        );

        top += 7;

        document.text(
            `Total de recusas: ${summary.totalResponses - summary.totalConfirmed}`,
            left,
            top
        );

        top += 7;

        document.text(
            `Total de acompanhantes: ${summary.totalCompanions}`,
            left,
            top
        );

        top += 7;

        document.text(
            `Total de pessoas esperadas: ${summary.totalExpected}`,
            left,
            top
        );

        top += 8;

        document.setDrawColor(180);

        document.line(
            left,
            top,
            210 - left,
            top
        );

    }

    // ============================================================
    // Fim do Resumo da Lista Oficial
    // ============================================================

    // ============================================================
    // Início da Tabela da Lista Oficial
    // ============================================================

    /**
     * Monta a tabela da Lista Oficial.
     *
     * @param {Object} document Instância do jsPDF.
     * @param {Array} guests Lista de convidados confirmados.
     */
    function buildOfficialTable(document, guests) {

        const body = guests.map((guest) => {

            return [

                guest.nome,

                "Confirmado",

                Number(guest.acompanhantes || 0),

                guest.dataResposta
                    ? formatDate(guest.dataResposta)
                    : ""

            ];

        });

        document.autoTable({

            startY: 118,

            head: [[

                "Convidado",

                "Status",

                "Acompanhantes",

                "Respondido em"

            ]],

            body,

            theme: "grid",

            styles: {

                font: "helvetica",

                fontSize: 9,

                cellPadding: 2,

                valign: "middle"

            },

            headStyles: {

                fillColor: [40, 40, 40],

                textColor: 255,

                fontStyle: "bold"

            },

            columnStyles: {

                0: {

                    cellWidth: 85

                },

                1: {

                    halign: "center",

                    cellWidth: 32

                },

                2: {

                    halign: "center",

                    cellWidth: 32

                },

                3: {

                    halign: "center",

                    cellWidth: 40

                }

            }

        });

    }

    // ============================================================
    // Fim da Tabela da Lista Oficial
    // ============================================================

    // ============================================================
    // Início do Cabeçalho da Lista de Recepção
    // ============================================================

    /**
     * Monta o cabeçalho da Lista de Recepção.
     *
     * @param {Object} document Instância do jsPDF.
     * @param {Object} context Contexto da exportação.
     */
    function buildReceptionHeader(document, context) {

        const event = context.event;

        const summary = getSummary(context);

        const left = CONFIG.pdf.margin;

        let top = CONFIG.pdf.margin;

        document.setFont("helvetica", "normal");

        document.setFontSize(8);

        document.setTextColor(110);

        document.text(
            "Documento gerado automaticamente pelo sistema Eventos de Axé © 2026.",
            left,
            top
        );

        top += 10;

        document.setFont("helvetica", "bold");

        document.setFontSize(18);

        document.setTextColor(40);

        document.text(
            "[Logo do evento]",
            left,
            top
        );

        top += 10;

        document.setFontSize(16);

        document.text(
            "Lista de Recepção",
            left,
            top
        );

        top += 12;

        document.setFont("helvetica", "bold");

        document.setFontSize(10);

        document.text(
            "Evento:",
            left,
            top
        );

        document.setFont("helvetica", "normal");

        document.text(
            String(event.nome),
            left + 22,
            top
        );

        top += 8;

        document.setFont("helvetica", "bold");

        document.text(
            "Data do evento:",
            left,
            top
        );

        document.setFont("helvetica", "normal");

        document.text(
            `${event.data} às ${event.horario}`,
            left + 32,
            top
        );

        top += 8;

        document.setFont("helvetica", "bold");

        document.text(
            "Documento gerado em:",
            left,
            top
        );

        document.setFont("helvetica", "normal");

        document.text(
            context.generatedAt.toLocaleString("pt-BR"),
            left + 45,
            top
        );

        top += 8;

        document.setDrawColor(180);

        document.line(
            left,
            top,
            210 - left,
            top
        );

        top += 8;

        document.setFont("helvetica", "bold");

        document.setFontSize(12);

        document.setTextColor(40);

        document.text(
            "Resumo",
            left,
            top
        );

        top += 8;

        document.setFont("helvetica", "normal");

        document.setFontSize(10);

        document.text(
            `Total de convidados: ${summary.totalConfirmed}`,
            left,
            top
        );

        top += 7;

        document.text(
            `Total de acompanhantes: ${summary.totalCompanions}`,
            left,
            top
        );

        top += 7;

        document.text(
            `Total de pessoas esperadas: ${summary.totalExpected}`,
            left,
            top
        );

        top += 8;

        document.setDrawColor(180);

        document.line(
            left,
            top,
            210 - left,
            top
        );

    }

    // ============================================================
    // Fim do Cabeçalho da Lista de Recepção
    // ============================================================

    // ============================================================
    // Início da Tabela da Lista de Recepção
    // ============================================================

    /**
     * Monta a tabela da Lista de Recepção.
     *
     * @param {Object} document Instância do jsPDF.
     * @param {Array} guests Lista de convidados confirmados.
     */
    function buildReceptionTable(document, guests) {

        const body = guests.map((guest) => {

            return [

                guest.nome,

                Number(guest.acompanhantes || 0),

                ""

            ];

        });

        document.autoTable({

            startY: 110,

            head: [[

                "Convidado",

                "Acompanhantes",

                "Check-in"

            ]],

            body,

            theme: "grid",

            styles: {

                font: "helvetica",

                fontSize: 9,

                cellPadding: 3,

                valign: "middle"

            },

            headStyles: {

                fillColor: [40, 40, 40],

                textColor: 255,

                fontStyle: "bold"

            },

            columnStyles: {

                0: {

                    cellWidth: 115

                },

                1: {

                    halign: "center",

                    cellWidth: 30

                },

                2: {

                    halign: "center",

                    cellWidth: 40

                }

            }

        });

    }

    // ============================================================
    // Fim da Tabela da Lista de Recepção
    // ============================================================
    
    // ============================================================
    // Fim da Construção dos PDFs
    // ============================================================

    // ============================================================
    // Construção do Excel
    // ============================================================

    /**
     * Cria o arquivo Excel com a lista completa de convidados.
     *
     * @param {Object} context Contexto da exportação.
     */
    function createWorkbook(context) {

        const worksheet = buildWorksheet(context);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Convidados"
        );

        XLSX.writeFile(
            workbook,
            `${generateFilename(
                context.event,
                CONFIG.exportTypes.excel
            )}.xlsx`
        );

    }

    /**
     * Monta a planilha utilizada na exportação Excel.
     *
     * @param {Object} context Contexto da exportação.
     * @returns {Object}
     */
    function buildWorksheet(context) {

        const rows = context.guests.map((guest) => {

            return {

                "Convidado": guest.nome,

                "Confirmação": guest.confirmado
                    ? "Confirmado"
                    : "Não Confirmado",

                "Acompanhantes": Number(guest.acompanhantes || 0),

                "Total": Number(guest.acompanhantes || 0) + 1,

                "Data da Resposta": guest.dataResposta

            };

        });

        return XLSX.utils.json_to_sheet(rows);

    }

    // ============================================================
    // Fim da Construção do Excel
    // ============================================================

    // ============================================================
    // Utilidades
    // ============================================================

    /**
     * Gera o nome do arquivo utilizando o evento e a data atual.
     *
     * @param {Object} event Dados do evento.
     * @param {String} exportType Tipo da exportação.
     * @returns {String}
     */
    function generateFilename(event, exportType) {

        const today = new Date();

        const year = today.getFullYear();

        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            today.getDate()
        ).padStart(2, "0");

        return `${event.slug}-${exportType}-${year}-${month}-${day}`;

    }

    /**
     * Formata uma data para o padrão brasileiro.
     *
     * @param {Date|String} date Data a ser formatada.
     * @returns {String}
     */
    function formatDate(date) {

        return new Intl.DateTimeFormat(
            "pt-BR"
        ).format(new Date(date));

    }

    // ============================================================
    // Fim das Utilidades
    // ============================================================

    // ============================================================
    // API Pública
    // ============================================================

        return {

        init,

        exportOfficialPdf,

        exportReceptionPdf,

        exportExcel

    };

    // ============================================================
    // Fim da API Pública
    // ============================================================

})();

/**
 * ============================================================
 * Fim do Módulo Exports
 * ============================================================
 */