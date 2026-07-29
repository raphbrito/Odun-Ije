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
            generateFilename(CONFIG.exportTypes.official)
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
            generateFilename(CONFIG.exportTypes.reception)
        );

    }

    /**
     * Monta o cabeçalho da Lista Oficial.
     *
     * @param {Object} document Instância do jsPDF.
     * @param {Object} context Contexto da exportação.
     */
    function buildOfficialHeader(document, context) {

    }

    /**
     * Monta o resumo da Lista Oficial.
     *
     * @param {Object} document Instância do jsPDF.
     * @param {Object} summary Resumo da exportação.
     */
    function buildOfficialSummary(document, summary) {

    }

    /**
     * Monta a tabela da Lista Oficial.
     *
     * @param {Object} document Instância do jsPDF.
     * @param {Array} guests Lista de convidados confirmados.
     */
    function buildOfficialTable(document, guests) {

    }

    /**
     * Monta o cabeçalho da Lista de Recepção.
     *
     * @param {Object} document Instância do jsPDF.
     * @param {Object} context Contexto da exportação.
     */
    function buildReceptionHeader(document, context) {

    }

    /**
     * Monta a tabela da Lista de Recepção.
     *
     * @param {Object} document Instância do jsPDF.
     * @param {Array} guests Lista de convidados confirmados.
     */
    function buildReceptionTable(document, guests) {

    }

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
            generateFilename(CONFIG.exportTypes.excel)
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
     * @param {String} exportType Tipo da exportação.
     * @returns {String}
     */
    function generateFilename(exportType) {

        const today = new Date();

        const year = today.getFullYear();

        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            today.getDate()
        ).padStart(2, "0");

        return `${EVENTO.slug}-${exportType}-${year}-${month}-${day}`;

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