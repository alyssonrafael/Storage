// Define as propriedades (props) que o componente Card aceitará
interface CardProps {
  title: string;    // O título do card
  subtitle: number | string;    // O subtítulo do card, que pode ser um número ou uma string
}

// Define o componente Card como um Functional Component do React com as propriedades definidas
const Card: React.FC<CardProps> = ({ title, subtitle }) => {
  return (
    // Container do card com estilo de fundo laranja, bordas arredondadas, sombra e texto branco
    <div className="bg-blaze-orange-500 rounded-2xl shadow-xl text-white p-4 flex flex-col items-center">
      {/* Título do card com estilo de texto extra grande */}
      <h2 className="text-xl">{title}</h2>
      {/* Subtítulo do card com estilo de texto maior e negrito, com margem superior */}
      <p className="text-2xl font-bold mt-2">{subtitle}</p>
    </div>
  );
};

export default Card;
