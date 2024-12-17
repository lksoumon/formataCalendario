// ==UserScript==
// @name         Formata Calendário
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Formata o calendário
// @author       Lucas S. Monteiro
// @match        http://sigeduca.seduc.mt.gov.br/grh/hwmgrhcalendarioimp.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @grant        none
// @updateURL    https://github.com/lksoumon/formataCalendario/raw/refs/heads/main/formataCalendario.user.js
// @downloadURL  https://github.com/lksoumon/formataCalendario/raw/refs/heads/main/formataCalendario.user.js
// ==/UserScript==

(function() {
    // Estilo para ocultar o menu durante a impressão

    if(document.getElementById("TTITULO")){
        var anoAnalise = document.getElementById("TTITULO").innerText.match(/\d{4}/);
        anoAnalise = anoAnalise[0];
    }
    var style = document.createElement('style');
    style.innerHTML = '@media print { #floating-menu { display: none !important; } }';
    document.head.appendChild(style);
    'use strict';
    const coresPasteis = ['#3b64a8', '#f94144', '#277da1', '#f3722c', '#90be6d', '#f5f533'];
        const outrasCoresPasteis = ['#f9c74f', '#ffcad4', '#cd9777', '#a751e0', '#61ffef', '#9fe802'];
        let Ncor = 0;
    let letivosSemana = [0,0,0,0,0,0,0];
    let letivosMes = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    let letivosBim = [0,0,0,0,0];
    let letivosAno = 0;

    function verificaFimDeSemana(data) {
        // Divide a string da data em dia, mês e ano
        const [dia, mes, ano] = data.split("/").map(Number);
        // Cria um objeto Date (o mês no JS é zero-based, subtrai 1)
        const dataObj = new Date(ano, mes - 1, dia);
        // Verifica se é sábado (6) ou domingo (0)
        const diaSemana = dataObj.getDay();

        if (diaSemana === 6 || diaSemana === 0) {
            return true;
        } else {
            return false;
        }
    }
    function numeroMes(data) {
    // Divide a data em dia, mês e ano
    const [dia, mes, ano] = data.split('/').map(Number);

    // Retorna o mês (já está no formato desejado, de 1 a 12)
    return mes;
}
    function numeroDiaSemana(data) {
        // Divide a string da data em dia, mês e ano
        const [dia, mes, ano] = data.split("/").map(Number);

        // Cria um objeto Date (mês é zero-based no JS, subtrai 1)
        const dataObj = new Date(ano, mes - 1, dia);

        // Retorna o índice do dia da semana (0 = domingo, 6 = sábado)
        return dataObj.getDay();
    }
    const diasSemana = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
     const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

        function formatarData(dia, mes) {
            const ano = anoAnalise;
            return `${("0" + dia).slice(-2)}/${("0" + mes).slice(-2)}/${ano}`;
        }

        function montarCalendario(eventos) {

            let calendarioHTML = `<style>

.letividades th {
            border: 1px solid #ccc;
            padding: 1px;
            background-color: lightgrey;
        }
        .letividades td {
            border: 1px solid #ccc;
            padding: 1px;
        }
        .calendario {
            border-collapse: collapse;
            width: 80%;
            margin: 0 auto;
        }
        .calendario th,
        .calendario td {
            border: 1px solid #ccc;
            padding: 8px;
            padding-bottom: 0px;
            vertical-align: top;
            font-size: 12px;
        }
        .calendario th {
            background-color: #f2f2f2;
            font-weight: bolder;
        }
        .mes {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .mes th,
        .mes td {
            border: 1px solid #ccc;
            padding: 4px;
            text-align: center;
        }
        .mes th {
            background-color: #f2f2f2;
        }
        h3,h4,h5,h6{
        text-align: center;
        font-weight: bold;
    }
    table {
        border: 1px solid #ccc;
        color: #333;
        font-family: Arial, sans-serif;

        font-weight: bold;
        width: 100%;
        border-collapse: collapse;
        padding: 5px;
        table-layout: fixed;
    }

            </style>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css">
            <h3 style="text-align:center">${document.getElementById("TTITULO").innerText}</h3>
            <div class="">

          <div class="row">
            <div class="col-8">


            <table class="calendario">`;
            let contadorMeses = 0;
            const mesesPorLinha = 2;

            meses.forEach((nomeMes, mesNumero) => {
                if (contadorMeses % mesesPorLinha === 0) {
                    calendarioHTML += '<tr>';
                }
                calendarioHTML += '<td><table class="mes"><tr><th colspan="7">' + nomeMes + '</th></tr>';
                calendarioHTML += '<tr><th>Dom</th><th>Seg</th><th>Ter</th><th>Qua</th><th>Qui</th><th>Sex</th><th>Sáb</th></tr>';
                calendarioHTML += preencherDiasDoMes(mesNumero + 1, eventos);
                calendarioHTML += '</table></td>';
                contadorMeses++;
                if (contadorMeses % mesesPorLinha === 0) {
                    calendarioHTML += '</tr>';
                }
            });

            calendarioHTML += `</table>
            </div>
            <div class="col-4">
            <table style="text-align:center">
                    <tr><th >LEGENDA</th></tr>`;
            for (let i = 1; i <= Ncor; i++) {
                calendarioHTML += '<tr><td style="background-color:'+coresPasteis[i]+'">Dias letivos do '+i+'º bimestre</td></tr>';
            }


                            calendarioHTML += '<tr><th style="background-color:'+outrasCoresPasteis[0]+'">Férias Escolares</th></tr>';
                            calendarioHTML += '<tr><th style="background-color:'+outrasCoresPasteis[5]+'">Semana Pedagógica</th></tr>';
                            calendarioHTML += '<tr><th style="background-color:white">Pontos Facultativos</th></tr>';
                            calendarioHTML += '<tr><th style="background-color:'+outrasCoresPasteis[1]+'">Feriados</th></tr>';
                            calendarioHTML += '<tr><th style="background-color:'+outrasCoresPasteis[3]+'">Paralisações</th></tr>';
                            //calendarioHTML += '<tr><th style="background-color:'+outrasCoresPasteis[4]+'">Reposições</th></tr>';
                            calendarioHTML += '<tr><th style="background-color:'+outrasCoresPasteis[4]+'">Conselho de Classe</th></tr></table><br><br>';

            calendarioHTML +=`<table class="letividades" style="text-align:center">
                    <tr><th >Dias letivos por bimestre</th></tr>`;
            for (let i = 1; i <= Ncor; i++) {
                calendarioHTML += `<tr><td>${i}.ºbim - ${letivosBim[i]} dias letivos</td></tr>`;
            }
            calendarioHTML += '</table><br><br>';

            calendarioHTML +=`<table class="letividades" style="text-align:center">
                    <tr><th >Dias letivos por dia da semana</th></tr>`;
            for (let i = 1; i <= 6; i++) {
                calendarioHTML += `<tr><td>${diasSemana[i]} - ${letivosSemana[i]} dias letivos</td></tr>`;
            }
            calendarioHTML += '</table><br><br>';

            calendarioHTML +=`<table class="letividades" style="text-align:center">
                    <tr><th >Dias letivos por mês</th></tr>`;
            for (let i = 0; i <= 11; i++) {
                calendarioHTML += `<tr><td>${meses[i]} - ${letivosMes[i]} dias letivos</td></tr>`;
            }
            calendarioHTML += '</table><br><br>';

          calendarioHTML +=`
           <h4>${letivosAno} dias letivos no ano</h4>  </div>

            `;
            return calendarioHTML;
        }

        function preencherDiasDoMes(mes, eventos) {
            const primeiroDia = new Date( anoAnalise, mes - 1, 1);
            const ultimoDia = new Date(anoAnalise, mes, 0).getDate();
            let html = '<tr>';
            for (let i = 0; i < primeiroDia.getDay(); i++) {
                html += '<td></td>';
            }

            for (let dia = 1; dia <= ultimoDia; dia++) {
                const data = formatarData(dia, mes);
                const info = eventos[data] || '';console.log(eventos["01/04/2025"],data);
                const cor = definirCor(info,data);
                html += `<td style="background-color:${cor};">${dia}</td>`;

                if ((dia + primeiroDia.getDay()) % 7 === 0) {
                    html += '</tr><tr>';
                }
            }

            return html + '</tr>';
        }

        function definirCor(info,dia) {//console.log(info);
            if (info.includes('CC')) return outrasCoresPasteis[4];
            if (info.includes('IB')){ Ncor++; console.log(Ncor)};
            if (info.includes('L')) {
                letivosAno++;
                letivosBim[Ncor]++;
                letivosMes[numeroMes(dia)-1]++;
                letivosSemana[numeroDiaSemana(dia)]++;

                return coresPasteis[Ncor]

            };
            if (info.includes('FN')) return outrasCoresPasteis[1];
            if (info.includes('FM')) return outrasCoresPasteis[1];
            if (info.includes('FE')) return outrasCoresPasteis[1];

            if (info.includes('PF')) return outrasCoresPasteis[0];
            if (info.includes('PA')) return outrasCoresPasteis[3];
            if (info.includes('SP')) return outrasCoresPasteis[5];

             if (verificaFimDeSemana(dia)) return 'LightSteelBlue';
            return '#ffffff';
        }
        function abrirNovaAba(conteudo) {
            const novaJanela = window.open('', '_blank');
            novaJanela.document.write(`
                <html>
                <head><title>Calendário Gerado</title></head>
                <body>${conteudo}</body>
                </html>
            `);
            novaJanela.document.close();
        }




    // Adicionar botão flutuante
    const button = document.createElement('button');
    button.innerText = 'Gerar Calendário';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '5px';
     button.setAttribute('id', 'floating-menu');

    document.body.appendChild(button);
    let diasLetivos = {};
    // Função principal ao clicar no botão
    button.addEventListener('click', function() {
     const iframeWindow = document.contentWindow;

    for(var i = 1; i <= 30; i++){
        for(var j = 1; j <= 50; j++){
            let iserv = ("0000" + i).slice(-4);
            let jserv = ("0000" + j).slice(-4);//W00470001TLEGENDA_0002
            let datado = document.getElementById("span_W0047"+iserv+"vDATAINDICE_"+jserv);//console.log(i,j,datado);
            let datadoDisc = document.getElementById("W0047"+iserv+"TLEGENDA_"+jserv);//console.log(i,j,datadoDisc);
            if(datado != null && datadoDisc != null){
                let didia = document.getElementById("span_W0047"+iserv+"vDATAINDICE_"+jserv).innerText.trim();
                let discrica = document.getElementById("W0047"+iserv+"TLEGENDA_"+jserv).innerText.trim();
                //console.log('foi',discrica);
                //if(discrica == "L" || discrica.includes("- L") || discrica.includes("L -")){

                    const [dia, mes, ano] = didia.split('/');
                    // Adiciona "20" na frente do ano para converter "yy" em "yyyy"
                    const anoCompleto = anoAnalise;
                   // const anoCompleto = ano.length === 2 ? '20' + ano : ano;
                    didia = `${dia}/${mes}/${anoCompleto}`;

                diasLetivos[didia] = discrica;

                    //diasLetivos.push(didia);
                //}
                //console.log(parent.frames[0].document.getElementById("span_W0047"+iserv+"vDATAINDICE_"+jserv).innerText.trim());
            }
        }
    }
    console.log(diasLetivos);

        const calendarioHTML = montarCalendario(diasLetivos);
        abrirNovaAba(calendarioHTML);



    });





})();
