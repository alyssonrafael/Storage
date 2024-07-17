import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";

const Calendar = () => {

  const [currentMonth, setCurrentMonth] = useState(new Date()); // Estado para armazenar o mês atual
  const today = new Date(); // Obtém a data atual

  // Função para renderizar o cabeçalho do calendário com botões para navegar entre meses
  const renderHeader = () => {
    const dateFormat = "MMMM yyyy"; // Formato para exibir o nome completo do mês e o ano

    return (
      /* propriedades para responsividade do grid (sem prefixo e para telas pequenas md:para telas medias
     lg:para desktop se uma propriedade nao tiver outra que a anule ela permanece em todos os tipos)*/
      <div className="flex justify-between items-center py-2">
        {/* Botão para retroceder um mês */}
        <div
          className="cursor-pointer"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <span className="text-gray-800">&lt;</span>
        </div>
        {/* Exibe o nome do mês atual */}
        <div className="text-xl">
          <span>
            {format(currentMonth, dateFormat, {
              locale: ptBR,
            }).toLocaleUpperCase()} {/* Converte para maiúsculas */}
          </span>
        </div>
        {/* Botão para avançar um mês */}
        <div
          className="cursor-pointer"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <span className="text-gray-800">&gt;</span>
        </div>
      </div>
    );
  };

  // Função para renderizar os dias da semana (abreviados)
  const renderDays = () => {
    const dateFormat = "EEEEEE"; // Formato para exibir os dias abreviados (SEG, TER, ...)
    const days = [];

    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 }); // Obtém o primeiro dia da semana do mês atual

    // Loop para gerar os dias da semana
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center text-sm font-medium" key={i}>
          {format(addDays(startDate, i), dateFormat, { locale: ptBR })}
        </div>
      );
    }

    return <div className="grid grid-cols-7">{days}</div>; // Retorna os dias em uma grade de 7 colunas
  };

  // Função para renderizar as células do calendário (dias do mês)
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth); // Primeiro dia do mês atual
    const monthEnd = endOfMonth(monthStart); // Último dia do mês atual
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Primeiro dia da semana do mês
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 }); // Último dia da semana do mês

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    // Loop para gerar as linhas e colunas do calendário
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "dd"); // Formata o dia do mês como "dd"
        days.push(
          <div
            className={`p-1 text-center cursor-pointer ${
              !isSameMonth(day, monthStart) ? "text-gray-300" : ""
            } ${
              isSameDay(day, today)
                ? "bg-blaze-orange-500 text-white rounded-full"
                : ""
            }`}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1); // Avança para o próximo dia
      }
      rows.push(<div className="grid grid-cols-7">{days}</div>); // Adiciona uma linha de dias à matriz de linhas
      days = []; // Limpa o array de dias para a próxima linha
    }

    return <div>{rows}</div>; // Retorna todas as linhas do calendário
  };

  return (
    <div className="p-5 max-w-md mx-auto rounded-2xl shadow-2xl h-full flex flex-col justify-center">
      {renderHeader()} {/* Renderiza o cabeçalho do calendário */}
      <hr className="mb-4" />
      {renderDays()} {/* Renderiza os dias da semana */}
      {renderCells()} {/* Renderiza os dias do mês */}
    </div>
  );
};

export default Calendar;
