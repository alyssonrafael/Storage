import React, { useEffect, useState } from "react";

// propriedades que o mensagecard vai receber
type MensagemCardProps = {
  sucesso: boolean;
  mensagem: string;
};
// componente funcional mensage card
const MensagemCard: React.FC<MensagemCardProps> = ({ sucesso, mensagem }) => {

  const [isVisible, setIsVisible] = useState(false);//controla se a mensagem aparece ou nao
  const [progress, setProgress] = useState(100);//progresso da barrinha da mensagem

  useEffect(() => {
    //se hover uma mensagem ele seta a visibilidade como verdadeira e o progresso como 100
    if (mensagem) {
      setIsVisible(true);
      setProgress(100);
      //intervalo decrementar a cada 50milisegundo
      const interval = setInterval(() => {
        setProgress((prev) => (prev > 0 ? prev - 1 : 0));
      }, 50);
      //intevalo que a mensagem permanecde sendo exibida
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [mensagem]);//monitora a mensagem

  //retorno do componente da mensagem
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 p-4 transition-all duration-300 ease-in-out transform ${
        sucesso ? "bg-green-500" : "bg-red-500"
      } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} `}
    >
      <p className="text-white">{mensagem}</p>
      <div className="w-full bg-gray-300  h-1.5 mt-2 absolute bottom-0 left-0">
        <div
          className="bg-white h-1.5"
          style={{ width: `${progress}%` }} //largura definida pelo progresso
        ></div>
      </div>
    </div>
  );
};

export default MensagemCard;
